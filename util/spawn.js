#!/usr/bin/env node

const { spawn: _spawn } = require('child_process')

module.exports = function spawn(command, args, options) {
  _spawn(command, args || [], { stdio: 'inherit', ...options })
    .on('error', (e) => {
      console.error(e) // eslint-disable-line no-console
      process.exit(1)
    })
    .on('exit', (code, signal) => {
      if (code !== 0)
        // eslint-disable-next-line no-console
        console.error(
          command,
          code != null
            ? `exited with code ${code}`
            : `was killed with signal ${signal}`
        )
      process.exit(code != null ? code : 1)
    })
}
