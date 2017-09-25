'use strict'

const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const debounce = require('debounce')
const { watch } = require('chokidar')
const chalk = require('chalk')

const getWatchConfig = require('./get-watch-config')
const destroySockets = require('./destroy-sockets')
const restartServer = require('./restart-server')

let firsTime = false

const logRestart = ({ filename, forcing }) => {
  const offset = '   '
  const symbol = chalk.blue(logSymbols.info)
  const timestamp = chalk.gray(getTimestamp('HH:mm:ss'))
  const header = chalk.blue(forcing ? 'restart' : 'modified')
  const message = chalk.gray(filename || '')
  console.log(`${offset} ${symbol} ${timestamp} ${header} ${message}`)
}

const doRestart = ({
  ignored,
  sockets,
  server,
  filename,
  pkg,
  forcing,
  cli,
  watcher
}) => {
  logRestart({ filename, forcing })
  destroySockets(sockets)
  server.close(
    restartServer.bind(this, { ignored, filename, pkg, cli, watcher })
  )
}

module.exports = ({ filename, pkg, server, cli, sockets }) => {
  const { watchConfig, rawIgnored: ignored } = getWatchConfig({ cli, pkg })
  const watcher = watch(process.cwd(), watchConfig)

  const restart = ({ forcing }) =>
    doRestart({
      ignored,
      sockets,
      server,
      filename,
      pkg,
      forcing,
      cli,
      watcher
    })

  watcher.once(
    'all',
    debounce((event, filename) => restart({ forcing: false })),
    10
  )

  if (!firsTime) {
    firsTime = true
    process.stdin.on('data', data => {
      const text = data
        .toString()
        .trim()
        .toLowerCase()
      if (text === 'rs') restart({ forcing: true })
    })
  }
}
