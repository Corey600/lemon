/**
 * Created by Corey600 on 2016/7/11.
 *
 * 设置日志
 *
 */

'use strict'

const path = require('path')
const util = require('util')
const log4js = require('log4js')
const config = require('config')

/**
 * 获取项目根目录
 */
var root = path.dirname(__dirname)
root = path.dirname(root)

/**
 * 获取日志保存目录
 */
var dir
if (config.has('log.dir')) {
  dir = config.get('log.dir')
} else {
  dir = path.join(root, 'logs')
}

/**
 * 配置log4js
 */
log4js.configure({
  appenders: [
    {
      type: 'console'
    },
    {
      type: 'dateFile',
      filename: path.join(dir, 'normal.log'),
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false,
      category: '[all]'
    }
  ],
  levels: {
    '[all]': config.get('log.level')
  },
  replaceConsole: true
})

/**
 * 通过category获取logger,不存在则新建一个
 * @param category
 * @returns {*}
 */
module.exports.getLogger = function (category) {
  return log4js.getLogger(category)
}

/**
 * koa日志中间件打印格式
 *
 * addr, method, url
 * HTTP/version, content-length, user-agent
 *
 */
var REQ_FORMAT = '%s - %s %s'
var INFO_FORMAT = 'HTTP/%s, %s %s'

/**
 * koa日志中间件使用的logger实例
 * @type {*}
 */
var httpLog = log4js.getLogger('http')

/**
 * koa日志中间件
 * @returns {*}
 */
module.exports.getConnect = function () {
  return function* (next) {
    var request = this.request
    var header = request.header
    var req = this.req
    var reqStr = util.format(REQ_FORMAT, request.ip, request.method, request.url)
    //noinspection JSUnresolvedVariable
    var str = util.format(INFO_FORMAT, req.httpVersion, request.length || 0, header['user-agent'])
    httpLog.debug(reqStr + ' ' + str)
    yield* next
  }
}
