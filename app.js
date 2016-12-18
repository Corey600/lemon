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

// require custom modules
const hbs = require('./lib/common/hbs').hbs
const log = require('./lib/common/log')
const passport = require('./lib/common/passport')

var app = new Koa()
var logger = log.getLogger(__filename)

var staticPath = path.join(__dirname, 'dist')
var viewPath = path.join(__dirname, 'views')

// set app name
app.name = config.has('app') ? config.get('app') : 'server'

// global middlewares
//noinspection JSCheckFunctionSignatures
app.use(sta(staticPath, {
  maxage: 100 * 365 * 24 * 60 * 60
}))
app.use(log.getConnect())
app.use(hbs.middleware({
  viewPath: viewPath,
  partialsPath: path.join(viewPath, 'partials'),
  layoutsPath: path.join(viewPath, 'layouts'),
  disableCache: config.has('templateCache') ? (!config.get('templateCache')) : false,
  defaultLayout: null
}))
app.use(json(null))
//noinspection JSUnusedGlobalSymbols
app.use(bodyparser({
  onerror: function (err, ctx) {
    // HTTP Error: 422 Unprocessable Entity
    ctx.throw('body parse error', 422)
  }
}))

// init passport
passport.init(app)

// mount root routes
var router = require('./lib/routes').router
app.use(router.routes())

// Not Found 404
app.use(function* pageNotFound() {
  //noinspection JSUnusedGlobalSymbols
  this.status = 404
  if(this.request.method.toUpperCase() == 'GET'){
    return yield this.render('404')
  }else{
    //noinspection JSUnusedGlobalSymbols
    return this.body = 'Not Found'
  }
})

// error
//noinspection JSUnresolvedFunction
app.on('error', function(err, ctx){
  logger.error('server error.\n', err.stack, '\ncontext: ', JSON.stringify(ctx))
})

module.exports.app = app
