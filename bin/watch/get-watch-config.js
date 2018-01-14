'use strict'

const ignoredDirectories = require('ignore-by-default').directories()
const { existsSync, statSync } = require('fs')
const getIgnoredFromGit = require('ignored')
const path = require('path')

const isDirSync = path => existsSync(path) && statSync(path).isDirectory()

const getIgnoredFiles = ({ ignore = [], pkg, pwd }) => {
  const set = new Set()
  const addIgnore = value => set.add(value)

  const gitignore = path.resolve(pwd, '.gitignore')
  getIgnoredFromGit(gitignore).forEach(addIgnore)
  ;[].concat(ignore).forEach(addIgnore)
  if (pkg.ignore) pkg.ignore.forEach(addIgnore)

  ignoredDirectories.forEach(addIgnore)

  const rawIgnored = Array.from(set)

  const ignored = rawIgnored.reduce((acc, ignore) => {
    const file = path.resolve(pwd, ignore)
    acc.push(isDirSync(file) ? `**/${path.basename(file)}/**` : ignore)
    return acc
  }, [])

  return { ignored, rawIgnored }
}

module.exports = ({ poll: usePolling, ...opts }) => {
  const { ignored, rawIgnored } = getIgnoredFiles(opts)

  const watchConfig = {
    usePolling,
    ignoreInitial: true,
    ignored
  }

  return { watchConfig, ignored, rawIgnored }
}
