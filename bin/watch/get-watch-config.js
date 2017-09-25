'use strict'

const ignoredDirectories = require('ignore-by-default').directories()
const { existsSync, statSync } = require('fs')
const getIgnoredFromGit = require('ignored')
const path = require('path')

const isDirSync = path => existsSync(path) && statSync(path).isDirectory()

const getIgnoredFiles = ({ cli, pkg }) => {
  const set = new Set()
  const addIgnore = value => set.add(value)

  const gitignore = path.resolve(process.cwd(), '.gitignore')
  getIgnoredFromGit(gitignore).forEach(addIgnore)

  if (cli.flags.ignore) cli.flags.ignore.forEach(addIgnore)
  if (pkg.ignore) pkg.ignore.forEach(addIgnore)

  ignoredDirectories.forEach(addIgnore)

  const rawIgnored = Array.from(set)

  const ignored = rawIgnored.reduce((acc, ignore) => {
    const file = path.resolve(process.cwd(), ignore)
    acc.push(isDirSync(file) ? `**/${path.basename(file)}/**` : ignore)
    return acc
  }, [])

  return { ignored, rawIgnored }
}

module.exports = ({ cli, pkg }) => {
  const { poll: usePolling } = cli.flags
  const { ignored, rawIgnored } = getIgnoredFiles({ cli, pkg })

  const watchConfig = {
    usePolling,
    ignoreInitial: true,
    ignored
  }

  return { watchConfig, ignored, rawIgnored }
}
