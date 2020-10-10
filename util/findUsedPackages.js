#!/usr/bin/env node

const fs = require('fs-extra')
const babel = require('@babel/core')
const traverse = require('@babel/traverse').default

async function findUsedPackages(files) {
  const packages = new Set()
  function processSource(source) {
    if (!source.node || source.node.type !== 'StringLiteral') return
    const match = /^(@[^./]+\/)?([^./]+)/i.exec(source.node.value)
    if (match) packages.add(match[0])
  }

  for (const file of files) {
    const ast = await babel.parseAsync(await fs.readFile(file, 'utf8'))
    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type == 'Import' ||
          (path.node.callee.type === 'Identifier' &&
            path.node.callee.name === 'require')
        ) {
          processSource(path.get('arguments')[0])
        }
      },
      'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(path) {
        processSource(path.get('source'))
      },
    })
  }
  return packages
}

module.exports = findUsedPackages

if (require.main === module) {
  findUsedPackages(require('glob').sync(process.argv[2])).then(
    (packages) => console.log([...packages].sort()) // eslint-disable-line no-console
  )
}
