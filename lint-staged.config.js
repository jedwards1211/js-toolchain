/* eslint-env node */

const toolchain = require('./bin/toolchain')

module.exports = {
  '*.{js,jsx,cjs,mjs}': [`${toolchain.eslintShellCommand} --fix`],
  '*.{js,jsx,ts,tsx,cjs,mjs,json,md}': [
    `${toolchain.prettierShellCommand} --write`,
  ],
}
