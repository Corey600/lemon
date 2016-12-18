/**
 * Created by Corey600 on 2016/12/16.
 *
 * 设置登录认证
 *
 */

'use strict'

const passport = require('passport')
const GithubStrategy = require('passport-github').Strategy

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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next()

  res.redirect('/')
}

modules.exports.init = function init(app) {
  app.get('/', routes.index)
  app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/')
  })
  
  app.all('/github', isLoggedIn)
  app.get('/github',user.github)
  app.get('/auth/github', passport.authenticate('github',{ scope : 'email' }))
  app.get('/auth/github/callback',
    passport.authenticate('github',{
      successRedirect: '/github',
      failureRedirect: '/'
    }))
}
