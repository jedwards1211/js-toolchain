#!/usr/bin/env node

const fs = require('fs-extra')
const toolchainName = require('../package.json').name
const path = require('path')

const packageJsonPath = path.resolve(
  __dirname,
  '..',
  ...toolchainName.split(/\//g).map(() => '..'),
  '..',
  'package.json'
)

async function addScripts() {
  const packageJson = await fs.readJson(packageJsonPath)
  if (
    packageJson.scripts &&
    packageJson.scripts.toolchain === 'toolchain' &&
    packageJson.scripts.tc === 'toolchain'
  )
    return
  if (!packageJson.scripts) packageJson.scripts = {}
  packageJson.scripts.toolchain = packageJson.scripts.tc = 'toolchain'
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 })
  console.log('added toolchain scripts to', packageJsonPath) // eslint-disable-line no-console
}

module.exports = addScripts

if (require.main === module) addScripts()