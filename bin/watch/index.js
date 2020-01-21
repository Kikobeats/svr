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

const doRestart = ({ sockets, server, filename, forcing, ...opts }) => {
  const spinner = logRestart({ filename, forcing })
  destroySockets(sockets)
  server.close(
    restartServer.bind(this, {
      ...opts,
      sockets,
      server,
      filename,
      forcing,
      spinner
    })
  )
}

module.exports = ({ cwd, pkg, watchFiles, ...opts }) => {
  const watchConfig = getWatchConfig({
    ...opts,
    cwd,
    pkg
  })

  const restart = ({ forcing, filename }) =>
    doRestart({
      ...opts,
      watchFiles,
      filename,
      cwd,
      pkg,
      forcing
    })

  if (watchFiles) {
    const toWatch = [].concat(watchFiles, cwd)
    const watcher = watch(toWatch, watchConfig)
    watcher.once(
      'all',
      debounce(
        (event, filename) => restart({ forcing: false, filename: path.relative(cwd, filename) }),
        10
      )
    )
  }

  process.stdin.once('data', data => {
    if (isRestartSignal(data)) restart({ forcing: true })
  })
}
