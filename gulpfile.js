/**
 * Created by feichenxi on 2016/4/15.
 */

'use strict'

const path = require('path')
const del = require('del')
// var named = require('vinyl-named')
// var webpack = require('webpack')
// var webpackStream = require('webpack-stream')
const gulp = require('gulp')
const eslint = require('gulp-eslint')

/**
 * 静态资源目录前缀
 * @type {string}
 */
var prefix = '/nodeh5/'

/**
 * 资源构建目标目录
 * @type {string}
 */
var dest = path.join('dist', prefix)

/**
 * 图片(及其他资源)后缀名列表
 * @type {string}
 */
var imgExt = '(ico|png|jpeg|jpg|gif|svg)'

/**
 * 清理构建目标目录
 */
gulp.task('clean', function () {
  del(['dist/*'])
})

/**
 * 语法检查
 */
gulp.task('lint', () => {
  return gulp.src(['**/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

/**
 * 默认任务
 */
gulp.task('default', ['clean', 'lint'], function () {
  //gulp.start(['less', 'js', 'webpack'])
})

/**
 * 监听任务
 */
// gulp.task('watch', ['default'], function () {
//     gulp.watch(['public/**/*.+' + imgExt], ['less', 'webpack'])
//     gulp.watch(['public/**/*.less'], ['less'])
//     gulp.watch(['public/**/*.js'], ['js', 'webpack'])
// })
