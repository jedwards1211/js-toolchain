/* eslint-env node */

const { describe, it, before } = require('mocha')
const spawn = require('../packages/base-toolchain/lib/spawn')
const copy = require('../packages/base-toolchain/lib/copy')
const { expect } = require('chai')
const path = require('path')
const _glob = require('glob')
const fs = require('fs-extra')
const { promisify } = require('util')

const glob = promisify(_glob)
const readFile = promisify(fs.readFile)

const repoRoot = path.resolve(__dirname, '..')
const fixture = (...args) => path.resolve(repoRoot, 'fixtures', ...args)

const jsToolchain = path.resolve(repoRoot, 'packages', 'js-toolchain')

const expectFilesMatch = async ({ expectedDir, actualDir }) => {
  const files = await promisify(glob)('**', { cwd: expectedDir, nodir: true })
  for (const file of files) {
    expect(
      (await readFile(path.join(actualDir, file), 'utf8')).trim()
    ).to.equal((await readFile(path.join(expectedDir, file), 'utf8')).trim())
  }
}

const jsToolchainPkgJson = require(path.join(jsToolchain, 'package.json'))
const { name: jsToolchainName } = jsToolchainPkgJson

const env = { ...process.env }
delete env.NODE_ENV
delete env.BABEL_ENV
delete env.INIT_CWD

const yalc = path.resolve(repoRoot, 'node_modules', '.bin', 'yalc')

async function linkToolchain(projectFolder, toolchainName) {
  await spawn(yalc, ['add', '--dev', toolchainName], {
    cwd: projectFolder,
    env,
  })
  await spawn('yarn', { cwd: projectFolder, env })
}

describe(`toolchain`, function () {
  this.timeout(60000)

  it(`prepublishOnly works on mutate project`, async function () {
    const project = fixture('mutate', 'project')
    const expectedDist = fixture('mutate', 'expected-dist')

    await linkToolchain(project, jsToolchainName)
    await spawn('yarn', ['tc', 'prepublishOnly'], {
      cwd: project,
      env,
    })

    await expectFilesMatch({
      expectedDir: expectedDist,
      actualDir: path.join(project, 'dist'),
    })
  })
  it(`bootstrap --hard`, async function () {
    this.timeout(60000 * 10)
    const project = fixture('bootstrap', 'project')
    const actualProject = fixture('bootstrap', 'actual')
    const expectedProject = fixture('bootstrap', 'expected')

    await fs.mkdirs(actualProject)
    for (const entry of await fs.readdir(actualProject)) {
      if (entry !== 'node_modules')
        await fs.remove(path.join(actualProject, entry))
    }
    await copy({
      srcDir: project,
      destDir: actualProject,
      pattern: '**',
      dot: true,
    })

    await linkToolchain(actualProject, jsToolchainName)
    await spawn('yarn', ['tc', 'bootstrap', '--hard', '--no-husky'], {
      cwd: actualProject,
      env,
    })

    await expectFilesMatch({
      actualDir: actualProject,
      expectedDir: expectedProject,
    })
  })
})
