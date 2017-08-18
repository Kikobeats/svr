'use strict'

const getPort = require('get-port')

const DEFAULT_PORT = 3000

module.exports = async cli => {
  const envPort = process.env.port || process.env.PORT
  if (envPort) return envPort

  const { port: userPort = DEFAULT_PORT } = cli

  const port = await getPort(userPort)
  const inUse = port !== userPort

  return { port, userPort, inUse }
}
