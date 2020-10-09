/* eslint-env node */

const fs = require('fs-extra')

module.exports = function (api) {
  const isFlow = fs.existsSync('.flowconfig')

  const plugins = []
  if (isFlow)
    plugins.push(require.resolve('@babel/plugin-transform-flow-strip-types'))
  plugins.push(
    require.resolve('@babel/plugin-transform-runtime'),
    require.resolve('@babel/plugin-proposal-class-properties')
  )
  if (!api.env('coverage') && !api.env('test')) {
    plugins.push([
      require.resolve('./util/babelPluginSetExtensions'),
      { extension: api.env('mjs') ? '.mjs' : '.js' },
    ])
  }
  const presets = [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { node: 'current' },
        forceAllTransforms: true,
        modules: api.env('mjs') ? false : 'cjs',
      },
    ],
  ]
  if (isFlow) presets.push(require.resolve('@babel/preset-flow'))

  if (api.env('coverage')) {
    plugins.push(require.resolve('babel-plugin-istanbul'))
  }

  return { plugins, presets }
}
