/* eslint-env node */

module.exports = {
  extends: [
    require.resolve('@jedwards1211/eslint-config'),
    require.resolve('@jedwards1211/eslint-config-flow'),
    require.resolve('eslint-config-prettier'),
  ],
  parser: require.resolve('babel-eslint'),
  env: {
    es2020: true,
  },
}
