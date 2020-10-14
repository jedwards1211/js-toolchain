/* eslint-env node */

module.exports = {
  ...require('./packages/base-toolchain/husky.config.js'),
}
module.exports.hooks['pre-commit'] = './make check'
