#!/usr/bin/env node

'use strict'

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
        default: 3000
      },
      poll: {
        type: 'boolean',
        alias: 'L',
        default: false
      },
      ignore: {
        alias: 'i'
      },
      host: {
        alias: 'H'
      },
      cold: {
        alias: 'c'
      },
      silent: {
        alias: 's'
      }
    }
  }
)
;(async () => {
  const { filename, pkg } = getMainFile(cli)
  require('../serve')({ filename, pkg, cli, restarting: false })
})()
