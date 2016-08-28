/**
 * Created by Corey600 on 2016/3/28.
 *
 * routes
 *
 */

'use strict'

const log = require('../common/log').getLogger(__filename)

const config = require('config')
const apiRouter = new (require('koa-router'))()
const webRouter = new (require('koa-router'))()
const rootRouter = new (require('koa-router'))()

const RET = require('../common/ret')
const CODE = require('../common/code').CODE

/**
 * 全局URL前缀
 * @type {string}
 */
const URL_PREFIX = 'lemon'

/**
 * 接口错误处理
 */
apiRouter.use(function* (next) {
  //log.debug('to catch api error.')
  try {
    return yield* next
  } catch (err) {
    log.error('route api error.\n', err.stack)
    //noinspection JSUnusedGlobalSymbols
    this.status = 500
    if(config.has('debug') && config.get('debug')){
      //noinspection JSUnusedGlobalSymbols
      return this.body = new RET(CODE.ERROR, err.stack)
    }else{
      //noinspection JSUnusedGlobalSymbols
      return this.body = new RET(CODE.ERROR, 'Internal Server Error')
    }
  }
})

/**
 * 页面错误处理
 */
webRouter.use(function* (next) {
  //log.debug('to catch web error.')
  try {
    return yield* next
  } catch (err) {
    log.error('route web error.\n', err.stack)
    //noinspection JSUnusedGlobalSymbols
    this.status = 500
    return yield this.render('error', {
      message: 'Internal Server Error!',
      error: (config.has('debug') && config.get('debug')) ? err : null
    })
  }
})

/**
 * 渲染主页
 */
rootRouter.get('/', renderIndex)
webRouter.get('/', renderIndex)
function* renderIndex(){
  return yield this.render('index', {
    title: 'EZVIZ HTML5 INDEX!'
  })
}

//////////
// custom routes begin
//////////

///**
// * import routes
// */
//const safeGrade = require('./safe_grade')
//
///**
// * use rest api routes
// */
//apiRouter.use(safeGrade.api.routes(), safeGrade.api.allowedMethods())
//
///**
// * use web pageroutes
// */
//webRouter.use(safeGrade.web.routes(), safeGrade.web.allowedMethods())

//////////
// custom routes end
//////////

/**
 * 挂载到根路由
 */
rootRouter.use('/' + URL_PREFIX +'/api', apiRouter.routes(), apiRouter.allowedMethods())
rootRouter.use('/' + URL_PREFIX, webRouter.routes(), webRouter.allowedMethods())

/**
 * 导出根路由
 */
module.exports.router = rootRouter
