#!/usr/bin/env node

const chalk = require('chalk')
const spawn = require('../util/spawn.js')
const path = require('path')
const fs = require('fs-extra')

const isFlow = fs.existsSync('.flowconfig')
const isTypescript = fs.existsSync('tsconfig.json')
const hostPrettierignore = fs.existsSync('.prettierignore')
const hostEslintignore = fs.existsSync('.eslintignore')
const hostPackageJson = require('../util/hostPackageJson')
const toolchainPackageJson = require('../package.json')
const runBabel = require('../util/runBabel')
const { name: toolchainName, version: toolchainVersion } = toolchainPackageJson

const buildingSelf = process.cwd() === path.resolve(__dirname, '..')

const bin = (command) =>
  path.resolve(__dirname, '..', 'node_modules', '.bin', command)
const projBin = (command) => path.resolve('node_modules', '.bin', command)

const root = (file) => path.resolve(__dirname, '..', file)

const spawnable = (command, baseArgs = [], baseOptions = {}) => (
  args = [],
  options = {}
) =>
  spawn(command, [...baseArgs, ...args], {
    ...baseOptions,
    ...options,
    env: { ...process.env, ...baseOptions.env, ...options.env },
  })

const prettierArgs = [
  '--config',
  root('.prettierrc.js'),
  '--ignore-path',
  hostPrettierignore ? '.prettierignore' : '.gitignore',
]
exports.prettierShellCommand = `${bin('prettier')} ${prettierArgs.join(' ')}`

const prettier = spawnable(bin('prettier'), prettierArgs)

const eslintArgs = [
  '--config',
  root('.eslintrc.js'),
  '--ignore-path',
  hostEslintignore ? '.eslintignore' : '.gitignore',
  '--ignore-pattern',
  'flow-typed/',
]
exports.eslintShellCommand = `${bin('eslint')} ${eslintArgs.join(' ')}`

const eslint = spawnable(bin('eslint'), eslintArgs)

const mochaArgs = () => [
  '-r',
  require.resolve('@babel/register'),
  require.resolve('../util/mochaWatchClearConsole'),
  (hostPackageJson.config || {}).mocha || `'test/**/*.js'`,
]

const nycArgs = () => [
  '--nycrc-path',
  root(buildingSelf ? '.nyc.config.js' : '.nyc.config-host.js'),
]

const nyc = spawnable(bin('nyc'), nycArgs())

const lintStaged = spawnable(bin('lint-staged'), [
  '--config',
  root('lint-staged.config.js'),
])

const commitlint = spawnable(bin('commitlint'), [
  '--config',
  root('commitlint.config.js'),
])

const getCiUrl = () => {
  const repoUrl = hostPackageJson.repository
    ? hostPackageJson.repository.url
    : ''
  const match = /github\.com\/([^/]+)\/([^/.]+)/.exec(repoUrl)
  if (!match) throw new Error(`failed to parse repository.url in package.json`)
  return `https://app.circleci.com/pipelines/github/${match[1]}/${match[2]}`
}

const flow = spawnable(projBin('flow'))
const tsc = spawnable(projBin('tsc', ['--noEmit']))

