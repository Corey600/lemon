/**
 * Created by Corey600 on 2016/11/22.
 */

'use strict'

const KoaRouter = require('koa-router')

const api = module.exports.api = new KoaRouter()
const web = module.exports.web = new KoaRouter()

//----------
// api routes
//----------

/**
 * 获取安全指数检测结果
 * @url /nodeh5/api/safeGrade/detect
 * @method POST
 * @param {String} sessionId 会话ID
 */
api.get('/console/get', function* get() {
  return yield (this.body = 'get')
})


//----------
// page routes
//----------

/**
 * 主页
 * @url /nodeh5/safeGrade/index
 * @method GET
 * @param {String} sessionId 会话ID
 */
web.get('/console/index', function* renderIndex() {
  return yield this.render('pages/console/index', {
    title: 'INDEX PAGE!',
    info: JSON.stringify(this, null, 4),
    username: this.passport.user.username,
    sessionId: this.sessionId,
    displayName: this.passport.user.displayName,
  })
})
