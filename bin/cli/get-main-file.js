'use strict'

const jsonFuture = require('json-future')
const path = require('path')

module.exports = cli => {
  const pkg = jsonFuture.load(path.resolve(process.cwd(), 'package.json'))
  const { main: mainFile = 'index.js' } = pkg
  const [filename = mainFile] = cli.input

  return { filename, pkg }
}
