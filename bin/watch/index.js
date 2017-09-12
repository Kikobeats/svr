'use strict'

const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const { watch } = require('chokidar')
const debounce = require('debounce')
const chalk = require('chalk')

const destroySockets = require('./destroy-sockets')
const getWatchConfig = require('./get-watch-config')
const restartServer = require('./restart-server')

let isListenRestart = false

const logRestart = ({ filename, forcing }) => {
  const offset = '   '
  const symbol = chalk.blue(logSymbols.info)
  const timestamp = chalk.gray(getTimestamp('HH:mm:ss'))
  const header = chalk.blue(forcing ? 'restart' : 'modified')
  const message = chalk.gray(filename || '')
  console.log(`${offset} ${symbol} ${timestamp} ${header} ${message}`)
}

module.exports = ({ filename, filepkg, server, cli, sockets }) => {
  const watchConfig = getWatchConfig({ cli, filepkg })
  const watcher = watch('.', watchConfig)

  const doRestart = ({ filename, forcing }) => {
    logRestart({ filename, forcing })
    destroySockets(sockets)
    server.close(restartServer.bind(this, { filename, filepkg, cli, watcher }))
  }

  watcher.once(
    'all',
    debounce((event, filename) => doRestart({ filename, forcing: false })),
    10
  )

  if (!isListenRestart) {
    isListenRestart = true

    process.stdin.on('data', data => {
      const text = data.toString().trim().toLowerCase()
      if (text === 'rs') doRestart({ filename, forcing: true })
    })
  }
}
