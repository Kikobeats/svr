'use strict'

const chalk = require('chalk')

module.exports = `
  ${chalk.bold('Usage')}

    $ svr [path][options]

  ${chalk.bold('Options')}

    -p, --port          Port to listen on ${chalk.gray('[default=3000]')}

    -H, --host          The host on which svr will run ${chalk.gray("[default='localhost']")}

    -d, --pwd           A directory to start ${chalk.gray('[default=cwd]')}

    -L, --poll          Poll for code changes rather than using events ${chalk.gray(
      '[default=false]'
    )}

    -i,  --ignore       Ignore watching a file, directory, or glob ${chalk.gray(
      '[default=.gitignore, pkg.ignore]'
    )}

    -w, --watch         Add more files than the project path to watch

    -v, --version       Output the version number

    -h, --help          Show this usage information

  ${chalk.bold('Examples')}

  ${chalk.green(
    '–'
  )} Start on the current directory watching the main file declared at \`package.json\`

    $ svr

  ${chalk.green('–')} Start on the current directory specifing your main file
    $ svr ${chalk.gray('src/server/routes.js')}

  ${chalk.green('–')} Add an external project file to watch
    $ svr ${chalk.gray('-w node_modules/api-documentation/*.md')}

  ${chalk.green('–')} Add more project files to be ignored
    $ svr ${chalk.gray('-i .cache -i public')}
`
