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

> HTTP development server done right.

## Features

- **Smart reload**, just reloading modified files to do development fast.
- **Reload on demand**, after type `rs` on your terminal.
- **Pretty Errors**, making unexpected errors easy to read.
- **Port Selection**, supporting detection for already in use ports.
- **Clipboard Support**, copying the local address in your clipboard.
- **Debug in Your Network**, exposing the process in your local network.

It's similar [`micro-dev`](https://github.com/zeit/micro-dev), but compatible with any function that exposes `req, res` interface (micro, express, koa, hapi, fastify, etc).

## Installation

```bash
$ npm install svr --save
```

## Usage

### Defining entry point

Create a file and export a function that accepts the standard `http.IncomingMessage` and `http.ServerResponse` objects, that means, the exported function should be receive `req, res`:

```js
const express = require('express')
const { Router } = express
const router = Router()

// define middlewares
router.use(require('helmet')())
router.use(require('compression')())
router.use(require('cors')())

// define routes
router.get('/', (req, res) => res.status(204).send())
router.get('/robots.txt', (req, res) => res.status(204).send())
router.get('/favicon.txt', (req, res) => res.status(204).send())

// expose router
module.exports = router
```

After that, just call **svr**:

```bash
$ svr
```

**svr** is assuming you have a `main` file declared in your `package.json` in the project directory. Also, you can provide it as first argument:

```bash
$ svr index.js
```

We recommend setup **svr** as npm script:

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

You can type `svr --help` to see all the options.

### Smart Reload

When a file is modified in the project directory, **svr** will reload just the modified file:

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

Also, **svr** takes into consideration files that can be ignored:

- Well known files to ignore, like `node_modules`, `.git`, etc.
- `.gitignore` declarations.
- `ignored` field in your `package.json`.

If you need to add a specific file to ignore, use `i`  or `--ignore` flag:

```bash
$ svr -i .cache -i public
```

Also, you can use `-w` or `--watch` to add more file path to be listened. You can declare:

- Relative or absolute paths.
- Glob patterns.

## Reload on demand

In any moment you can refresh the process typing `rs` in the terminal window where **svr** is running:

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

### Don't use on production

**svr** is oriented **just for development** scenarios, **not** for production.

Under production, simply create the server you need based on your necessities, for example, let's create a `bin/server` as production server:

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

You can declare it as `npm start` script

```
{
  "scripts": {
	  "dev": "svr",
    "start": "bin/server"
  }
}
```

That's all.

## License

MIT © [Kiko Beats](https://github.com/Kikobeats).
