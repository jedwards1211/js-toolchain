/* eslint-env node */

const { dependencies } = require('./package.json')

const toolchain = require('./bin/toolchain')

module.exports = {
  [dependencies['@typescript-eslint/eslint-plugin']
    ? '*.{ts,tsx}'
    : '*.{js,jsx,cjs,mjs}']: [`${toolchain.eslintShellCommand()} --fix`],
  '*.{js,jsx,ts,tsx,cjs,mjs,json,md}': [
    `${toolchain.prettierShellCommand()} --write`,
  ],
}
