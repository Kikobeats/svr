'use strict'

const importCwd = require('import-cwd')

const { error: logError } = require('../cli/log')
const listenMessage = require('./listen-message')

module.exports = async ({ userPort, inUse, pkg, port, host, restarting, filepath }) => {
  let server

  try {
    const module = require(filepath)
    const express = importCwd('express')
    const app = express()
    await module(app, express)

    server = app.listen(port, host, () => {
      if (!restarting) {
        const message = listenMessage({
          appName: pkg.name,
          userPort,
          port,
          inUse
        })
        console.log(message)
      }
    })
  } catch (err) {
    logError(err)

    // server is crashed, we create a mock server
    server = {
      close: fn => fn(),
      on: (event, handlers) => {}
    }
  }

  return server
}
