/**
 * Created by Corey600 on 2016/12/21.
 */
 
'use strict'

const path = require('path')
const webpack = require('./build/webpack')

// 常量定义
const SRC_DIR = __dirname
const DEST_DIR = path.join(SRC_DIR, 'dist')

// 获取配置
module.exports = webpack.getWebpackConfig(SRC_DIR, DEST_DIR)
