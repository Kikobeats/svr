#!/usr/bin/env node

'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')

const pkg = require('../../package.json')
const getMainFile = require('./get-main-file')

require('update-notifier')({ pkg }).notify()

const cli = require('meow')(
  require('fs').readFileSync(path.join(__dirname, 'help.txt'), 'utf8'),
  {
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
        alias: 'H'
      },
      cold: {
        alias: 'c'
      },
      silent: {
        alias: 's'
      },
      pwd: {
        default: process.cwd()
      }
    }
  }
)
;(async () => {
  const { filename, pkg } = getMainFile(cli)
  const { pwd, port, ...opts } = cli.flags
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
