'use strict'

const { watch } = require('chokidar')
const debounce = require('debounce')

const { restart: logRestart } = require('../serve/log')
const getWatchConfig = require('./get-watch-config')
const destroySockets = require('./destroy-sockets')
const restartServer = require('./restart-server')

let firsTime = false

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
  const spinner = logRestart({ filename, forcing })
  destroySockets(sockets)
  server.close(
    restartServer.bind(this, { spinner, ignored, filename, pkg, cli, watcher })
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
