'use strict'

const clearModule = require('clear-module')
const anymatch = require('anymatch')
const path = require('path')

module.exports = ({
  spinner,
  filepath,
  filename,
  pkg,
  pwd,
  cli,
  watchFiles,
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

  const matchers = anymatch(ignored)

  toDelete = toDelete
    .filter(filename => !matchers(path.basename(filename)))
    .map(filename => path.resolve(pwd, filename))

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
    filepath,
    pkg,
    pwd,
    cli,
    restarting: true,
    watchFiles
  })
  spinner.stop()
}
