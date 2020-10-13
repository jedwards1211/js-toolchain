const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const { promisify } = require('util')
const babel = require('@babel/core')
const { dependencies } = require('../package.json')

async function runBabel({
  srcDir,
  destDir,
  outFileExtension,
  ...babelOptions
}) {
  await fs.mkdirs(destDir)
  for (const file of await promisify(glob)(
    path.join(
      dependencies['@babel/preset-typescript'] ? '**.{ts,tsx}' : '**.{js,cjs}'
    ),
    {
      cwd: srcDir,
    }
  )) {
    const srcFile = path.join(srcDir, file)
    const destFile = path.join(
      destDir,
      outFileExtension ? file.replace(/\.[^.]+$/, outFileExtension) : file
    )
    const { code } = await babel.transformFileAsync(srcFile, babelOptions)
    await fs.writeFile(destFile, code, 'utf8')
    console.log(`${srcFile} -> ${destFile}`) // eslint-disable-line no-console
  }
}

module.exports = runBabel
