'use strict'

const getPort = require('get-port')

module.exports = async cli => {
  const envPort = process.env.port || process.env.PORT
  if (envPort) return envPort

  const { port: userPort } = cli.flags
  const port = await getPort(userPort)
  const inUse = port !== userPort

  return { port, userPort, inUse }
}