const scripts = {
  prettier: {
    description: 'check format with prettier',
    run: (args = []) => prettier(['-c', '.', ...args]),
  },
  format: {
    description: 'format files with prettier',
    run: (args = []) => prettier(['--write', '.', ...args]),
  },
  lint: {
    description: 'check files with eslint',
    run: (args = []) => eslint(['.', ...args]),
  },
  'lint:fix': {
    description: 'check files with eslint and autofix errors',
    run: (args = []) => eslint(['--fix', '.', ...args]),
  },
  clean: {
    description: 'clean build output',
    run: () => fs.remove('dist'),
  },
  check: {
    description: 'check with prettier, eslint, and flow/tsc (if applicable)',
    run: async () => {
      await scripts.prettier.run()
      await scripts.lint.run()
      if (isFlow) await flow()
      if (isTypescript) await tsc()
    },
  },
  build: {
    description: 'build everything to publish to dist directory',
    run: async () => {
      await scripts.clean.run()
      await runBabel({
        srcDir: 'src',
        destDir: 'dist',
        outFileExtension: '.js',
      })
      await runBabel({
        srcDir: 'src',
        destDir: 'dist',
        outFileExtension: '.mjs',
        envName: 'mjs',
      })
      if (isFlow) await require('../util/copyFlowDefs')()
      if (isTypescript) await require('../util/copyTsDefs')()
      await require('../util/copyOtherFilesToDist')()
      await require('../util/buildDistPackageJson')('dist')
    },
  },
  test: {
    description: 'run tests with code coverage',
    run: (args = []) =>
      spawn(
        `${bin('nyc')} ${[
          ...nycArgs(),
          '--reporter=lcov',
          '--reporter=text',
          bin('mocha'),
          ...mochaArgs(),
          ...args,
        ].join(' ')}`,
        {
          shell: true,
          env: { ...process.env, NODE_ENV: 'test', BABEL_ENV: 'coverage' },
        }
      ),
  },
  'test:watch': {
    description: 'run tests in watch mode',
    run: (args = []) =>
      spawn(`${bin('mocha')} ${[...mochaArgs(), ...args].join(' ')}`, {
        shell: true,
        env: { ...process.env, NODE_ENV: 'test' },
      }),
  },
  prepublishOnly: {
    description: 'run check, test, and build',
    run: async () => {
      await scripts.check.run()
      await scripts.test.run()
      await scripts.build.run()
    },
  },
  'pre-commit': {
    description: 'run pre-commit hook checks',
    run: async () => {
      await lintStaged()
      if (isFlow) await flow()
      if (isTypescript) await tsc()
    },
  },
  commitlint: {
    description: 'check commit message with commitlint',
    run: commitlint,
  },
  'open:coverage': {
    description: 'open code coverage output in browser',
    run: () => spawn(bin('open-cli'), ['coverage/lcov-report/index.html']),
  },
  'open:ci': {
    description: 'open CircleCI pipelines in browser',
    run: () => spawn(bin('open-cli'), [getCiUrl()]),
  },
  codecov: {
    description: 'upload coverage to codecov',
    run: async () => {
      const dump = nyc(['report', '--reporter=text-lcov'], { stdio: 'pipe' })
      dump.stdout.pipe(fs.createWriteStream('coverage.lcov'))
      await dump
      await spawn(bin('codecov'))
    },
  },
  release: {
    description: 'release package with semantic-release',
    run: (args = []) =>
      spawn(bin('semantic-release'), args, { cwd: path.resolve('dist') }),
  },
  bootstrap: {
    description: 'prepare your project',
    run: (args = []) =>
      require('../util/bootstrap')({ hard: args.indexOf('--hard') >= 0 }),
  },
  upgrade: {
    description: `upgrade ${toolchainName}`,
    run: (args = []) => spawn('yarn', ['upgrade', toolchainName, ...args]),
  },
  version: {
    description: `print version of ${toolchainName}`,
    run: () => {
      console.log(`${toolchainName}@${toolchainVersion}`) // eslint-disable-line no-console
    },
  },
}
module.exports.scripts = scripts

async function toolchain(command, args) {
  if (!command) {
    /* eslint-disable no-console */
    console.error('Usage: toolchain <command> <arguments...>\n')
    console.error('Available commands:')
    for (const script of Object.keys(scripts).sort()) {
      console.error(
        chalk`  {bold ${script.padEnd(20)}}${scripts[script].description}`
      )
    }
    /* eslint-enable no-console */
    process.exit(1)
  }
  const script = scripts[command]
  if (!script) {
    console.error('Unknown command:', command) // eslint-disable-line no-console
    process.exit(1)
  }

  if (script !== scripts.version) {
    console.error(chalk`{bold ${toolchainName}@${toolchainVersion}}`) // eslint-disable-line no-console
  }

  try {
    await script.run(args)
  } catch (error) {
    const { code } = error
    if (typeof code === 'number' && code !== 0) {
      console.error(error.message) // eslint-disable-line no-console
    } else {
      console.error(error.stack) // eslint-disable-line no-console
    }
    throw error
  }
}
exports.toolchain = toolchain

if (require.main === module) {
  toolchain(process.argv[2], process.argv.slice(3)).then(
    () => {
      process.exit(0)
    },
    (error) => {
      const { code } = error
      if (typeof code === 'number' && code !== 0) {
        process.exit(code)
      } else {
        process.exit(1)
      }
    }
  )
}
