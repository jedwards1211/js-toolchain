#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')
const buildConditionalExports = require('./buildConditionalExports')
const needBabelRuntime = require('./needBabelRuntime')
const toolchainPackageJson = require('../package.json')
const toolchainName = toolchainPackageJson.name

async function buildDistPackageJson(dist) {
  const packageJson = await fs.readJson('package.json')
  const exports = buildConditionalExports(dist)
  const main = exports['.'] ? exports['.'].require : null
  const module = exports['.'] ? exports['.'].import : null
  if (!packageJson.exports) packageJson.exports = exports
  if (!packageJson.main && main) packageJson.main = main
  if (!packageJson.module && module) packageJson.module = module
  delete packageJson.devDependencies
  delete packageJson.husky
  delete packageJson.files
  delete packageJson['lint-staged']
  delete packageJson['nyc']
  delete packageJson['config']
  if (packageJson.scripts) {
    delete packageJson.scripts.prepublishOnly
  }
  delete packageJson[toolchainName]
  if (await needBabelRuntime(dist)) {
    const dependencies =
      packageJson.dependencies || (packageJson.dependencies = {})
    dependencies['@babel/runtime'] =
      toolchainPackageJson.dependencies['@babel/runtime']
  } else if (packageJson.dependencies) {
    delete packageJson.dependecies['@babel/runtime']
  }
  await fs.writeJson(path.join(dist, 'package.json'), packageJson, {
    spaces: 2,
  })
}

module.exports = buildDistPackageJson

if (require.main === module) {
  buildDistPackageJson('dist')
}