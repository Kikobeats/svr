'use strict'

const { error: logError } = require('../cli/log')
const listenMessage = require('./listen-message')

module.exports = async ({ userPort, inUse, pkg, port, host, restarting, filepath }) => {
  let server

  try {
    server = require(filepath).listen(port, host, () => {
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
