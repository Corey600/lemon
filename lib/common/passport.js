/**
 * Created by Corey600 on 2016/12/16.
 *
 * 设置登录认证
 *
 */

'use strict'

const log = require('./log').getLogger(__filename)

const config = require('config')
const passport = require('koa-passport')
const GithubStrategy = require('passport-github').Strategy

const redis = require('./redis')

const superUser = config.get('superUser')

passport.use(new GithubStrategy({
  clientID: config.get('github.clientID'),
  clientSecret: config.get('github.clientSecret'),
  callbackURL: config.get('github.callbackURL'),
}, (accessToken, refreshToken, profile, done) => {
  // log.info(accessToken, refreshToken, profile)
  redis.set(`koa:accessToken:${profile.username}`, accessToken)
  done(null, profile)
}))

// 保存user对象
passport.serializeUser((user, done) => {
  // 可以通过数据库方式操作
  done(null, user)
})

// 删除user对象
passport.deserializeUser((user, done) => {
  // 可以通过数据库方式操作
  done(null, user)
})

module.exports.init = function init(app) {
  log.info('init passport...')
  app.use(passport.initialize())
  app.use(passport.session())
}

module.exports.route = function route(router) {
  // 登出
  router.get('/logout', function* logout(next) {
    yield* next
    this.logout()
    return this.redirect('/blog')
  })
  // 认证
  router.get('/auth/github', passport.authenticate('github', { scope: 'email' }))
  // 认证回调
  router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/console',
    failureRedirect: '/blog',
  }))
  // 检查认证
  router.use('/api/console', function* console(next) {
    if (this.isAuthenticated()) {
      if (superUser[this.passport.user.username]
        === this.passport.user.emails[0].value) {
        return yield* next
      }
      this.status = 403
      return yield (this.body = 'Forbidden')
    }
    this.status = 401
    return yield (this.body = 'Unauthorized')
  })
  router.use('/console', function* console(next) {
    if (this.isAuthenticated()) {
      if (superUser[this.passport.user.username]
        === this.passport.user.emails[0].value) {
        return yield* next
      }
    }
    return this.redirect('/blog')
  })
}
