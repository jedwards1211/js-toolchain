#!/usr/bin/env node

const spawn = require('./spawn')
const path = require('path')
const fs = require('fs-extra')
const toolchainPackageJson = require('../package.json')
const toolchainName = toolchainPackageJson.name
const toolchainDepsSet = new Set(Object.keys(toolchainPackageJson.dependencies))
const updateFile = require('./updateFile')
const obsoleteDeps = require('./obsoleteDeps')

const content = path.resolve(__dirname, '..', 'content')
const circleciConfigYml = path.join('.circleci', 'config.yml')

function set(src, more) {
  let changed = false
  for (const key in more) {
    if (src[key] !== more[key]) {
      if (!changed) src = { ...src }
      changed = true
      src[key] = more[key]
    }
  }
  return src
}

function merge(src, more) {
  if (!(src instanceof Object)) return more
  let changed = false
  for (const key in more) {
    const merged = merge(src[key], more[key])
    if (src[key] !== merged) {
      if (!changed) src = { ...src }
      changed = true
      src[key] = merged
    }
  }
  return src
}

function without(src, ...keys) {
  let changed = false
  for (const key of keys) {
    if (src[key]) {
      if (!changed) src = { ...src }
      changed = true
      delete src[key]
    }
  }
  return src
}

async function bootstrap(options = {}) {
  const args = options.args || {}
  const hard = args.indexOf('--hard') >= 0
  if (hard) {
    await Promise.all(
      [
        '.babelrc',
        '.babelrc.json',
        '.babelrc.js',
        '.babelrc.cjs',
        '.babelrc.mjs',
        'babel.config.json',
        'babel.config.js',
        'babel.config.cjs',
        'babel.config.mjs',
        '.eslintrc.js',
        '.eslintrc.cjs',
        '.eslintrc.yaml',
        '.eslintrc.yml',
        '.eslintrc.json',
        '.eslintrc',
        '.prettierrc',
        '.prettierrc.json',
        '.prettierrc.json5',
        '.prettierrc.yml',
        '.prettierrc.yaml',
        '.prettierrc.toml',
        '.prettierrc.js',
        '.prettierrc.cjs',
        'prettier.config.js',
        'prettier.config.cjs',
        '.npmignore',
        '.gitignore',
        '.eslintignore',
        'commitlint.config.js',
        '.commitlintrc.js',
        '.commitlintrc.json',
        '.commitlintrc.yml',
        '.lintstagedrc',
        'lint-staged.config.js',
        '.nycrc',
        '.nycrc.json',
        '.nycrc.yaml',
        '.nycrc.yml',
        'nyc.config.js',
        '.github/renovate.json',
        '.github/renovate.json5',
        '.gitlab/renovate.json',
        '.gitlab/renovate.json5',
        '.renovaterc.json',
        'renovate.json',
        'renovate.json5',
        '.renovaterc',
        '.travis.yml',
        'solano.yml',
      ].map((file) => fs.remove(file))
    )
  }

  const packageJson = await fs.readJson('package.json')

  async function writeConfig(file, getContent) {
    await updateFile(file, 'utf8', async (current) =>
      hard || current.indexOf(toolchainName) < 0
        ? (await getContent()).replace(
            '${process.env.npm_package_name}',
            toolchainName
          )
        : null
    )
  }
  await writeConfig('babel.config.js', () =>
    fs.readFile(
      packageJson.devDependencies &&
        packageJson.devDependencies['babel-plugin-flow-runtime']
        ? require.resolve('../content/babel.config.flow-runtime.js')
        : require.resolve('../content/babel.config.js'),
      'utf8'
    )
  )
  for (const file of [
    '.eslintrc.js',
    'commitlint.config.js',
    'lint-staged.config.js',
    'nyc.config.js',
    'prettier.config.js',
    'husky.config.js',
  ]) {
    await writeConfig(
      file,
      () => `/* eslint-env node */
module.exports = {
  ...require('${toolchainName}/${file}'),
}
`
    )
  }

  await fs.mkdirs('.circleci')

  await updateFile(circleciConfigYml, 'utf8', async (current) =>
    hard ||
    !current ||
    new RegExp(`auto-generated by ${toolchainName}`).test(current)
      ? await fs.readFile(path.join(content, 'config.yml'), 'utf8')
      : null
  )

  let updatedPackageJson = packageJson
  if (hard) {
    updatedPackageJson = without(
      updatedPackageJson,
      'exports',
      'files',
      'husky',
      'main',
      'module',
      'renovate',
      'prettier',
      'eslintcConfig',
      'commitlint',
      'lint-staged',
      'nyc',
      'husky'
    )
    if (updatedPackageJson.config) {
      updatedPackageJson = set(updatedPackageJson, {
        config: without(updatedPackageJson.config, 'mocha'),
      })
    }
  }
  updatedPackageJson = merge(updatedPackageJson, {
    version: '0.0.0-development',
    sideEffects: false,
    scripts: {
      tc: 'toolchain',
      toolchain: 'toolchain',
      test: 'toolchain test',
      prepublishOnly:
        'echo This package is meant to be published by semantic-release from the dist build directory. && exit 1',
    },
    config: {
      commitizen: { path: 'cz-conventional-changelog' },
    },
  })
  if (updatedPackageJson !== packageJson) {
    await fs.writeJson('package.json', updatedPackageJson, { spaces: 2 })
    console.log('wrote package.json') // eslint-disable-line no-console
  }
  if (!packageJson.devDependencies) packageJson.devDependencies = {}

  const depsToRemove = Object.keys(packageJson.devDependencies).filter(
    (dep) =>
      dep !== 'husky' && (obsoleteDeps.has(dep) || toolchainDepsSet.has(dep))
  )
  if (depsToRemove.length) {
    console.log(`removing unnecessary devDependencies...`) // eslint-disable-line no-console
    await spawn('yarn', ['remove', ...depsToRemove])
  }
  if (packageJson.devDependencies.husky)
    await spawn('yarn', ['remove', '--ignore-scripts', 'husky'])

  const ignores = ['coverage', '.nyc_output', 'node_modules', 'dist']

  await updateFile('.gitignore', 'utf8', (file) => {
    const lines = file.split(/\r\n?|\n/gm)
    for (const entry of ignores) {
      if (!lines.includes(entry)) {
        lines.push(entry)
      }
    }
    return lines.join('\n')
  })
  await updateFile('.eslintignore', 'utf8', (file) => {
    if (!file.trim()) return null
    const lines = file.split(/\r\n?|\n/gm)
    for (const entry of ignores) {
      if (!lines.includes(entry)) {
        lines.push(entry)
      }
    }
    return lines.join('\n')
  })

  await require('./toolchain').scripts.format.run()
}

module.exports = bootstrap

if (require.main === module) bootstrap({ args: process.argv })
