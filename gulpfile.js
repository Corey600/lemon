/**
 * Created by Corey600 on 2016/4/15.
 */

'use strict'

const path = require('path')
const del = require('del')
const gulp = require('gulp')
const eslint = require('gulp-eslint')
const webpack = require('webpack')
const webpackUtils = require('./build/webpack')

// 常量定义
const SRC_DIR = __dirname
const DEST_DIR = path.join(SRC_DIR, 'dist')

/**
 * 清理构建目标目录
 * @type {task}
 */
gulp.task('clean', () => {
  return del([DEST_DIR + '/*'])
})

/**
 * 语法检查
 * @type {task}
 */
gulp.task('eslint', () => {
  return gulp.src([
    '**/*.js',
    '!dist/**',
    '!node_modules/**'
  ], { cwd: SRC_DIR })
    .pipe(eslint('./.eslintrc.js'))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/**
 * 拷贝 favicon.ico
 * @type {task}
 */
gulp.task('favicon', ['clean'], function () {
  return gulp.src([
    'public/favicon.ico'
  ], { cwd: SRC_DIR })
    .pipe(gulp.dest(path.join(DEST_DIR, 'public')))
})

/**
 * webpack release 打包
 * @type {task}
 */
gulp.task('release', ['clean', 'eslint', 'favicon'], function (done) {
  var callback = done
  var config = webpackUtils.getWebpackConfig(SRC_DIR, DEST_DIR)

  // js文件的压缩
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    mangle: {
      except: ['$', 'm', 'window', 'webpackJsonpCallback']
    }
  }))

  // 执行 webpack
  webpack(config, function (err, stats) {
    webpackUtils.releaseCallback(err, stats, callback)
    callback = null
  })
})

/**
 * webpack debug 打包
 * @type {task}
 */
gulp.task('debug', ['clean', 'eslint', 'favicon'], function (done) {
  var callback = done
  var config = webpackUtils.getWebpackConfig(SRC_DIR, DEST_DIR)
  
  // 开启监听
  config.watch = true

  // 执行 webpack
  webpack(config, function (err, stats) {
    webpackUtils.debugCallback(err, stats, callback)
    callback = null
  })
})

/**
 * 默认任务
 * @type {task}
 */
gulp.task('default', ['release'])
