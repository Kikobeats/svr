# svr

<p align="center">
  <br>
  <img src="https://i.imgur.com/fcRbMvz.gif" alt="svr">
  <br>
</p>

![Last version](https://img.shields.io/github/tag/Kikobeats/svr.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/Kikobeats/svr/master.svg?style=flat-square)](https://travis-ci.org/Kikobeats/svr)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/svr.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/svr)
[![Dependency status](https://img.shields.io/david/Kikobeats/svr.svg?style=flat-square)](https://david-dm.org/Kikobeats/svr)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/svr.svg?style=flat-square)](https://david-dm.org/Kikobeats/svr#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/svr.svg?style=flat-square)](https://www.npmjs.org/package/svr)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> Hot Module replacement (HMR) capabilities for any HTTP Server.

It's similar [micro-dev](https://github.com/zeit/micro-dev), but out of the box for any framework that use [http.Server.listen()](https://nodejs.org/api/http.html#http_server_listen_port_hostname_backlog_callback) interface.

## Install

```bash
$ npm install svr --save-dev
```

## Usage

### Development

The only requirement is define the main file of your server as exported function that follow this interface:

```js
module.exports = (app, express) => {
/* your awesome code here */
}
```

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

After that, you need to call `svr`. We recommend add `svr` as npm script:

```json
{
  "scripts": {
    "dev": "srv"
  }
}
```

Running `npm run dev` you start your HRM development server:

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

`svr` it's assuming main file is called `index.js` in the current path. Otherwise, you can provide the file path as first argument.

Now whatever file modification in the current directory is listened by the `svr` automagically:

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

It takes in consideration your `.gitignore` files, so it only will reload the right files.

Using `svr --watch` you can add more files to be watched, but you need to reload the server in any time, just type `rs`:

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

### Production

`svr` is oriented for development scenario. 

Under production, simply create the boostraping server that you need.

For example, you can take this `server.js` as production server:

```js
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
    "start": "node server.js"
  }
}
```

That's all. You're taking the best of the two worlds: Developer Experience for development and tiny bundle for production.

## License

MIT © [Kiko Beats](https://github.com/Kikobeats).
