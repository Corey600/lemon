/**
 * Created by Corey600 on 16/4/15.
 *
 * config for production.
 * to take effect when $NODE_ENV=production.
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
    port: 3500
  }
}
