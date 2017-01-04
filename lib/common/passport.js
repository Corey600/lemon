/**
 * Created by Corey600 on 2016/12/16.
 *
 * 设置登录认证
 *
 */

'use strict'

const passport = require('koa-passport')
const GithubStrategy = require('passport-github2').Strategy

passport.use(new GithubStrategy({
  clientID: '5ee8e382b1aa8abd5bb3',
  clientSecret: 'f688d6cd0e22abe11172c571f5593d2d8880c4d0',
  callbackURL: 'http://localhost:3500/auth/github/callback'
},function(accessToken, refreshToken, profile, done) {
  done(null, profile)
}))

passport.serializeUser(function (user, done) {//保存user对象
  done(null, user)//可以通过数据库方式操作
})

passport.deserializeUser(function (user, done) {//删除user对象
  done(null, user)//可以通过数据库方式操作
})

module.exports.init = function init(app) {
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports.route = function route(router) {
  // 登出
  router.get('/logout', function* (next) {
    this.logout()
    return this.redirect('/')
  })
  // 认证
  router.get('/auth/github', passport.authenticate('github',{ scope : 'email' }))
  // 认证回调
  router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/console/index',
    failureRedirect: '/'
  }))
  // 检查认证
  router.all('/console', function* (next) {
    if (req.isAuthenticated())
      return yield* next()
    return this.redirect('/')
  })
}
