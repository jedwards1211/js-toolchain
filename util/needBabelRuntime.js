const fs = require('fs-extra')
const { promisify } = require('util')
const path = require('path')
const glob = require('glob')

const babel = require('@babel/core')
const traverse = require('@babel/traverse').default

module.exports = async function needBabelRuntime(dist) {
  for (const file of await promisify(glob)(
    path.join(dist, '**.{js,cjs,mjs}')
  )) {
    const ast = await babel.parseAsync(await fs.readFile(file, 'utf8'), {
      cwd: dist,
    })
    let babelRuntimeFound = false
    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type !== 'Import' &&
          !(
            path.node.callee.type === 'Identifier' &&
            path.node.callee.name === 'require'
          )
        ) {
          return
        }

        const [source] = path.get('arguments')
        if (
          source.type === 'StringLiteral' &&
          source.node.value.startsWith('@babel/runtime')
        ) {
          babelRuntimeFound = true
          path.stop()
        }
      },
      'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(path) {
        const source = path.get('source')

        if (source.node && source.node.value.startsWith('@babel/runtime')) {
          babelRuntimeFound = true
          path.stop()
        }
      },
    })
    if (babelRuntimeFound) return true
  }
  return false
}
