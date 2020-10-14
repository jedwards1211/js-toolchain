const mapNextReleaseVersion = (toTag) => (config) => ({
  ...config,
  nextRelease: {
    ...config.nextRelease,
    version: toTag(config.nextRelease.version),
  },
})

const withOptionsTransform = (transform) => (plugin) => async (
  pluginConfig,
  config
) => {
  return plugin(pluginConfig, await transform(config))
}

module.exports = {
  mapNextReleaseVersion,
  withOptionsTransform,
}
