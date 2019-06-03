#!/usr/bin/env node

'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

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
      type: 'number',
      default: undefined
    },
    cwd: {
      default: process.cwd()
    }
  }
})
;(async () => {
  const { input } = cli
  const { cwd, port, watch: watchFiles, ...opts } = cli.flags
  const { filename, pkg } = getMainFile({ input, cwd })
  const filepath = path.resolve(cwd, filename)

  require('../serve')({
    filepath,
    pkg,
    cwd,
    port,
    watchFiles: Array.isArray(watchFiles) ? watchFiles : [watchFiles],
    ...opts
  })
})()
