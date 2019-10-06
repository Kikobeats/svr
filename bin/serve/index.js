'use strict'

const getPort = require('./get-port')
const listen = require('./listen')

module.exports = async ({
  filepath,
  pkg,
  port: originalPort,
  host,
  watchFiles,
  restarting = false,
  ...opts
}) => {
  if (restarting) process.emit('SIGUSR2')
  const { userPort, port, inUse } = await getPort(originalPort)
  const server = await listen({
    userPort,
    inUse,
    pkg,
    port,
    host,
    restarting,
    filepath
  })
  const sockets = []

  server.on('connection', socket => {
    const index = sockets.push(socket)
    socket.once('close', () => sockets.splice(index, 1))
  })

  require('../watch')({
    watchFiles,
    filepath,
    pkg,
    server,
    sockets,
    port,
    ...opts
  })
}
