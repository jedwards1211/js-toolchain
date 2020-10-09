# @jedwards1211/js-toolchain

[![CircleCI](https://circleci.com/gh/jedwards1211/js-toolchain.svg?style=svg)](https://circleci.com/gh/jedwards1211/js-toolchain)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/js-toolchain.svg)](https://badge.fury.io/js/js-toolchain)

This is my personal skeleton for creating an npm package with JS(/flow) source code.

## Assumptions

- All source files are in `src`
- Test files are in `test`. You can override this by specifying options for mocha in `config.mocha` in your `package.json`.
- You want to publish the package via `semantic-release`
- You're using CircleCI

## Usage

```sh
yarn add --dev @jedwards1211/js-toolchain
toolchain bootstrap
```

The bootstrap script will modify your package.json, .gitignore, .circleci/config.yml and generate .babelrc.js, .eslintrc.js, and .prettierrc.js that are
just proxies for the config in `@jedwards1211/js-toolchain`.

Instead of running scripts from your `package.json`, you can run them with the `toolchain` command, for example `toolchain lint`. Run `toolchain` by itself
to see all of the available commands.
