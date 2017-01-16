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

/**
 * 默认缓存时间 5mins
 * @type {Number}
 */
const DEFAULT_CACHE_MINS = 5

class StaticMap {
  constructor() {
    /**
     * 路径映射表
     * @type {Object}
     */
    this.map = {}

    /**
     * 映射表文件路径
     * @type {String}
     */
    this.filenames = ''

    /**
     * 定时器，用于定时更新缓存
     * @type {[type]}
     */
    this.timeHandle = null

    /**
     * 缓存更新时间 单位 ms/毫秒
     * @type {Number}
     */
    this.timeTag = 3000
  }

  /**
   * 初始化路径映射表
   *
   * 注：同步读文件，只允许在应用启动时调用，禁止每次请求同步读文件
   *
   * @param filenames
   * @public
   */
  init(filenames) {
    if (!_.isArray(filenames)) {
      this.filenames = [filenames]
    } else {
      this.filenames = filenames
    }

    // 清除定时器
    if (this.timeHandle) {
      clearTimeout(this.timeHandle)
    }

      // 检查文件是否存在
    this.filenames.forEach((filename) => {
      if (!fs.existsSync(filename)) {
        throw new Error('static file path map does not exist')
      }
    })

      // 同步读取文件
    this.readFilesSync(this.filenames)

      // 获取缓存时间
    this.timeTag = config.has('staticJsonCacheTime')
        ? config.get('staticJsonCacheTime')
        : DEFAULT_CACHE_MINS

      // 定时更新缓存
    this.doTick()
  }

  /**
   * 获取静态资源路径
   * @param key
   * @public
   */
  getValue(key) {
    if (this.timeTag <= 0) { // 不使用缓存
      // 同步读取文件
      this.readFilesSync(this.filenames)
    }

    // 返回映射值
    if (!this.map[key]) return null
    return this.map[key]
  }

  /**
   * 定时器执行函数
   * @private
   */
  doTick() {
    if (this.timeTag > 0) {
      this.timeHandle = setTimeout(() => {
        // 清除定时器
        if (this.timeHandle) {
          clearTimeout(this.timeHandle)
        }

        // 异步读取文件
        this.readFilesAsync(this.filenames)

        // 定时更新缓存
        this.doTick()
      }, this.timeTag * 60 * 1000)
    }
  }

  /**
   * _异步_读取文件列表中的 json 文件，并合并到 map
   * @param filenames
   * @private
   */
  readFilesAsync(filenames) {
    let mapTemp = {}
    filenames.forEach((filename) => {
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
            mapTemp = JSON.parse(data)
            Object.assign(this.map, mapTemp)
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
  readFilesSync(filenames) {
    let mapTemp = {}
    filenames.forEach((filename) => {
      if (!fs.existsSync(filename)) {
        log.warn('file [%s] dont exists!', filename)
        return
      }
      try {
        const data = fs.readFileSync(filename)
        mapTemp = JSON.parse(data)
        Object.assign(this.map, mapTemp)
      } catch (error) {
        log.warn('parse static file path map error!')
      }
      Object.assign(this.map, mapTemp)
    })
  }
}

const staticMap = module.exports = new StaticMap()

staticMap.StaticMap = StaticMap
