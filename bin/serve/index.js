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
  restartSignal,
  ...opts
}) => {
  if (restarting && restartSignal) {
    ;[].concat(restartSignal).forEach(signal => process.emit(signal))
  }

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
    filepath,
    pkg,
    port,
    restartSignal,
    server,
    sockets,
    watchFiles,
    ...opts
  })
}
