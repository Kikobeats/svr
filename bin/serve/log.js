'use strict'

const getTimestamp = require('time-stamp')
const logSymbols = require('log-symbols')
const cleanStack = require('clean-stack')
const logUpdate = require('log-update')
const chalk = require('chalk')
const ora = require('ora')

const createSpinner = () => ora({ color: 'gray' })
const getCurrentTimestamp = () => getTimestamp('HH:mm:ss')

const OFFSET = '    '

module.exports = {
  error (err) {
    const symbol = chalk.blue(logSymbols.error)
    const timestamp = chalk.gray(getCurrentTimestamp())

    const [message, ...stackTraces] = chalk
      .gray(
        cleanStack(err.stack)
          .replace('Error: ', chalk.red('error '))
          .replace('Cannot', 'cannot')
      )
      .split('\n')

    const stackTrace = stackTraces.map(msg => `${OFFSET}${msg}`).join('')
    const logMessage = `${OFFSET} ${symbol} ${timestamp} ${message}`
    console.log(`${logMessage}\n${stackTrace}\n`)
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
