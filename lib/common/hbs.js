/**
 * Created by Corey600 on 2016/4/29.
 *
 * hbs模板配置
 *
 */

'use strict'

const path = require('path')
const _ = require('lodash')
const hbs = require('koa-hbs')
const config = require('config')
const util = require('./util')

/**
 * 注册helper: 读取服务器配置
 */
hbs.registerHelper('config', function (key) {
  return config.has(key) ? config.get(key) : 'undefined'
})

/**
 * 注册helper: 获取静态文件路径
 */
hbs.registerHelper('path', function (key) {
  if(_.isString(key) && key.length > 0 && key[0] == '/'){
    // 去掉'/'前缀
    key = key.substr(1, key.length-1)
  }
  let value = key
  let server = config.has('dist.server') ? config.get('dist.server') : ''
  let prefix = config.has('dist.prefix') ? config.get('dist.prefix') : ''
  return util.urlJoin(server, prefix + value)
})

module.exports.hbs = hbs
