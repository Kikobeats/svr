'use strict'

const ignoredDirectories = require('ignore-by-default').directories()
const getIgnoredFromGit = require('ignored')
const path = require('path')

const getIgnoredFiles = ({ ignore = [], pkg, pwd }) => {
  const set = new Set()
  const addIgnore = value => set.add(value)

  const gitignore = path.resolve(pwd, '.gitignore')
  getIgnoredFromGit(gitignore).forEach(addIgnore)
  ;[].concat(ignore).forEach(addIgnore)
  if (pkg.ignore) pkg.ignore.forEach(addIgnore)

  ignoredDirectories.forEach(addIgnore)

  const rawIgnored = Array.from(set)

  return rawIgnored.reduce((acc, ignore) => {
    const file = path.resolve(pwd, ignore)
    acc.push(file)
    return acc
  }, [])
}

module.exports = ({ poll: usePolling, ...opts }) => {
  const ignored = getIgnoredFiles(opts)

  const watchConfig = {
    usePolling,
    ignoreInitial: true,
    ignored
  }

  return watchConfig
}
