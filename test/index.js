/* eslint-env node */

import { describe, it } from 'mocha'
import { spawn } from 'promisify-child-process'
import { expect } from 'chai'
import path from 'path'
import _glob from 'glob'
import fs from 'fs'
import { promisify } from 'util'

const glob = promisify(_glob)
const readFile = promisify(fs.readFile)

const project = path.resolve(__dirname, 'project')
const expectedDist = path.resolve(__dirname, 'expected-dist')

describe(`toolchain`, function () {
  this.timeout(60000)
  it(`works on test project`, async function () {
    await spawn('yarn', { cwd: project, stdio: 'inherit' })
    await spawn(
      process.execPath,
      [require.resolve('../bin/toolchain.js'), 'prepublishOnly'],
      {
        cwd: project,
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: '', BABEL_ENV: '' },
      }
    )

    const expectedFiles = await promisify(glob)('**', { cwd: expectedDist })
    for (const file of expectedFiles) {
      expect(
        (await readFile(path.join(project, 'dist', file), 'utf8')).trim()
      ).to.equal((await readFile(path.join(expectedDist, file), 'utf8')).trim())
    }
  })
})
