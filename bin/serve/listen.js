'use strict'

const express = require('express')

const { error: logError } = require('../cli/log')
const listenMessage = require('./listen-message')

const createServer = filepath =>
  express()
    .use(require(filepath))
    .disable('x-powered-by')

module.exports = async ({ userPort, inUse, pkg, port, host, restarting, filepath }) => {
  let server

  try {
    server = createServer(filepath).listen(port, host, () => {
      if (!restarting) {
        const message = listenMessage({
          appName: pkg.name || 'svr',
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
