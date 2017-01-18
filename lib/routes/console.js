/**
 * Created by Corey600 on 2016/11/22.
 */

'use strict'

const log = require('../common/log').getLogger(__filename)

const config = require('config')
const KoaRouter = require('koa-router')
const github = require('../services/github')

const api = module.exports.api = new KoaRouter()
const web = module.exports.web = new KoaRouter()

const repository = config.get('github.repository')

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
 * 重定向到主页
 */
web.redirect('/console', '/console/index')

/**
 * 主页
 * @url /nodeh5/safeGrade/index
 * @method GET
 * @param {String} sessionId 会话ID
 */
web.get('/console/index', function* renderIndex() {
  // const sessionId = this.sessionId
  const user = this.passport.user
  const res = yield* github.getRepo(user.username, repository)
  log.info(res)
  return yield this.render('pages/console/index', {
    title: 'INDEX PAGE!',
    username: user.username,
    displayName: user.displayName,
    info: JSON.stringify(res.data),
  })
})
