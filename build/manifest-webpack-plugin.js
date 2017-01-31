/**
 * Created by Corey600 on 2016/12/21.
 */

'use strict'

const fs = require('fs')
const path = require('path')

/**
 * 用于匹配的数组常量
 * @type {Array}
 */
const MATCH = [
  {
    reg: /.js$/i,
    exts: ['jsx', 'js'],
  }, {
    reg: /.css$/i,
    exts: ['less', 'scss', 'css'],
  },
]

/**
 * webpack 生成 manifest 插件
 * @param {Sriing} filename 生成的 manifest 文件名
 * @param {Sriing} src 源文件目录
 * @param {Sriing} logger 用于打印日志
 */
function ManifestWebpackPlugin(filename, src, logger) {
  this.filename = filename
  this.src = src
  this.logger = logger
}

/**
 * 插件 apply 入口
 * @param  {Compiler} compiler [description]
 */
ManifestWebpackPlugin.prototype.apply = function apply(compiler) {
  const that = this

  //  处理资源
  compiler.plugin('emit', (compilation, callback) => {
    const src = this.src || ''
    const obj = {}
    compilation.chunks.forEach((chunk) => {
      chunk.files.forEach((file) => {
        const match = MATCH.find(item => item.reg.test(file))
        if (!match) return
        const ext = match.exts.find(
          item => fs.existsSync(path.resolve(src, `${chunk.name}.${item}`)))
        if (!ext) return
        obj[`${chunk.name}.${ext}`] = file
      })
    })

    // 写文件
    const manifestPath = path.dirname(that.filename || '')
    fs.mkdir(manifestPath, 0o755, () => {
      if (that.logger) {
        that.logger.log('[webpack] create webpack-manifest file...')
      }
      fs.writeFile(path.resolve(that.filename), JSON.stringify(obj, null, 2), (e) => {
        if (e) {
          callback(e)
        } else {
          callback()
        }
      })
    })
  })
}

/**
 * 导出插件类
 * @type {ManifestWebpackPlugin}
 */
module.exports = ManifestWebpackPlugin
