'use strict'

const clearModule = require('clear-module')
const anymatch = require('anymatch')
const path = require('path')

module.exports = ({ spinner, filepath, pkg, cwd, cli, watchFiles, port, watcher, ignored }) => {
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
    .map(filename => path.resolve(cwd, filename))

  // Remove file that changed from the `require` cache
  for (const item of toDelete) {
    // discard items not required before
    if (!require.cache[item]) continue
    clearModule(item)
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
