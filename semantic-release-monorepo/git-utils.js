const { spawn } = require('promisify-child-process')

const git = async (args, options = {}) => {
  const { stdout } = await spawn('git', args, {
    stdio: 'pipe',
    encoding: 'utf8',
    maxBuffer: 10000,
    ...options,
  })
  return stdout
}

/**
 * https://stackoverflow.com/a/957978/89594
 * @async
 * @return {Promise<String>} System path of the git repository.
 */
const getRoot = () => git(['rev-parse', '--show-toplevel'])

module.exports = {
  getRoot,
}
