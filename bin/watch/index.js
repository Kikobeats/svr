'use strict'

const { watch } = require('chokidar')
const debounce = require('debounce')
const path = require('path')

const { restart: logRestart } = require('../cli/log')
const getWatchConfig = require('./get-watch-config')
const destroySockets = require('./destroy-sockets')
const restartServer = require('./restart-server')

const RESTART_SIGNAL = 'rs'

const isRestartSignal = str =>
  str
    .toString()
    .trim()
    .toLowerCase() === RESTART_SIGNAL

let firsTime = false

const doRestart = ({
  ignored,
  sockets,
  server,
  filepath,
  pkg,
  pwd,
  forcing,
  cli,
  watcher
}) => {
  const filename = path.basename(filepath)
  const spinner = logRestart({ filename, forcing })
  destroySockets(sockets)
  server.close(
    restartServer.bind(this, {
      spinner,
      ignored,
      filepath,
      filename,
      pkg,
      pwd,
      cli,
      watcher
    })
  )
}

module.exports = ({ filepath, pwd, pkg, server, sockets, ...opts }) => {
  const { watchConfig, rawIgnored: ignored } = getWatchConfig({
    pwd,
    pkg,
    ...opts
  })
  const watcher = watch(pwd, watchConfig)

  const restart = ({ forcing }) =>
    doRestart({
      ignored,
      sockets,
      server,
      filepath,
      pwd,
      pkg,
      forcing,
      watcher,
      ...opts
    })

  watcher.once(
    'all',
    debounce((event, filename) => restart({ forcing: false })),
    10
  )

  if (!firsTime) {
    firsTime = true

    process.stdin.on('data', data => {
      if (isRestartSignal(data)) restart({ forcing: true })
    })
  }
}
