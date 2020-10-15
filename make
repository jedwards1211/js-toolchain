#!/usr/bin/env node

const path = require('path')
const Promake = require('promake')
const nodeModulesRule = require('promake-node-modules').default
const glob = require('glob')
const fs = require('fs-extra')

const promake = new Promake()
const { rule, task, cli, spawn } = promake

const baseToolchainDeps = nodeModulesRule({
  promake,
  projectDir: path.join('packages', 'base-toolchain'),
  command: 'yarn',
})

const variantNames = [
  'js-toolchain',
  'js-react-toolchain',
  'ts-toolchain',
  'ts-react-toolchain',
]

const variants = variantNames.map((p) => path.join('packages', p))

rule(
  variants,
  [
    baseToolchainDeps,
    ...glob.sync('packages/base-toolchain/*', {
      nodir: true,
      dot: true,
    }),
    ...glob.sync('packages/base-toolchain/lib/**', {
      nodir: true,
      dot: true,
    }),
    ...glob.sync('packages/base-toolchain/content/**', {
      nodir: true,
      dot: true,
    }),
  ],
  () => require('./packages/base-toolchain/makeVariants')()
)

task('variants', variants)

const yalcTasks = variantNames.map((name, index) =>
  task(`${name}:yalc`, [variants[index]], () =>
    spawn(bin('yalc'), ['publish', variants[index]], { stdio: 'inherit' })
  )
)

const bin = (command) => path.join('node_modules', '.bin', command)

task('test', [...yalcTasks], ({ args }) =>
  spawn(bin('mocha'), ['test/**.js', ...args], { stdio: 'inherit' })
)

task('format', [baseToolchainDeps], async () => {
  await spawn(bin('prettier'), ['--write', '*.{js,json,md}'], {
    stdio: 'inherit',
  })
  await spawn(process.execPath, [path.join('lib', 'toolchain.js'), 'format'], {
    cwd: path.join('packages', 'base-toolchain'),
    stdio: 'inherit',
  })
})

task('check', [baseToolchainDeps], async () => {
  await spawn(bin('prettier'), ['-c', '*.{js,json,md}'], { stdio: 'inherit' })
  await spawn(process.execPath, [path.join('lib', 'toolchain.js'), 'check'], {
    cwd: path.join('packages', 'base-toolchain'),
    stdio: 'inherit',
  })
})

task('prepublish', [task('check'), task('test')])

cli()
