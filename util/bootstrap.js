#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const toolchainName = require('../package.json').name

const content = path.resolve(__dirname, '..', 'content')
const circleciConfigYml = path.join('.circleci', 'config.yml')

function merge(src, more) {
  if (!(src instanceof Object)) return more
  let changed = false
  const result = { ...src }
  for (const key in more) {
    const merged = merge(result[key], more[key])
    if (result[key] !== merged) {
      changed = true
      result[key] = merged
    }
  }
  return changed ? result : src
}

async function replace(file, content) {
  if (
    (await fs.readFile(file, 'utf8').catch((err) => {
      if (err.code !== 'ENOENT') throw err
      return null
    })) !== content
  ) {
    await fs.writeFile(file, content, 'utf8')
    console.log('wrote', file) // eslint-disable-line no-console
  }
}

async function bootstrap() {
  await replace(
    '.eslintrc.js',
    `/* eslint-env node */\nmodule.exports = require('@jedwards1211/js-toolchain/.eslintrc.js')`
  )
  await replace(
    '.prettierrc.js',
    `/* eslint-env node */\nmodule.exports = require('@jedwards1211/js-toolchain/.prettierrc.js')`
  )
  await replace(
    '.babelrc.js',
    `/* eslint-env node */\nmodule.exports = require('@jedwards1211/js-toolchain/.babelrc.js')`
  )

  await fs.mkdirs('.circleci')

  const circleciConfig = await fs
    .readFile(circleciConfigYml, 'utf8')
    .catch((err) => {
      if (err.code !== 'ENOENT') throw err
      return null
    })
  if (
    !circleciConfig ||
    new RegExp(`auto-generated by ${toolchainName}`).test(circleciConfig)
  ) {
    await fs.copyFile(path.join(content, 'config.yml'), circleciConfigYml)
    console.log('wrote', circleciConfigYml) // eslint-disable-line no-console
  }

  const packageJson = await fs.readJson('package.json')
  const merged = merge(packageJson, {
    version: '0.0.0-development',
    sideEffects: false,
    hooks: {
      'pre-commit': 'toolchain pre-commit',
      'commit-msg': 'toolchain commitlint -E HUSKY_GIT_PARAMS',
    },
    scripts: {
      test: 'toolchain test',
      prepublishOnly:
        'echo This package is meant to be published by semantic-release from the dist build directory. && exit 1',
      'install-husky': 'node node_modules/husky/husky.js install',
    },
    config: {
      commitizen: { path: 'cz-coventional-changelog' },
    },
  })
  if (merged !== packageJson) {
    await fs.writeJson('package.json', merged, { spaces: 2 })
    console.log('wrote package.json') // eslint-disable-line no-console
  }

  const gitignore = (
    await fs.readFile('.gitignore', 'utf8').catch((err) => {
      if (err.code !== 'ENOENT') throw err
      return ''
    })
  ).split(/\r\n?|\n/gm)

  let gitignoreChanged = false
  for (const entry of ['coverage', '.nyc_output', 'node_modules', 'dist']) {
    if (!gitignore.includes(entry)) {
      gitignoreChanged = true
      gitignore.push(entry)
    }
  }
  if (gitignoreChanged) {
    await fs.writeFile('.gitignore', gitignore.join('\n'), 'utf8')
    console.log('wrote .gitignore') // eslint-disable-line no-console
  }
}

if (require.main === module) bootstrap()
