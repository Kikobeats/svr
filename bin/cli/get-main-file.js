'use strict'

const jsonFuture = require('json-future')
const path = require('path')

module.exports = cli => {
  const filepkg = jsonFuture.load(path.resolve(process.cwd(), 'package.json'))
  const filenameFallback = filepkg.main || 'index.js'
  const [filename = filenameFallback] = cli.input

  return { filename, filepkg }
}
