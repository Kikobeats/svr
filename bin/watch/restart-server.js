'use strict'

const clearModule = require('clear-module')

module.exports = ({ spinner, filepath, pkg, cwd, cli, watchFiles, port }) => {
  clearModule.all()

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
