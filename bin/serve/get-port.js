'use strict'

const getPort = require('get-port')

module.exports = async userPort => {
  const port = await getPort(userPort)
  const inUse = port !== userPort
  return { port, userPort, inUse }
}
