'use strict'

const express = require('express')

const listenMessage = require('./listen-message')
const getPort = require('./get-port')

module.exports = async ({ file, cli, restarting }) => {
  const { userPort, port, inUse } = await getPort(cli)

  const app = express()

  const module = require(file)
  module(app, express)

  const server = app.listen(port, () => {
    if (!restarting) {
      const message = listenMessage({
        appName: cli.pkg.name,
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

  require('../watch')({ file, server, cli, sockets })
}
