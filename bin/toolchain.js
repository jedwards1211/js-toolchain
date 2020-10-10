#!/usr/bin/env node

const chalk = require('chalk')
const spawn = require('../util/spawn.js')
const path = require('path')
const fs = require('fs')

const isFlow = fs.existsSync('.flowconfig')
const isTypescript = fs.existsSync('tsconfig.json')
const hostPrettierignore = fs.existsSync('.prettierignore')
const hostEslintignore = fs.existsSync('.eslintignore')
const hostPackageJson = require('../util/hostPackageJson')
const toolchainPackageJson = require('../package.json')
const toolchainName = toolchainPackageJson.name

const buildingSelf = process.cwd() === path.resolve(__dirname, '..')

const bin = (command) =>
  path.resolve(__dirname, '..', 'node_modules', '.bin', command)
const root = (file) => path.resolve(__dirname, '..', file)

const prettier = () =>
  `${bin('prettier')} --config ${root('.prettierrc.js')} --ignore-path ${
    hostPrettierignore ? '.prettierignore' : '.gitignore'
  }`

const eslint = () =>
  `${bin('eslint')} --config ${root('.eslintrc.js')} --ignore-path ${
    hostEslintignore ? '.eslintignore' : '.gitignore'
  } --ignore-pattern flow-typed/`

const babel = () => `${bin('babel')} --config-file ${root('.babelrc.js')}`

const mocha = () =>
  `${bin('mocha')} -r ${require.resolve(
    '../util/configureTests'
  )} ${require.resolve('../util/mochaWatchClearConsole')} ${
    (hostPackageJson.config || {}).mocha || 'test/**/*.js'
  }`

const nyc = () =>
  `${bin('nyc')} --nycrc-path ${root(
    buildingSelf ? '.nyc.config.js' : '.nyc.config-host.js'
  )}`

const lintStaged = () =>
  `${bin('lint-staged')} --config ${root('lint-staged.config.js')}`

const commitlint = () =>
  `${bin('commitlint')} --config ${root('commitlint.config.js')}`

const getCiUrl = () => {
  const repoUrl = hostPackageJson.repository
    ? hostPackageJson.repository.url
    : ''
  const match = /github\.com\/([^/]+)\/([^/.]+)/.exec(repoUrl)
  if (!match) throw new Error(`failed to parse repository.url in package.json`)
  return `https://app.circleci.com/pipelines/github/${match[1]}/${match[2]}`
}

exports.prettier = prettier
exports.eslint = eslint

const commands = (...args) => args.filter(Boolean).join(' && ')

if (require.main === module) {
  const scripts = {
    prettier: () => `${prettier()} -c .`,
    format: () => `${prettier()} --write .`,
    lint: () => `${eslint()} .`,
    'lint:fix': () => `${eslint()} --fix .`,
    clean: () => `${bin('rimraf')} dist`,
    check: () =>
      commands(
        `${__filename} prettier`,
        `${__filename} lint`,
        isFlow && 'flow',
        isTypescript && 'tsc --noEmit'
      ),
    build: () =>
      commands(
        `${bin('rimraf')} dist`,
        `${babel()} src --out-dir dist --out-file-extension .js`,
        `${bin(
          'cross-env'
        )} BABEL_ENV=mjs ${babel()} src --out-dir dist --out-file-extension .mjs`,
        isFlow && require.resolve('../util/copyFlowDefs'),
        isTypescript && require.resolve('../util/copyTsDefs'),
        require.resolve('../util/copyOtherFilesToDist'),
        require.resolve('../util/buildDistPackageJson')
      ),
    test: () =>
      `${bin(
        'cross-env'
      )} NODE_ENV=test BABEL_ENV=coverage ${nyc()} --reporter-lcov --reporter=text ${mocha()}`,
    'test:watch': () => `${bin('cross-env')} NODE_ENV=test ${mocha()} --watch`,
    prepublishOnly: () =>
      commands(
        `${__filename} check`,
        `${__filename} test`,
        `${__filename} build`
      ),
    'pre-commit': () =>
      commands(lintStaged(), isFlow && 'flow', isTypescript && 'tsc --noEmit'),
    commitlint,
    'open:coverage': () => `${bin('open-cli')} coverage/lcov-report/index.html`,
    'open:ci': () => `${bin('open-cli')} ${getCiUrl()}`,
    codecov: () =>
      `${nyc()} report --reporter=text-lcov > coverage.lcov; ${bin('codecov')}`,
    release: () => commands('cd dist', bin('semantic-release')),
    bootstrap: () => require.resolve('../util/bootstrap'),
    upgrade: () => `yarn upgrade ${toolchainName}`,
  }

  if (!process.argv[2]) {
    /* eslint-disable no-console */
    console.error('Usage: toolchain <command> <arguments...>')
    console.error('Available Scripts:')
    for (const script of Object.keys(scripts).sort()) {
      console.error(`  ${script}`)
    }
    /* eslint-enable no-console */
    process.exit(1)
  }
  if (process.argv[2] === 'version') {
    console.log(`${toolchainName}@${toolchainPackageJson.version}`) // eslint-disable-line no-console
    process.exit(0)
  }
  if (!scripts[process.argv[2]]) {
    console.error('Unknown script:', process.argv[2]) // eslint-disable-line no-console
    process.exit(1)
  }
  const script = scripts[process.argv[2]]()

  // eslint-disable-next-line no-console
  console.error(
    chalk`{gray.bold $ ${script} ${process.argv.slice(3).join(' ')}}`
  )

  spawn(script, process.argv.slice(3), { shell: true })
}
