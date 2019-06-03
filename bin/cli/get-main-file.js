'use strict'

const loadJsonFile = require('load-json-file')
const path = require('path')

module.exports = ({ cwd, input }) => {
  const pkg = loadJsonFile.sync(path.resolve(cwd, 'package.json'))
  const { main: mainFile = 'index.js' } = pkg
  const [filename = mainFile] = input
  return { filename, pkg }
}
