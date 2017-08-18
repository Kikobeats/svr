'use strict'

const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const { watch } = require('chokidar')
const chalk = require('chalk')
const path = require('path')

const destroySockets = require('./destroy-sockets')
const getWatchConfig = require('./get-watch-config')
const restartServer = require('./restart-server')

const logRestart = filepath => {
  const offset = '   '
  const symbol = chalk.blue(logSymbols.info)
  const timestamp = chalk.gray(getTimestamp('HH:mm:ss'))
  const header = chalk.blue(filepath ? 'modified' : 'restart')
  const message = chalk.gray(filepath || '')
  console.log(`${offset} ${symbol} ${timestamp} ${header} ${message}`)
}

module.exports = ({ filepath, filepkg, server, cli, sockets }) => {
  const watchConfig = getWatchConfig({ cli, filepkg })
  const watcher = watch('.', watchConfig)

  const doRestart = filepath => {
    logRestart()
    destroySockets(sockets)
    server.close(restartServer.bind(this, { filepath, filepkg, cli, watcher }))
  }

  watcher.on('all', (event, filePath) => {
    const filepath = path.relative(process.cwd(), filePath)
    doRestart(filepath)
  })

  process.stdin.on('data', data => {
    const text = data.toString().trim().toLowerCase()
    if (text === 'rs') doRestart()
  })
}
