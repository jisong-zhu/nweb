'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
const _ = require('lodash');
const moment = require('moment');
const Path = require('path');
const File = require('fs');
const Glob = require('glob');
const merge2 = require('merge2');
let FileUtils = require('../utils/file-utils');
let ConfigUtils = require('../utils/config-utils');
let errorCounter = 0;
// 使用gulp-plumber和gulp-notify插件实现错误提示
// 1. 如果出错，编译状态不会中断，只输出编译错误；
// 2. 出错后，会在操作系统级别提示错误信息；
let errorHandler = function() {
    return $.plumber(function(err) {
        errorCounter++;
        if (errorCounter < 3) {
            $.util.log($.util.colors.cyan('Plumber') + $.util.colors.red(' found unhandled error:\n'), err.toString());
            $.notify.onError("编译出现错误，请查看命令行：<%- error.plugin %>")(err);
        }
    });
};

class JSHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tsForCommon = $.typescript.createProject(Path.join(this.$config.workDir, 'tsconfig.json'));
        this.$tasks = ['assets-js', 'global-js'];
        this.pageJSCache = {};
        gulp.task('assets-js', (cb) => {
            $.util.log($.util.colors.magenta('page-js'), 'start');
            let blob = merge2();
            blob.add(gulp.src(['*', '!*']).pipe(gulp.dest(this.$config.output.assets)));
            let pages = FileUtils.getPages(this.$config.source.jade, this.$config.page_ext);
            _.forEach(pages, page => {
                this.pipePageJS(blob, _.replace(page, this.$config.page_ext, ''));
            });
            return blob;
        });
        gulp.task('global-js', () => {
            $.util.log($.util.colors.magenta('global-js'), 'start');
            let globalJsSrc = [this.$config.source.js + '/global.js'];
            if (this.$config.global && this.$config.global.js && this.$config.global.js.length > 0) {
                globalJsSrc = FileUtils.absolutePathList(this.$config.source.js, this.$config.global.js);
            }
            return gulp.src(globalJsSrc)
                .pipe(errorHandler())
                .pipe($.if(!this.$config.isRelease, $.sourcemaps.init()))
                .pipe($.concat('global.js'))
                .pipe($.if(this.$config.doBabel, $.babel({
                    presets: ['babel-preset-es2015'].map(require.resolve)
                })))
                .pipe($.if(this.$config.isRelease, $.uglify()))
                .pipe($.if(!this.$config.isRelease, $.sourcemaps.write()))
                .pipe($.if(this.$config.isRelease, $.javascriptObfuscator({
                    sourceMap: false
                })))
                .pipe(gulp.dest(this.$config.output.js))
                .pipe($.callback(function() {
                    $.util.log($.util.colors.magenta('global-js'), 'finished');
                }));
        });
    }
    checkModified(jsPath, sourceFiles) {
        if (!this.$config.enableJSChecker) {
            return true;
        }
        let oldTime = this.pageJSCache[jsPath];
        if (!oldTime) {
            this.pageJSCache[jsPath] = moment();
            return true;
        }
        let isModified = false;

        _.forEach(sourceFiles, jsFile => {
            let files = Glob.sync(jsFile, {
                nodir: true
            });
            _.forEach(files, file => {
                if (File.existsSync(file)) {
                    let stats = File.statSync(file);
                    isModified = isModified || oldTime.isBefore(moment(stats.mtime));
                    if (isModified) {
                        this.pageJSCache[jsPath] = moment.max(this.pageJSCache[jsPath], moment(stats.mtime));
                    }
                }
            });
        });
        return isModified;
    }
    pipePageJS(blob, page) {
        let jsPath = page + '.js';
        if (!File.existsSync(Path.join(this.$config.source.js, jsPath)) && (!this.$config.page_bundles[page] || !this.$config.page_bundles[page].js)) {
            return;
        }
        let src = (this.$config.page_bundles[page] && this.$config.page_bundles[page].js) || [jsPath];
        let absoluteSrc = FileUtils.absolutePathList(this.$config.source.js, src);
        let absoluteTS = FileUtils.absolutePathList(this.$config.source.ts, this.$config.page_bundles[page].ts);
        if (!this.checkModified(jsPath, absoluteSrc) && (!this.$config.page_bundles[page].ts || !this.checkModified(jsPath, absoluteTS))) {
            return;
        }
        let stream = gulp.src(absoluteSrc)
            .pipe(errorHandler());
        if (this.$config.page_bundles[page].ts) {
            stream = gulp.src(absoluteTS)
                .pipe(errorHandler())
                // 注意，需要给ts和js分别制作sourcemap
                .pipe($.if(!this.$config.isRelease, $.sourcemaps.init()))
                .pipe(this.$tsForCommon())
                // 注意，使用了tsProject之后，一定要用".js"转为gulp的stream
                .js.pipe($.if(!this.$config.isRelease, $.sourcemaps.write()))
                .pipe($.addSrc(absoluteSrc));
        }
        blob.add(stream
            .pipe($.if(!this.$config.isRelease, $.sourcemaps.init()))
            .pipe($.concat(jsPath))
            .pipe($.if(this.$config.doBabel, $.babel({
                presets: ['babel-preset-es2015'].map(require.resolve)
            })))
            .pipe($.if(this.$config.isRelease, $.uglify()))
            .pipe($.if(!this.$config.isRelease, $.sourcemaps.write()))
            .pipe($.if(this.$config.isRelease, $.javascriptObfuscator({
                sourceMap: false
            })))
            .pipe(gulp.dest(this.$config.output.js))
            .pipe($.callback(function() {
                $.util.log($.util.colors.magenta('page-js'), 'finished', $.util.colors.magenta(jsPath));
            })));
    }
    tasks() {
        return this.$tasks;
    }
}

module.exports = new JSHandler();