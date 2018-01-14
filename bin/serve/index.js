'use strict'

const importCwd = require('import-cwd')

const { error: logError } = require('../cli/log')
const listenMessage = require('./listen-message')
const getPort = require('./get-port')

module.exports = async ({
  filepath,
  pkg,
  port: originalPort,
  host,
  watchFiles,
  restarting = false,
  ...opts
}) => {
  if (restarting) process.emit('SIGNUSR2')
  const { userPort, port, inUse } = await getPort(originalPort)

  try {
    const module = require(filepath)
    const express = importCwd('express')
    const app = express()

    await module(app, express)

    const server = app.listen(port, host, () => {
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

    const sockets = []

    server.on('connection', socket => {
      const index = sockets.push(socket)
      socket.once('close', () => sockets.splice(index, 1))
    })
    require('../watch')({ watchFiles, filepath, pkg, server, sockets, ...opts })
  } catch (err) {
    logError(err)
  }
}
