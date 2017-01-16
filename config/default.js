/**
 * Created by Corey600 on 2016/7/11.
 *
 * default config.
 *
 */

'use strict'

const path = require('path')

const root = process.cwd() // 进程运行当前目录

module.exports = {
  // 应用
  app: 'lemon-server',
  configPath: __filename,
  server: {
    // 运行端口，必要，无默认值
    port: 3500,
  },

  // 日志配置
  log: {
    // 默认为工作目录下 logs
    dir: path.join(root, 'logs'),

    // 默认 info
    level: 'debug',
  },

  // 调试模式，决定错误详细信息是否暴露给调用方，默认 false
  debug: true,

  // 是否开启模板缓存，默认开启 true
  templateCache: false,

  // 静态文件路径映射表缓存时间，单位分钟min，0min为不缓存
  staticMapCacheTime: 0,
}
