'use strict'

const importCwd = require('import-cwd')
const path = require('path')

const { error: logError } = require('../cli/log')
const listenMessage = require('./listen-message')
const getPort = require('./get-port')

module.exports = async ({ filename, pkg, cli, restarting }) => {
  if (restarting) process.emit('SIGNUSR2')

  const { userPort, port, inUse } = await getPort(cli)
  const filepath = path.resolve(process.cwd(), filename)

  try {
    const module = require(filepath)
    const express = importCwd('express')
    const app = express()

    await module(app, express)

    const server = app.listen(port, () => {
      if (!restarting) {
        const message = listenMessage({
          appName: pkg.name,
          port,
          inUse,
          userPort
        })
        console.log(message)
      }
    })

    const sockets = []

    server.on('connection', socket => {
      const index = sockets.push(socket)
      socket.once('close', () => sockets.splice(index, 1))
    })
    require('../watch')({ filename, pkg, server, cli, sockets })
  } catch (err) {
    logError(err)
  }
}
