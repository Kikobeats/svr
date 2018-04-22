<h1>
  <br>
  <img src="/static/logo.png" alt="svr">
  <br>
  <br>
  <img src="/demo.gif" alt="svr">
  <br>
</h1>

![Last version](https://img.shields.io/github/tag/Kikobeats/svr.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/Kikobeats/svr/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/svr)
[![Dependency status](https://img.shields.io/david/Kikobeats/svr.svg?style=flat-square)](https://david-dm.org/Kikobeats/svr)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/svr.svg?style=flat-square)](https://david-dm.org/Kikobeats/svr#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/svr.svg?style=flat-square)](https://www.npmjs.org/package/svr)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> Development HTTP server done right

## Features

- **Hot Reloading**: Automagically reload modified files, not the process.
- **Pretty Errors**: They will be beautifully rendered.
- **Port Selection**: Automatic detection and use of an open port (if the specified one is in use).

The idea behind this project is **smart reload**, avoiding reload completely the process. It just reload the code that changes!

It's similar [micro-dev](https://github.com/zeit/micro-dev), but out of the box for any framework that use [http.Server.listen()](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback) interface.

## Installation

You can install it as global

```bash
$ npm install svr --global
```

Or use it as part of your development workflow as a `devDependency`:

```bash
$ npm install svr --save-dev
```

## Usage

### Getting Started

After installation, just call it:

```bash
$ svr
```

We recommend add **svr** as npm script:

```json
{
  "scripts": {
    "dev": "srv"
  }
}
```

Now, running `npm run dev` it will be start your HRM development server:

```bash
$ npm start

  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   my-express-api is running!                      │
  │                                                   │
  │   • Local:            http://localhost:3000       │
  │   • On Your Network:  http://192.168.1.106:3000   │
  │                                                   │
  └───────────────────────────────────────────────────┘
```

**svr** is assuming you have a `main` file declared in your `package.json` in the project directory.

Otherwise, you can provide the file path as first argument:

```bash
$ svr src/server/routes.js
```

The only requirement is define the main file of your server as exported function that follow this interface:

```js
module.exports = (app, express) => {
/* your awesome code here */
}
```

If your project directory is different from the current directory you can specify it as well using `-d` or `--cwd` flag:

```bash
$ svr src/server/routes.js --cwd=~/Projects/my-express-api
```

Type  `svr --help` to get all the information.

### Watching for changes

After start, whatever file modification in the project directory will be listened by **svr** automagically:

```bash
  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   my-express-api is running!                      │
  │                                                   │
  │   • Local:            http://localhost:3000       │
  │   • On Your Network:  http://192.168.1.106:3000   │
  │                                                   │
  └───────────────────────────────────────────────────┘

   ℹ 18:32:42 modified index.js
```

If you need to reload the server on demand, just type `rs`:

```bash
  ┌───────────────────────────────────────────────────┐
  │                                                   │
  │   my-express-api is running!                      │
  │                                                   │
  │   • Local:            http://localhost:3000       │
  │   • On Your Network:  http://192.168.1.106:3000   │
  │                                                   │
  └───────────────────────────────────────────────────┘

   ℹ 18:32:42 modified index.js
   rs
   ℹ 18:34:07 restart index.js
```

**svr** only will be listen files in the current directory by default.

You can use `-w` or `--watch` to add more file path to be listened

```bash
$ svr src/server/routes.js
```

Type  `svr --help` to get all the information.

### Ignoring files

**svr** takes into consideration ignore non relevant files.

By default, it will be to ignore:

- well known files to ignore, like `node_modules`, `.git`, etc.
- `.gitignore` declarations.
- `ignored` field in your `package.json`.

You can declare:

- Relative or absolute paths.
- Glob patterns.

If you need to add a specific file to ignore, use `i`  or `--ignore` flag:

```bash
$ svr -i .cache -i public
```

## Tips

### Main file

This could be a good start point for a HTTP server:

```js
const isProduction = process.env.NODE_ENV === 'production'

module.exports = (app, express) => {
  /* here you can do whatever you want */
  app
    .use(require('helmet')())
    .use(require('compression')())
    .use(require('cors')())
    .use(require('jsendp')())
    .use(require('express-status-monitor')())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .use(require('morgan')(isProduction ? 'combined' : 'dev'))
    .use(express.static('static'))
    .disable('x-powered-by')

  app.get('/', async function (req, res) {
    return res.send('hello world')
  })

  return app
}
```

### Production Server

**svr** is oriented just for development scenarios.

Under production, simply create the boostraping server that you need.

For example, let's create a `bin/server` as production server:

```
#!/usr/bin/env node

'use strict'

const express = require('express')

const app = express()

require('./index')(app, express)

const port = process.env.PORT || process.env.port || 3000
const { name } = require('../package.json')

app.listen(port, function () {
  console.log(`${name} is running at http://localhost:${port}`)
})
```

Just add it as `npm start` script

```
{
  "scripts": {
    "start": "bin/server"
  }
}
```

That's all.

## License

MIT © [Kiko Beats](https://github.com/Kikobeats).
