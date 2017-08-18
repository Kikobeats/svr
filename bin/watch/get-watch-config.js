'use strict'

const getIgnoredFromGit = require('ignored')
const path = require('path')

const DEFAULT_IGNORED = [
  '.git',
  'node_modules',
  '.nyc_output',
  '.sass-cache',
  'coverage',
  /\.swp$/
]

const getIgnoredFiles = ({ cli, filepkg }) => {
  const set = new Set()
  const addIgnore = set.add.bind(set)

  const gitignore = path.resolve(process.cwd(), '.gitignore')
  getIgnoredFromGit(gitignore).forEach(addIgnore)

  if (cli.flags.ignore) cli.flags.ignore.forEach(addIgnore)
  if (filepkg.ignore) filepkg.ignore.forEach(addIgnore)

  DEFAULT_IGNORED.forEach(addIgnore)

  return Array.from(set)
}

module.exports = ({ cli, filepkg }) => {
  const { poll: usePolling } = cli.flags
  const ignored = getIgnoredFiles({ cli, filepkg })

  const watchConfig = {
    usePolling,
    ignoreInitial: true,
    cwd: process.cwd(),
    ignored
  }

  return watchConfig
}
