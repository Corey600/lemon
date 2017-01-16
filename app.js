/**
 * Created by Corey600 on 2016/7/11.
 *
 * environment variable:
 * the port: $PORT=3500
 * the config dir: $NODE_CONFIG_DIR=./config
 *
 */

'use strict'

// require core modules
const path = require('path')

// require thirdpart modules
const config = require('config')
const Koa = require('koa')
const sta = require('koa-static')
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const session = require('koa-generic-session')

// require custom modules
const hbs = require('./lib/common/hbs').hbs
const log = require('./lib/common/log')
const staticMap = require('./lib/common/static-map')
const passport = require('./lib/common/passport')

const app = new Koa()
const logger = log.getLogger(__filename)

const staticPath = path.join(__dirname, 'dist')
const viewPath = path.join(__dirname, 'views')

// set app name
app.name = config.has('app') ? config.get('app') : 'server'

// global middlewares
app.use(sta(staticPath, {
  maxage: 100 * 365 * 24 * 60 * 60,
}))
app.use(log.getConnect())
app.use(hbs.middleware({
  viewPath,
  partialsPath: path.join(viewPath, 'partials'),
  layoutsPath: path.join(viewPath, 'layouts'),
  disableCache: config.has('templateCache') ? (!config.get('templateCache')) : false,
  defaultLayout: null,
}))
app.use(json(null))
app.use(bodyparser({
  onerror: function onerror(err, ctx) {
    // HTTP Error: 422 Unprocessable Entity
    ctx.throw('body parse error', 422)
  },
}))

// Sessions
app.keys = ['secret']
app.use(session())

// Initialize static file path map
staticMap.init([
  path.join(staticPath, 'manifest/manifest.json'),
])

// Init passport
passport.init(app)

// mount root routes
const router = require('./lib/routes').router

app.use(router.routes())

// Not Found 404
app.use(function* pageNotFound() {
  this.status = 404
  if (this.request.method.toUpperCase() === 'GET') {
    return yield this.render('404')
  }
  return yield (this.body = 'Not Found')
})

// error
app.on('error', (err, ctx) => {
  logger.error('server error.\n', err.stack, '\ncontext: ', JSON.stringify(ctx))
})

module.exports.app = app
