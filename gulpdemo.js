/**
 * Created by feichenxi on 2016/8/17.
 */

'use strict';

const path = require('path');
const util = require('util');
const Gulp = require('gulp').Gulp;
const gutil = require('gulp-util');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const hb = require('gulp-hb');
const Handlebars = require('handlebars');
const layouts = require('handlebars-layouts');
const helpers = require('handlebars-helpers');
const webpack = require('webpack');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');
const ftp = require('vinyl-ftp');
const program = require('commander');

// 常量定义
const SRC_DIR = __dirname;
const OUT_DIR = path.join(path.dirname(__dirname), 'out');
const DEST_DIR = path.join(OUT_DIR, 'dist');
const TEMP_DIR = path.join(OUT_DIR, 'temp', 'src');

// 创建 Gulp 实例
const gulp = module.exports = new Gulp();
gulp.name = 'pc';

// 获取语言文件路径
const languages = {};
(function () {
    let langs = require(path.join(SRC_DIR, './build/lang.js'));
    for(let key in langs){
        if(langs.hasOwnProperty(key)){
            let lang = langs[key];
            for(let prop in lang){
                if(lang.hasOwnProperty(prop)){
                    if(!languages[prop]) languages[prop] = {};
                    languages[prop][key] = lang[prop];
                }
            }
        }
    }
}());

// 获取设备配置文件路径
function getDevConfig() {
    //noinspection JSUnresolvedVariable
    return path.join(SRC_DIR, './build/config/' + program.type + '.js');
}

// 编译模板
gulp.task('hbs', function () {
    //noinspection JSUnresolvedVariable
    var language = languages[program.lang];
    //noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols,JSUnresolvedVariable
    var hbStream = hb()
        .partials('src/public/modules/**/*.hbs')
        .partials('src/views/partials/**/*.hbs')
        .helpers(helpers())
        .helpers(layouts)
        .helpers({
            __: function (key) {
                var args = Array.prototype.slice.call(arguments, 0);
                args.pop(); // 去掉最后一个信息参数
                let value = language[key];
                if(value){
                    args[0] = value;
                }else{
                    gutil.log('Key['+key+'] can not be translated.');
                    args[0] = key;
                }
                //noinspection JSUnresolvedFunction
                return new Handlebars.SafeString(util.format.apply(null, args));
            }
        })
        .data({
            language: program.lang,
            devConfig: require(getDevConfig())
        });

    return gulp.src([
        'views/pages/**/*.hbs'
    ], {cwd: SRC_DIR})
        .pipe(hbStream)
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(TEMP_DIR));
});

// ES 语法检查
gulp.task('lint', function () {
    return gulp.src([
        'build/**/*.js',
        '!build/timezone.js',
        'public/**/*.js',
        '!public/lib/**/*.js',
        '.eslintrc.js',
        'gulpfile.js'
    ], {cwd: SRC_DIR})
        .pipe(eslint(require('./.eslintrc.js')))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// 拷贝 favicon.ico
gulp.task('favicon', function () {
    return gulp.src([
        'public/favicon.ico'
    ], {cwd: SRC_DIR})
        .pipe(gulp.dest(DEST_DIR));
});

// 获取webpack配置
function getWebpackConfig(isDebug) {
    //noinspection JSUnresolvedFunction,JSUnresolvedVariable
    let config = {
        context: SRC_DIR,
        entry: {},
        output: {
            path: DEST_DIR,
            filename: '[name]-[chunkhash:8].js'
        },
        module: {
            loaders: [{
                test: /\.(css|less)$/,
                loader: ExtractTextPlugin.extract('style-loader', '!css-loader?sourceMap!less-loader?sourceMap')
            }, {
                test: /\.(ico|png|jpeg|jpg|gif|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 10,
                    name: '/[path][name]-[hash:8].[ext]'
                }
            }]
        },
        resolve: {
            alias: {
                'jquery': path.join(__dirname, 'public/common/js/jquery-export.js'),
                'jquery-dist': path.join(__dirname, '../node_modules/jquery/jquery.min.js'),
                'underscore': path.join(__dirname, '../node_modules/underscore/underscore-min.js'),

                // 用于配置不同设备
                'devConfig': getDevConfig()
            }
        },
        devtool: 'source-map',
        plugins: [
            // 将公共代码抽离出来合并为一个文件
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                filename: 'public/common/common-[hash:8].js',
                minChunks: 3
            }),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            // 将样式抽离出来作为单独的文件
            new ExtractTextPlugin('[name]-[contenthash:8].css'),
            // 国际化翻译
            new I18nPlugin(languages[program.lang]),
            new webpack.DefinePlugin({
                LANGUAGE: JSON.stringify(program.lang)
            })
        ]
    };

    // 配置页面生成和入口脚本文件
    let entry = config.entry;
    let plugins = config.plugins;
    let htmlfiles = glob.sync('**/*.html', {cwd: TEMP_DIR});
    htmlfiles.forEach(function (item) {
        // 非debug时，demo不构建
        if(!isDebug && /^demo/.test(item)) return;
        let basename = path.basename(item, '.html');
        let chunkname = 'public/pages/' + item.replace(/\.html/, '/' + basename);
        entry[chunkname] = './' + chunkname + '.js';
        plugins.push(new HtmlWebpackPlugin({
            filename: (item == 'index.html' ? '' : 'html/') + item,
            template: path.join(TEMP_DIR, item),
            chunks: ['common', chunkname],
            minify: false
        }));
    });

    return config;
}

