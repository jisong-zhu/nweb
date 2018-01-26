'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let ConfigUtils = require('../utils/config-utils');

let errorCounter = 0;
class LessHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tasks = ['less'];
        gulp.task('less', () => {
            $.util.log($.util.colors.magenta('gulp-less'), 'start');
            let processors = [
                require('autoprefixer'),
            ];
            var less = $.less({compress: this.$config.isRelease});
            // less.on('error', e=> {
            //     $.util.log($.util.colors.red(e));
            //     less.end();
            // });
            let stream = gulp.src([this.$config.source.less + '/**/*.less'])
                .pipe($.filter(['**/*.less', '!**/_*.less']))
                .pipe($.filter(['**/*.less', '!**/_*.less']))
                .pipe(this.errorHandler())
                .pipe(less)
                .pipe($.postcss(processors))
                .pipe($.if(this.$config.isRelease, $.csso()))
                .pipe(gulp.dest(this.$config.output.css));
            stream.on('end', () => {
                $.util.log($.util.colors.magenta('gulp-less'), 'finished');
            });
            return stream;
        });
    }
    // 使用gulp-plumber和gulp-notify插件实现错误提示
    // 1. 如果出错，编译状态不会中断，只输出编译错误；
    // 2. 出错后，会在操作系统级别提示错误信息；
    errorHandler() {
        return $.plumber(err => {
            errorCounter++;
            if (errorCounter < 3) {
                $.util.log($.util.colors.cyan('Plumber') + $.util.colors.red(' found unhandled error:\n'), err.toString());
                $.notify.onError("编译出现错误，请查看命令行：<%- error.plugin %>")(err);
            }
        });
    }
    tasks() {
        return this.$tasks;
    }
}

module.exports = new LessHandler();
