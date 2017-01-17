/**
 * Created by jizaiyi on 2016/5/20.
 */

'use strict'

const log = require('./log').getLogger(__filename)

const Redis = require('ioredis')
const config = require('config')

/**
 * 可能没有被捕获的错误
 */
Redis.Promise.onPossiblyUnhandledRejection((error) => {
  // you can log the error here.
  // error.command.name is the command name, here is 'set'
  // error.command.args is the command arguments, here is ['foo']
  log.error('UnhandledRejection: name[%s] args[%s]',
    error.command.name, JSON.stringify(error.command.args))
  log.debug(JSON.stringify(error))
})

const redis = new Redis({
  host: config.get('redis.host'),
  port: config.get('redis.port'),
  dropBufferSupport: true,
})

//----------
// 事件打印
//----------

redis.on('connect', () => {
  log.info('Redis connect...')
})

redis.on('ready', () => {
  log.info('Redis connect is ready.')
})

redis.on('close', () => {
  log.info('Redis connect is close.')
})

redis.on('end', () => {
  log.info('Redis connect end.')
})

redis.on('reconnecting', () => {
  log.info('Redis reconnecting...')
})

redis.on('error', (error) => {
  log.error('Redis connect error!', error)
})

module.exports = redis
