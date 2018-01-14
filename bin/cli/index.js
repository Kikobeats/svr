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
      alias: 'p',
      default: process.env.port || process.env.PORT || 3000
    },
    poll: {
      type: 'boolean',
      alias: 'L',
      default: false
    },
    ignore: {
      alias: 'i',
      type: 'array',
      default: []
    },
    host: {
      alias: 'H',
      default: '::'
    },
    pwd: {
      default: process.cwd()
    }
  }
})
;(async () => {
  const { input } = cli
  const { pwd, port, ...opts } = cli.flags
  const { filename, pkg } = getMainFile({ input, pwd })

  const filepath = path.resolve(pwd, filename)

  require('../serve')({
    restarting: false,
    filepath,
    pkg,
    pwd,
    port,
    ...opts
  })
})()
