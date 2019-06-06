'use strict'

const clearModule = require('clear-module')
const picomatch = require('picomatch')
const path = require('path')

module.exports = ({
  spinner,
  filepath,
  filename,
  pkg,
  cwd,
  cli,
  watchFiles,
  port,
  watcher,
  ignored
}) => {
  const watched = watcher.getWatched()
  let toDelete = []

  for (const mainPath in watched) {
    if (!{}.hasOwnProperty.call(watched, mainPath)) {
      continue
    }

    const subPaths = watched[mainPath]

    for (const subPath of subPaths) {
      const full = path.join(mainPath, subPath)
      toDelete.push(full)
    }
  }

  const matchers = picomatch(ignored)

  toDelete = toDelete
    .filter(filename => !matchers(path.basename(filename)))
    .map(filename => path.resolve(cwd, filename))

  // Remove file that changed from the `require` cache
  for (const item of toDelete) {
    let location

    try {
      location = require.resolve(item)
    } catch (err) {
      continue
    }

    clearModule(location)
  }

  // Restart the server
  require('../serve')({
    port,
    filepath,
    pkg,
    cwd,
    cli,
    restarting: true,
    watchFiles
  })
  spinner.stop()
}
