/**
 * Sets the extension on all relative imports encountered to the extension provided in the plugin options.
 */
function getVisitor(t, opts) {
  function convertSource(source) {
    if (!/^\.{0,2}[/\\]/.test(source)) return source
    return source.replace(/(\.[^./\\]+)?$/, opts.extension)
  }

  const visitor = {
    CallExpression(path, { file }) {
      if (path.node.callee.type !== 'Import') {
        return
      }

      const [source] = path.get('arguments')
      if (source.type !== 'StringLiteral') {
        /* Should never happen */
        return
      }

      source.replaceWith(t.stringLiteral(convertSource(source.node.value)))
    },
    'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(
      path,
      { file }
    ) {
      const source = path.get('source')

      // An export without a 'from' clause
      if (source.node === null) {
        return
      }

      source.replaceWith(t.stringLiteral(convertSource(source.node.value)))
    },
  }

  return {
    Program: {
      exit(path, state) {
        path.traverse(visitor, state)
      },
    },
  }
}

module.exports = ({ types: t }, opts) => ({
  visitor: getVisitor(t, opts),
})
