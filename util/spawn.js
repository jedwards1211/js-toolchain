const path = require('path')
const chalk = require('chalk')
const { spawn } = require('promisify-child-process')

function formatArg(arg) {
  if (/^[-_a-z0-9=./]+$/i.test(arg)) return arg
  return `'${arg.replace(/'/g, "'\\''")}'`
}

module.exports = function (command, args, options) {
  if (!Array.isArray(args)) {
    options = args
    args = []
  }
  if (!options) options = {}

  // eslint-disable-next-line no-console
  console.error(
    chalk`{gray.bold $ ${command} ${args.map(formatArg).join(' ')}}`
  )

  return spawn(command, args || {}, { stdio: 'inherit', ...options }).then(
    (result) => {
      // eslint-disable-next-line no-console
      console.error(
        chalk`{green ✔} {bold ${path.basename(command)}} exited with code 0`
      )
      return result
    },
    (error) => {
      const { code, signal } = error
      if (code) {
        error.message = chalk`{red ✖} {bold ${path.basename(
          command
        )}} exited with code ${code}`
      }
      if (signal) {
        error.message = chalk`{red ✖} {bold ${path.basename(
          command
        )}} was killed with signal ${signal}`
      }
      throw error
    }
  )
}
