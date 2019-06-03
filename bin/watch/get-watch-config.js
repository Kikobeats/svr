'use strict'

const ignoredDirectories = require('ignore-by-default').directories()
const getIgnoredFromGit = require('ignored')
const path = require('path')

const getIgnoredFiles = ({ ignore = [], pkg, cwd }) => {
  const set = new Set()
  const addIgnore = value => set.add(value)

  const gitignore = path.resolve(cwd, '.gitignore')
  getIgnoredFromGit(gitignore).forEach(addIgnore)
  ;[].concat(ignore).forEach(addIgnore)
  if (pkg.ignore) pkg.ignore.forEach(addIgnore)

  ignoredDirectories.forEach(addIgnore)

  const rawIgnored = Array.from(set)

  return rawIgnored.reduce((acc, ignore) => {
    const file = path.resolve(cwd, ignore)
    acc.push(file)
    return acc
  }, [])
}

module.exports = ({ cwd, depth, poll: usePolling, ...opts }) => {
  const ignored = getIgnoredFiles({ cwd, ...opts })

  const watchConfig = {
    ignoreInitial: true,
    usePolling,
    ignored,
    depth,
    cwd
  }

  return watchConfig
}
