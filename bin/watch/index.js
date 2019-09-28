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
  filename,
  filepath,
  pkg,
  cwd,
  forcing,
  cli,
  watchFiles,
  watcher,
  port
}) => {
  const spinner = logRestart({ filename, forcing })
  destroySockets(sockets)
  server.close(
    restartServer.bind(this, {
      watchFiles,
      spinner,
      ignored,
      filepath,
      pkg,
      cwd,
      cli,
      watcher,
      port
    })
  )
}

module.exports = ({ filepath, watchFiles, cwd, pkg, server, sockets, ...opts }) => {
  const watchConfig = getWatchConfig({
    cwd,
    pkg,
    ...opts
  })

  const toWatch = [].concat(watchFiles, cwd)
  const watcher = watch(toWatch, watchConfig)

  const restart = ({ forcing, filename }) =>
    doRestart({
      watchFiles,
      ignored: watchConfig.ignored,
      sockets,
      server,
      filename,
      filepath,
      cwd,
      pkg,
      forcing,
      watcher,
      ...opts
    })

  watcher.once(
    'all',
    debounce(
      (event, filename) => restart({ forcing: false, filename: path.relative(cwd, filename) }),
      10
    )
  )

  if (!firsTime) {
    firsTime = true

    process.stdin.on('data', data => {
      if (isRestartSignal(data)) restart({ forcing: true })
    })
  }
}
