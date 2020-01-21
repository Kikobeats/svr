#!/usr/bin/env node

'use strict'

if (process.env.NODE_ENV === 'production') {
  throw Error('`svr` is only oriented for development scenarios.')
}

const path = require('path')

const pkg = require('../../package.json')
const getMainFile = require('./get-main-file')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(require('./help'), {
  pkg,
  flags: {
    port: {
      type: 'number',
      default: process.env.port || process.env.PORT || 3000
    },
    poll: {
      type: 'boolean',
      default: false
    },
    ignore: {
      type: 'array',
      default: []
    },
    host: {
      default: '::'
    },
    watch: {
      type: 'array',
      default: []
    },
    depth: {
      type: 'number'
    },
    restartSignal: {
      type: 'string'
    },
    cwd: {
      default: process.cwd()
    }
  }
})

const watchFiles = watch => {
  if (watch[0] === false) return false
  return Array.isArray(watch) ? watch : [watch]
}

;(async () => {
  const { input } = cli
  const { cwd, port, watch, ...opts } = cli.flags
  const { filename, pkg } = getMainFile({ input, cwd })
  const filepath = path.resolve(cwd, filename)

  require('../serve')({
    filepath,
    pkg,
    cwd,
    port,
    watchFiles: watchFiles(watch),
    ...opts
  })
})()
