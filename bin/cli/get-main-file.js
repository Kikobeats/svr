'use strict'

const jsonFuture = require('json-future')
const path = require('path')

module.exports = cli => {
  const pkg = jsonFuture.load(path.resolve(process.cwd(), 'package.json'))
  const filenameFallback = pkg.main || 'index.js'
  const [filename = filenameFallback] = cli.input
  return path.resolve(process.cwd(), filename)
}
