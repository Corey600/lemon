/**
 * Created by Corey600 on 2016/11/22.
 */

'use strict'

const KoaRouter = require('koa-router')
const api = module.exports.api = new KoaRouter()
const web = module.exports.web = new KoaRouter()

//////////
// api routes
//////////

//noinspection JSUnresolvedFunction
/**
 * 获取安全指数检测结果
 * @url /nodeh5/api/safeGrade/detect
 * @method POST
 * @param {String} sessionId 会话ID
 */
api.post('/blog/get',  function* get(){
  //noinspection JSUnusedGlobalSymbols
  return this.body = 'get'
})


//////////
// page routes
//////////

/**
 * 主页
 * @url /nodeh5/safeGrade/index
 * @method GET
 * @param {String} sessionId 会话ID
 */
web.get('/blog/index',  function* renderIndex(){
  return yield this.render('index', {
    title: 'INDEX PAGE!'
  })
})
