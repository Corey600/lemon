/**
 * Created by Corey600 on 2016/12/21.
 */

'use strict'

const path = require('path')
const glob = require('glob')
const gutil = require('gulp-util')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestWebpackPlugin = require('./manifest-webpack-plugin')

/**
 * 获取 webpack 配置
 */
module.exports.getWebpackConfig = function getWebpackConfig(src, dest) {
  let config = {
    context: src,
    entry: {},
    output: {
      path: dest,
      filename: '[name]-[chunkhash:8].js'
    },
    module: {
      loaders: [{
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          '!css-loader?sourceMap!less-loader?sourceMap'
        )
      }, {
        test: /\.(ico|png|jpeg|jpg|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 10,
          name: '/[path][name]-[hash:8].[ext]'
        }
      }]
    },
    devtool: 'source-map',
    plugins: [
      // 将公共代码抽离出来合并为一个文件
      new webpack.optimize.CommonsChunkPlugin({
        name: 'public/common/common',
        filename: 'public/common/common-[hash:8].js',
        minChunks: 3
      }),
      new webpack.optimize.OccurrenceOrderPlugin(true),
      // 将样式抽离出来作为单独的文件
      new ExtractTextPlugin('[name]-[contenthash:8].css'),
      // 输出 manifest 文件
      new ManifestWebpackPlugin(path.resolve(dest, 'manifest/manifest.json'))
    ]
  }

  // 配置页面生成和入口脚本文件
  let entry = config.entry
  let plugins = config.plugins
  let htmlfiles = glob.sync('**/*.hbs', { cwd: path.join(src, 'views', 'pages') })
  htmlfiles.forEach(function (item) {
    let basename = path.basename(item, '.hbs')
    let chunkname = 'public/pages/' + item.replace(/\.hbs/, '/' + basename)
    entry[chunkname] = './' + chunkname + '.js'
    // plugins.push(new HtmlWebpackPlugin({
    //   filename: (item == 'index.html' ? '' : 'html/') + item,
    //   template: path.join(TEMP_DIR, item),
    //   chunks: ['common', chunkname],
    //   minify: false
    // }))
  })

  return config
}

/**
 * webpack release 构建回调
 * @param  {Error}   err      [description]
 * @param  {[type]}   stats    [description]
 * @param  {Function} callback [description]
 */
module.exports.releaseCallback = function releaseCallback(err, stats, callback) {
  if (err) throw new gutil.PluginError('webpack', err)
  gutil.log('[webpack]', stats.toString('normal'))
  let jsonStats = stats.toJson()
  let wNum = jsonStats.warnings.length
  let eNum = jsonStats.errors.length
  let message = '(' + wNum + ')warnings ' + '(' + eNum + ')errors with webpack'
  if (wNum > 0) {
    message += '\n\n' + jsonStats.warnings.join('\n\n')
  }
  if (eNum > 0) {
    message += '\n\n' + jsonStats.errors.join('\n\n')
    throw new gutil.PluginError('webpack', message, { showStack: false })
  }
  gutil.log('result: ' + message)
  callback && callback()
}

/**
 * webpack debug 构建回调
 * @param  {Error}   err      [description]
 * @param  {[type]}   stats    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
module.exports.debugCallback = function debugCallback(err, stats, callback) {
  if (err) throw new gutil.PluginError('webpack', err)
  //gutil.log('[webpack]', stats.toString('minimal'))
  let jsonStats = stats.toJson()
  let message = 'Hash: ' + jsonStats.hash + ' Time: '
  message += (jsonStats.time >= 1000 ? (jsonStats.time / 1000 + 's') : (jsonStats.time + 'ms'))
  let wNum = jsonStats.warnings.length
  let eNum = jsonStats.errors.length
  message += ' (' + wNum + ')warnings ' + '(' + eNum + ')errors'
  if (wNum > 0) message += '\n\n' + jsonStats.warnings.join('\n\n')
  if (eNum > 0) message += '\n\n' + jsonStats.errors.join('\n\n')
  gutil.log('[webpack]', message)
  callback && callback()
}
