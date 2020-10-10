const { spawn: _spawn } = require('child_process')

module.exports = function spawn(command, args, _options) {
  if (arguments.length < 3) {
    _options = args
    args = []
  }
  if (!_options) _options = {}
  const { exit, ...options } = _options
  return new Promise((resolve, reject) => {
    _spawn(command, args || [], { stdio: 'inherit', ...options })
      .on('error', (e) => {
        console.error(e) // eslint-disable-line no-console
        if (exit === false) reject(e)
        else process.exit(1)
      })
      .on('exit', (code, signal) => {
        if (code !== 0) {
          const message =
            code != null
              ? `exited with code ${code}`
              : `was killed with signal ${signal}`
          // eslint-disable-next-line no-console
          console.error(command, message)
          if (exit === false) reject(new Error(message))
          else process.exit(code != null ? code : 1)
        }
        if (exit === false) resolve()
        else process.exit(0)
      })
  })
}
