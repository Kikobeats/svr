'use strict'

const clearModule = require('clear-module')
const path = require('path')

module.exports = ({ file, cli, watcher }) => {
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

  toDelete = toDelete.map(filename => path.resolve(process.cwd(), filename))

  // Stop watching any files
  watcher.close()

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
  require('../serve')({ file, cli, restarting: true })
}
