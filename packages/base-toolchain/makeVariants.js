#!/usr/bin/env node

/* eslint-env node */

const fs = require('fs-extra')
const path = require('path')
const packageJson = require('./package.json')

const variants = {
  'js-toolchain': {
    dependencies: new Set([
      '@babel/preset-flow',
      '@jedwards1211/eslint-config-flow',
      'eslint-plugin-flowtype',
    ]),
  },
  'ts-toolchain': {
    dependencies: new Set([
      '@babel/preset-typescript',
      '@jedwards1211/eslint-config-react',
      '@jedwards1211/eslint-config-typescript',
      '@types/chai',
      '@types/mocha',
      '@types/node',
      '@typescript-eslint/eslint-plugin',
      'typescript',
    ]),
  },
}

variants['js-react-toolchain'] = {
  dependencies: new Set([
    ...variants['js-toolchain'].dependencies,
    '@babel/preset-react',
    '@jedwards1211/eslint-config-react',
    'enzyme',
    'enzyme-adapter-react-16',
    'eslint-plugin-react',
    'jsdom',
    'jsdom-global',
    'react',
    'react-dom',
  ]),
}

variants['ts-react-toolchain'] = {
  dependencies: new Set([
    ...variants['ts-toolchain'].dependencies,
    ...variants['js-react-toolchain'].dependencies,
    '@types/enzyme',
    '@types/react',
    '@types/react-dom',
  ]),
}

const commonDeps = new Set(Object.keys(packageJson.dependencies))

for (const { dependencies } of Object.values(variants)) {
  for (const dep of dependencies) commonDeps.delete(dep)
}
for (const { dependencies } of Object.values(variants)) {
  for (const dep of commonDeps) dependencies.add(dep)
}

module.exports = async function makeVariants() {
  for (const [name, { dependencies }] of Object.entries(variants)) {
    const out = path.resolve(__dirname, '..', name)
    const logWrite = (file) =>
      // eslint-disable-next-line no-console
      console.log(
        `${path.relative(
          process.cwd(),
          path.join(__dirname, file)
        )} -> ${path.relative(process.cwd(), path.join(out, file))}`
      )
    await fs.remove(out)
    await fs.mkdirs(out)
    const packageJson = await fs.readJson(path.join(__dirname, 'package.json'))
    const oldName = packageJson.name
    const newName = packageJson.name.replace(/[^/]+$/, name)
    packageJson.name = newName
    packageJson.dependencies = Object.fromEntries(
      [...dependencies]
        .sort()
        .map((dep) => [dep, packageJson.dependencies[dep]])
    )
    await fs.writeJson(path.join(out, 'package.json'), packageJson, {
      spaces: 2,
    })
    logWrite('package.json')

    let readme = await fs.readFile(path.join(__dirname, 'README.md'), 'utf8')
    readme = readme
      .replace(new RegExp(oldName, 'g'), newName)
      .replace(
        new RegExp(encodeURIComponent(oldName), 'g'),
        encodeURIComponent(newName)
      )
    await fs.writeFile(path.join(out, 'README.md'), readme, 'utf8')
    logWrite('README.md')

    for (const file of [
      ...packageJson.files,
      '.gitignore',
      'LICENSE.md',
      'yarn.lock',
    ]) {
      const src = path.join(__dirname, file)
      const dest = path.join(out, file)
      await fs.copy(src, dest)
      logWrite(file)
    }
  }
}

if (require.main === module) module.exports()