//////////
// release
//////////

// webpack 打包
gulp.task('webpack-release', ['lint', 'favicon', 'hbs'], function (callback) {
    var config = getWebpackConfig(false);

    // js文件的压缩
    //noinspection JSUnresolvedFunction
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        mangle: {
            except: ['$', 'm', 'window', 'webpackJsonpCallback']
        }
    }));

    // 执行 webpack
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString('normal'));
        let jsonStats = stats.toJson();
        let wNum = jsonStats.warnings.length;
        let eNum = jsonStats.errors.length;
        let message = '(' + wNum + ')warnings ' + '(' + eNum + ')errors with webpack';
        if (wNum > 0) {
            message += '\n\n' + jsonStats.warnings.join('\n\n');
        }
        if (eNum > 0) {
            message += '\n\n' + jsonStats.errors.join('\n\n');
            throw new gutil.PluginError('webpack', message, {showStack: false});
        }
        gutil.log('result: ' + message);
        callback();
    });
});

// release 任务
gulp.task('release', ['webpack-release']);

//////////
// debug
//////////

// webpack 打包
gulp.task('webpack-debug', ['lint', 'favicon', 'hbs'], function () {
    var config = getWebpackConfig(true);
    config.watch = true;

    // 远程部署
    // let conn = ftp.create({
    //     host: '192.168.7.7',
    //     user: 'vagrant',
    //     password: 'vagrant',
    //     log: gutil.log,
    //     // debug: function () {
    //     //     let args = Array.prototype.slice.call(arguments, 0);
    //     //     gutil.log(args);
    //     // },
    //     parallel: 10
    // });

    // 执行 webpack
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        //gutil.log('[webpack]', stats.toString('minimal'));
        let jsonStats = stats.toJson();
        let message = 'Hash: ' + jsonStats.hash + ' Time: ';
        message += (jsonStats.time >= 1000 ? (jsonStats.time / 1000 + 's') : (jsonStats.time + 'ms'));
        let wNum = jsonStats.warnings.length;
        let eNum = jsonStats.errors.length;
        message += ' (' + wNum + ')warnings ' + '(' + eNum + ')errors';
        if (wNum > 0) message += '\n\n' + jsonStats.warnings.join('\n\n');
        if (eNum > 0) message += '\n\n' + jsonStats.errors.join('\n\n');
        gutil.log('[webpack]', message);

        // gutil.log('[deploy] Starting...');
        // gulp.src([
        //     DEST_DIR + '/**'
        // ], {buffer: false})
        //     .pipe(conn.newer('/html'))
        //     .pipe(conn.dest('/html'))
        //     .on('end', function () {
        //         gutil.log('[deploy] Finished.');
        //         gutil.log('[webpack] Watching...');
        //     })
        //     .on('error', function () {
        //         gutil.log('[deploy] Error.');
        //         gutil.log('[webpack] Watching...');
        //     });
    });
});

// debug 任务
gulp.task('debug', ['webpack-debug'], function () {
    gulp.watch([
        'views/pages/**/*.hbs',
        'public/modules/**/*.hbs'
    ], {cwd: SRC_DIR}, ['hbs']);
});
