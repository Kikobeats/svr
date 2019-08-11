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

> HTTP development server done right

## Features

- **Hot Reloading**: Automagically reload modified files, not the process.
- **Pretty Errors**: They will be beautifully rendered.
- **Port Selection**: Automatic detection and use of an open port (if the specified one is in use).

The idea behind this project is **smart reload**, avoiding reload completely the process. It just reload the code that changes!

It's similar [`micro-dev`](https://github.com/zeit/micro-dev), but compatible with any function that exposes `req, res` interface (micro, express, koa, hapi, fastify, etc)

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

**svr** is assuming you have a `main` file declared in your `package.json` in the project directory.

Also, you can provide it as first argument:

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

### Hot reloading

 whatever file modification in the project directory will be listened by **svr** automagically:

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

**svr** takes into consideration ignore non relevant files.

By default, it will be to ignore:

- well known files to ignore, like `node_modules`, `.git`, etc.
- `.gitignore` declarations.
- `ignored` field in your `package.json`.

If you need to add a specific file to ignore, use `i`  or `--ignore` flag:

```bash
$ svr -i .cache -i public
```

Also, you can use `-w` or `--watch` to add more file path to be listened. You can declare:

- Relative or absolute paths.
- Glob patterns.

## Manual reloading

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

### Production Server

**svr** is oriented just for development scenarios.

Under production, simply create the server you need based on your necessities.

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
