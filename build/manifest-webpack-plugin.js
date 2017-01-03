/**
 * Created by Corey600 on 2016/12/21.
 */
 
'use strict'

const fs = require('fs')
const path = require('path')
const gutil = require('gulp-util')
const tempPath = path.resolve(__dirname, '../public')

/**
 * webpack 生成 manifest 插件
 * @param {Sriing} filename 生成的 manifest 文件名
 */
function ManifestWebpackPlugin(filename){
  this.filename = filename
}

/**
 * 插件 apply 入口
 * @param  {Compiler} compiler [description]
 */
ManifestWebpackPlugin.prototype.apply = function(compiler){
  let that = this
  compiler.plugin('emit', function (compilation, callback) {
    var obj = {}
    var chunks = compilation.chunks
    chunks.forEach(function (item, idx) {
      var files = item.files
      for (var i = 0; i < files.length; i++) {
        if (/.js$/i.test(files[i])) {
          if (fs.existsSync(path.resolve(tempPath, item.name + '.jsx'))) {
            obj[item.name + '.jsx'] = files[i]
          } else {
            obj[item.name + '.js'] = files[i]
          }
        } else if (/.css$/i.test(files[i])) {
          if (fs.existsSync(path.resolve(tempPath, item.name + '.less'))) {
            obj[item.name + '.less'] = files[i]
          } else if (fs.existsSync(path.resolve(tempPath, item.name + '.scss'))) {
            obj[item.name + '.scss'] = files[i]
          } else {
            obj[item.name + '.css'] = files[i]
          }
        }
      }
    })
    var manifestPath = path.dirname(that.filename)
    fs.mkdir(manifestPath, 0o755, function () {
      gutil.log('create webpack-manifest file...')
      fs.writeFile(path.resolve(that.filename), JSON.stringify(obj, null, 2), function (e) {
        if (e) throw e
      })
    })

    callback()
  })
}

/**
 * 导出插件类
 * @type {ManifestWebpackPlugin}
 */
module.exports = ManifestWebpackPlugin


function FileListPlugin(options) {}

FileListPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // Create a header string for the generated file:
    var filelist = 'In this build:\n\n'

    // Loop through all compiled assets,
    // adding a new line item for each filename.
    for (var filename in compilation.assets) {
      filelist += ('- '+ filename +'\n')
    }

    // Insert this list into the Webpack build as a new file asset:
    compilation.assets['filelist.md'] = {
      source: function() {
        return filelist
      },
      size: function() {
        return filelist.length
      }
    }

    callback()
  })
}

//module.exports = FileListPlugin
