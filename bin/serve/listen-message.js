'use strict'

const boxen = require('boxen')
const chalk = require('chalk')
const ip = require('ip')

const externalIp = ip.address()

const BOXEN_OPTS = {
  padding: 1,
  borderColor: 'green',
  margin: 1
}

module.exports = ({ appName, port, inUse, userPort }) => {
  let message = chalk.green(`${appName} is running!`)

  if (inUse) {
    message += chalk.red(
      `\n(on port ${port}, because ${userPort} is already in use)`
    )
  }

  message += '\n\n'

  const localUrl = `http://localhost:${port}`
  const remoteUrl = `http://${externalIp}:${port}`

  message += `• ${chalk.bold('Local:           ')} ${localUrl}\n`
  message += `• ${chalk.bold('On Your Network: ')} ${remoteUrl}`
  return boxen(message, BOXEN_OPTS)
}
