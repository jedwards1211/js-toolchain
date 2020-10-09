/* eslint-env node */

const toolchain = require('./bin/toolchain')

module.exports = {
  '*.{js,jsx,cjs,mjs}': [`${toolchain.eslint()} --fix`],
  '*.{js,jsx,ts,tsx,cjs,mjs,json,md}': [`${toolchain.prettier()} --write`],
}
