/**
 * Created by feichenxi on 2016/5/16.
 *
 * 读取静态文件路径映射表
 *
 */

'use strict'

const log = require('./log').getLogger(__filename)

const fs = require('fs')
const _ = require('lodash')
const config = require('config')

const DEFAULT_CACHE_MINS = 5 // 默认缓存 5mins

/**
 * 路径映射表
 * @type {{}}
 */
var _map = {}

/**
 * 映射表文件路径
 */
var _filenames

/**
 * 定时器，用于定时更新缓存
 */
var _timeOut

/**
 * 缓存更新时间
 */
var _timeTag

/**
 * 初始化路径映射表
 *
 * 注：同步读文件，只允许在应用启动时调用，禁止每次请求同步读文件
 *
 * @param filenames
 * @public
 */
module.exports.init = function (filenames) {
  if (!_.isArray(filenames)) {
    filenames = [filenames]
  }
  _filenames = filenames

  // 清除定时器
  if (_timeOut) {
    clearTimeout(_timeOut)
  }

    // 检查文件是否存在
  _filenames.forEach(function (filename) {
    if (!fs.existsSync(filename)) {
      throw new Error('static file path map does not exist')
    }
  })

    // 同步读取文件
  readFilesSync(_filenames)

    // 获取缓存时间
  _timeTag = config.has('staticJsonCacheTime')
      ? config.get('staticJsonCacheTime')
      : DEFAULT_CACHE_MINS

    // 定时更新缓存
  doTick()
}

/**
 * 获取静态资源路径
 * @param key
 * @public
 */
module.exports.getValue = function (key) {
  if (_timeTag <= 0) { // 不使用缓存
    // 同步读取文件
    readFilesSync(_filenames)
  }

  // 返回映射值
  if (!_map[key]) return null
  return _map[key]
}

/**
 * 定时器执行函数
 * @private
 */
function doTick() {
  if (_timeTag > 0) {
    _timeOut = setTimeout(function () {
      // 清除定时器
      if (_timeOut) {
        clearTimeout(_timeOut)
      }

      // 异步读取文件
      readFilesAsync(_filenames)

      // 定时更新缓存
      doTick()
    }, _timeTag * 60 * 1000)
  }
}

/**
 * _异步_读取文件列表中的 json 文件，并合并到 map
 * @param filenames
 * @private
 */
function readFilesAsync(filenames) {
  let map = {}
  filenames.forEach(function (filename) {
    fs.exists(filename, (exists) => {
      if (!exists) {
        log.warn('file [%s] dont exists!', filename)
        return
      }
      fs.readFile(filename, (err, data) => {
        if (err) {
          log.warn('async read static file path map error!')
          return
        }
        try {
          map = JSON.parse(data)
          Object.assign(_map, map)
        } catch (error) {
          log.warn('parse static file path map error!')
        }
      })
    })
  })
}

/**
 * _同步_读取文件列表中的 json 文件，并合并到 map
 * @param filenames
 * @private
 */
function readFilesSync(filenames) {
  let map = {}
  filenames.forEach(function (filename) {
    if (!fs.existsSync(filename)) {
      log.warn('file [%s] dont exists!', filename)
      return
    }
    try {
      let data = fs.readFileSync(filename)
      map = JSON.parse(data)
      Object.assign(_map, map)
    } catch (error) {
      log.warn('parse static file path map error!')
    }
    Object.assign(_map, map)
  })
}
