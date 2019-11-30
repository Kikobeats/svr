'use strict'

const clearModule = require('clear-module')

module.exports = ({ spinner, ...opts }) => {
  clearModule.all()

  // Restart the server
  require('../serve')({ ...opts, restarting: true })
  spinner.stop()
}
