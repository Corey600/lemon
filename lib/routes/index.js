/**
 * Created by Corey600 on 2016/3/28.
 *
 * routes
 *
 */

'use strict'

const log = require('../common/log').getLogger(__filename)

const config = require('config')
const KoaRouter = require('koa-router')
const apiRouter = new KoaRouter()
const webRouter = new KoaRouter()
const rootRouter = new KoaRouter()

const RET = require('../common/ret')
const CODE = require('../common/code').CODE

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
rootRouter.get('/', function* renderIndex(){
  return yield this.render('index', {
    title: 'Corey\'s Home !'
  })
})

//////////
// custom routes begin
//////////

/**
* import routes
*/
const blog = require('./blog')

/**
* use rest api routes
*/
apiRouter.use(blog.api.routes(), blog.api.allowedMethods())

/**
* use web pageroutes
*/
webRouter.use(blog.web.routes(), blog.web.allowedMethods())

//////////
// custom routes end
//////////

/**
 * 挂载到根路由
 */
rootRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods())
rootRouter.use('/', webRouter.routes(), webRouter.allowedMethods())

/**
 * 导出根路由
 */
module.exports.router = rootRouter
