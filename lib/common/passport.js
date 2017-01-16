/**
 * Created by Corey600 on 2016/12/16.
 *
 * 设置登录认证
 *
 */

'use strict'

const passport = require('koa-passport')
const GithubStrategy = require('passport-github').Strategy

passport.use(new GithubStrategy({
  clientID: '5ee8e382b1aa8abd5bb3',
  clientSecret: 'f688d6cd0e22abe11172c571f5593d2d8880c4d0',
  callbackURL: 'http://127.0.0.1:3500/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))

passport.serializeUser((user, done) => { // 保存user对象
  done(null, user)// 可以通过数据库方式操作
})

passport.deserializeUser((user, done) => { // 删除user对象
  done(null, user)// 可以通过数据库方式操作
})

module.exports.init = function init(app) {
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports.route = function route(router) {
  // 登出
  router.get('/logout', function* logout(/* next*/) {
    this.logout()
    return yield this.redirect('/')
  })
  // 认证
  router.get('/auth/github', passport.authenticate('github', { scope: 'email' }))
  // 认证回调
  router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/console/index',
    failureRedirect: '/',
  }))
  // 检查认证
  router.use('/api/console', function* console(next) {
    if (this.isAuthenticated()) {
      return yield* next
    }
    return yield (this.body = 'auth failed')
  })
  router.use('/console', function* console(next) {
    if (this.isAuthenticated()) {
      return yield* next
    }
    return this.redirect('/')
  })
}
