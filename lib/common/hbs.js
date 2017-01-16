/**
 * Created by Corey600 on 2016/4/29.
 *
 * hbs模板配置
 *
 */

'use strict'

const _ = require('lodash')
const hbs = require('koa-hbs')
const config = require('config')
const util = require('./util')
const staticMap = require('./static-map')

/**
 * 注册helper: 读取服务器配置
 */
hbs.registerHelper('config', key => (config.has(key) ? config.get(key) : 'undefined'))

/**
 * 注册helper: 获取静态文件路径
 */
hbs.registerHelper('path', (key) => {
  let path = key
  if (_.isString(key) && key.length > 0 && key[0] === '/') {
    // 去掉'/'前缀
    path = key.substr(1, key.length - 1)
  }
  let value = staticMap.getValue(path)
  if (!value) value = path
  const server = config.has('dist.server') ? config.get('dist.server') : ''
  const prefix = config.has('dist.prefix') ? config.get('dist.prefix') : ''
  return util.urlJoin(server, prefix + value)
})

module.exports.hbs = hbs
