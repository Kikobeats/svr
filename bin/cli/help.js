'use strict'

const chalk = require('chalk')

module.exports = `
  ${chalk.bold('Usage')}

    $ svr ${chalk.gray('[path][options]')}

  ${chalk.bold('Options')}

    --depth          If set, limits how many levels of subdirectories will be traversed. ${chalk.gray(
    '[default=undefined]'
  )}
    --help           Show this usage information
    --host           The host on which svr will run ${chalk.gray(
    "[default='localhost']"
  )}
    --ignore         Ignore watching a file, directory, or glob ${chalk.gray(
    '[default=.gitignore, pkg.ignore]'
  )}
    --poll           Poll for code changes rather than using events ${chalk.gray(
    '[default=false]'
  )}
    --port           Port to listen on ${chalk.gray('[default=3000]')}
    --pwd            A directory to start ${chalk.gray(
    '[default=process.cwd()]'
  )}
    --restart-signal Associate an UNIX signal to be emitted after restart is done
    --version        Output the version number
    --watch          Add more files than the project path to watch ${chalk.gray(
    '[default=process.cwd()]'
  )}

  ${chalk.bold('Examples')}

  ${chalk.green(
    '–'
  )} Start on the current directory watching the main file declared at \`package.json\`

    $ svr

  ${chalk.green('–')} Start on the current directory specifing your main file
    $ svr ${chalk.gray('src/server/routes.js')}

  ${chalk.green('–')} Add an external project file to watch
    $ svr ${chalk.gray('--watch node_modules/api-documentation/*.md')}

  ${chalk.green('–')} Add more project files to be ignored
    $ svr ${chalk.gray('--ignore .cache -i public')}

    ${chalk.green('–')} Emit SIGUSR2 after restart
    $ svr ${chalk.gray('--restart-signal SIGUSR2')}
`
