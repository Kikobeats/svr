'use strict'

const jsonFuture = require('json-future')
const path = require('path')

module.exports = ({ pwd, input }) => {
  const pkg = jsonFuture.load(path.resolve(pwd, 'package.json'))
  const { main: mainFile = 'index.js' } = pkg
  const [filename = mainFile] = input

  return { filename, pkg }
}
