'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let ConfigUtils = require('../utils/config-utils');

class YamlHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tasks = ['yaml'];
        gulp.task('yaml', () => {
            $.util.log($.util.colors.magenta('gulp-yaml'), 'start');
            let stream = gulp.src([this.$config.source.yaml + '/**/*.yaml'])
                .pipe($.filter(['**/*.yaml', '!**/_*.yaml']))
                .pipe($.yaml())
                .pipe(gulp.dest(this.$config.output.json));
            stream.on('end', () => {
                $.util.log($.util.colors.magenta('gulp-yaml'), 'finished');
            });
            return stream;
        });
    }
    tasks() {
        return this.$tasks;
    }
}

module.exports = new YamlHandler();