'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let ConfigUtils = require('../utils/config-utils');

class WatchHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tasks = 'watch';
        gulp.task('watch', cb => {
            // http://stackoverflow.com/questions/22391527/gulps-gulp-watch-not-triggered-for-new-or-deleted-files
            gulp.watch(this.$config.source.js + '/**/*.js', ['assets-js']);
            gulp.watch(this.$config.source.ts + '/**/*.ts', ['assets-js']);
            gulp.watch(this.$config.source.js + '/global.js', ['global-js']);
            gulp.watch(this.$config.source.img + '/**/*', ['img']);
            gulp.watch(this.$config.source.less + '/**/*.less', ['less']);
            if (this.$config.build_jade) {
                gulp.watch(this.$config.source.jade + '/**/*.jade', ['jade']);
                gulp.watch(this.$config.source.jade + '/**/*.pug', ['jade']);
            }
            gulp.watch(this.$config.source.yaml + '/**/*.yaml', ['yaml']);
            console.log('Start watching ...');
            cb();
        });
    }
    tasks() {
        return this.$tasks;
    }
}
module.exports = new WatchHandler();
