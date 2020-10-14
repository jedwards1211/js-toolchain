/* eslint-env node */

const { dependencies } = require('./package.json')

module.exports = function (api) {
  const isFlow = dependencies['@babel/preset-flow'] != null
  const isTypescript =
    !isFlow && dependencies['@babel/preset-typescript'] != null

  return {
    plugins: [
      isFlow && require.resolve('@babel/plugin-transform-flow-strip-types'),
      require.resolve('@babel/plugin-transform-runtime'),
      require.resolve('@babel/plugin-proposal-class-properties'),
      api.env('coverage') && require.resolve('babel-plugin-istanbul'),
      [
        require.resolve('./lib/babelPluginResolveFiles.js'),
        { extension: api.env('mjs') ? '.mjs' : '.js' },
      ],
      require.resolve('babel-plugin-add-module-exports'),
    ].filter(Boolean),
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          targets: { node: 'current' },
          forceAllTransforms: true,
          modules: api.env('mjs') ? false : 'cjs',
        },
      ],
      isFlow && require.resolve('@babel/preset-flow'),
      isTypescript && require.resolve('@babel/preset-typescript'),
      dependencies['@babel/preset-react'] &&
        require.resolve('@babel/preset-react'),
    ].filter(Boolean),
  }
}
