const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')
const { promisify } = require('util')

async function copy({ srcDir, pattern, destDir, getDest }) {
  const files = await promisify(glob)(pattern, { cwd: srcDir })
  for (const file of files) {
    const src = path.join(srcDir, file)
    const dest = getDest ? getDest(file) : path.join(destDir, file)
    await fs.copyFile(src, dest)
    console.log(`${src} -> ${dest}`) // eslint-disable-line no-console
  }
}
module.exports = copy
