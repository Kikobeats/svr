'use strict'

const chalk = require('chalk')

module.exports = `
  ${chalk.bold('Usage')}

    $ svr [path][options]

  ${chalk.bold('Options')}

    -p, --port          Port to listen on ${chalk.gray('[default=3000]')}

    -H, --host          The host on which svr will run ${chalk.gray(
    "[default='localhost']"
  )}

    -d, --pwd           A directory to start ${chalk.gray('[default=cwd]')}

    -L, --poll          Poll for code changes rather than using events ${chalk.gray(
    '[default=false]'
  )}

    -i  --ignore        Ignore watching a file, directory, or glob ${chalk.gray(
    '[default=.gitignore, pkg.ignore]'
  )}

    -v, --version       Output the version number

    -h, --help          Show this usage information

  ${chalk.bold('Examples')}

  ${chalk.green(
    '–'
  )} Start on the current directory watching the main file declared at \`package.json\`

    $ svr

  ${chalk.green('–')} Start specifing the file to watch
    $ svr ${chalk.gray('src/index.js')}
`
