const readPkg = require('read-pkg')
const debug = require('debug')('semantic-release:monorepo')

const getAffectedPackages = (commit) => {
  const match = /^affects: (.+)/.exec(commit.message)
  return match ? match[1].split(/\s*,\s*/g).map((s) => s.trim()) : []
}

const onlyPackageCommits = async (commits) => {
  const { name } = await readPkg()

  debugger
  return commits.filter((commit) => {
    const affected = getAffectedPackages(commit)
    if (!affected.length || affected.includes(name)) {
      debug(
        'Including commit "%s" because it affects this package.',
        commit.subject
      )
      return true
    }
  })
}

const logFilteredCommitCount = (logger) => async ({ commits }) => {
  const { name } = await readPkg()

  logger.log(
    'Found %s commits for package %s since last release',
    commits.length,
    name
  )
}

const withOnlyPackageCommits = (plugin) => async (pluginConfig, config) => {
  const { logger } = config

  config = { ...config, commits: await onlyPackageCommits(config.commits) }
  await logFilteredCommitCount(config)
  return plugin(pluginConfig, config)
}

module.exports = withOnlyPackageCommits
