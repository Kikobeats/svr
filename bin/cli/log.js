'use strict'

const indentString = require('indent-string')
const PrettyError = require('pretty-error')
const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const cleanStack = require('clean-stack')

const logUpdate = require('log-update')
const chalk = require('chalk')
const ora = require('ora')

const getCurrentTimestamp = () => getTimestamp('HH:mm:ss')
const createSpinner = () => ora({ color: 'gray' })
const pe = new PrettyError()

pe.appendStyle({
  // this is a simple selector to the element that says 'Error'
  'pretty-error > header > title > kind': {
    background: 'none',
    marginRight: 1
  },

  'pretty-error > header > colon': {
    display: 'none'
  },

  'pretty-error > header > message': {
    color: 'grey'
  },

  'pretty-error > trace > item > header > pointer > file': {
    color: 'white'
  },

  'pretty-error > trace > item > header > pointer > colon': {
    color: 'white'
  },

  'pretty-error > trace > item > header > pointer > line': {
    color: 'white'
  },

  'pretty-error > trace > item > header > what': {
    color: 'grey'
  }
})

const OFFSET = '    '

module.exports = {
  error (err) {
    const symbol = chalk.blue(logSymbols.error)
    const stack = cleanStack(err.stack)
    const cleanErr = Object.assign({}, err, { stack })
    const prettyErr = pe.render(cleanErr)
    console.log(indentString(`${symbol}${prettyErr}`, OFFSET.length))
  },
  restart ({ filename, forcing }) {
    const symbol = chalk.blue(logSymbols.info)
    const timestamp = chalk.gray(getCurrentTimestamp())
    const header = chalk.blue(forcing ? 'restart' : 'modified')
    const message = chalk.gray(filename || '')
    const spinner = createSpinner()
    const logMessage = `${OFFSET} ${symbol} ${timestamp} ${header} ${message}`

    let done = false

    const timer = setInterval(() => {
      done
        ? logUpdate(`${logMessage}`)
        : logUpdate(`${logMessage} ${spinner.frame()}`)
    }, 50)

    return {
      stop: () => {
        done = true
        setTimeout(() => {
          clearInterval(timer)
          logUpdate.done()
        }, 50)
      }
    }
  }
}
