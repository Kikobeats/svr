'use strict'

const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const { watch } = require('chokidar')
const chalk = require('chalk')

const destroySockets = require('./destroy-sockets')
const getWatchConfig = require('./get-watch-config')
const restartServer = require('./restart-server')

const logRestart = filename => {
  const offset = '   '
  const symbol = chalk.blue(logSymbols.info)
  const timestamp = chalk.gray(getTimestamp('HH:mm:ss'))
  const header = chalk.blue(filename ? 'modified' : 'restart')
  const message = chalk.gray(filename || '')
  console.log(`${offset} ${symbol} ${timestamp} ${header} ${message}`)
}

module.exports = ({ filename, filepkg, server, cli, sockets }) => {
  const watchConfig = getWatchConfig({ cli, filepkg })
  const watcher = watch('.', watchConfig)

  const doRestart = filename => {
    logRestart(filename)
    destroySockets(sockets)
    server.close(restartServer.bind(this, { filename, filepkg, cli, watcher }))
  }

  watcher.on('all', (event, filename) => doRestart(filename))

  process.stdin.on('data', data => {
    const text = data.toString().trim().toLowerCase()
    if (text === 'rs') doRestart()
  })
}
