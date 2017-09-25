#!/usr/bin/env node

'use strict'

const path = require('path')

const pkg = require('../../package.json')
const getMainFile = require('./get-main-file')

require('update-notifier')({ pkg }).notify()

const log = require('acho')({
  types: require('acho-skin-cli'),
  keyword: 'symbol'
})

const cli = require('meow')(
  {
    pkg,
    help: require('fs').readFileSync(path.join(__dirname, 'help.txt'), 'utf8')
  },
  {
    alias: {
      p: 'port',
      L: 'poll',
      v: 'version',
      h: 'help',
      i: 'ignore',
      H: 'host',
      c: 'cold',
      s: 'silent'
    },
    default: {
      poll: false,
      port: 3000
    }
  }
)
;(async () => {
  try {
    const { filename, pkg } = getMainFile(cli)
    require('../serve')({ filename, pkg, cli, restarting: false })
  } catch (err) {
    log.error(err.message || err)
    process.exit(1)
  }
})()
