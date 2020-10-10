#!/usr/bin/env node

const { spawn: _spawn } = require('child_process')

module.exports = function spawn(command, args, { exit, ...options } = {}) {
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
          if (exit === false) {
            reject(new Error(message))
            return
          }
          // eslint-disable-next-line no-console
          console.error(command, message)
        } else if (exit === false) {
          resolve()
        } else {
          process.exit(code != null ? code : 1)
        }
      })
  })
}
