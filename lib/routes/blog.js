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
 * 获取
 * @method GET
 */
api.get('/blog/get', function* get() {
  return yield (this.body = 'get')
})

//----------
// page routes
//----------

/**
 * 主页
 * @method GET
 */
web.get('/blog', function* renderIndex() {
  return yield this.render('pages/blog/index', {
    title: 'INDEX PAGE!',
  })
})

/**
 * 文章
 * @method GET
 */
web.get('/blog/post', function* renderPost() {
  return yield this.render('pages/blog/post', {
    title: 'INDEX PAGE!',
  })
})
