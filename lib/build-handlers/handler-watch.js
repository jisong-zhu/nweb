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
            gulp.watch(this.$config.source.vendor + '/**/*', ['vendor-global', 'vendor-pages']);
            gulp.watch(this.$config.source.img + '/**/*', ['img']);
            gulp.watch(this.$config.source.root + '/**/*.less', ['less']);
            if (this.$config.build_page) {
                gulp.watch(this.$config.source.root + '/**/*.jade', ['jade']);
                gulp.watch(this.$config.source.root + '/**/*.pug', ['jade']);
            }
            gulp.watch(this.$config.source.yaml + '/**/*.yaml', ['yaml']);
            if (this.$config.isRelease) {
                gulp.watch(this.$config.source.staticDir + '/**/*', ['copy-static']);
            }
            gulp.watch(this.$config.source.root + '/**/*.svg', ['fonts']);
            gulp.watch(this.$config.source.root + '/**/*.otf', ['fonts']);
            gulp.watch(this.$config.source.root + '/**/*.eot', ['fonts']);
            gulp.watch(this.$config.source.root + '/**/*.ttf', ['fonts']);
            gulp.watch(this.$config.source.root + '/**/*.woff', ['fonts']);
            gulp.watch(this.$config.source.root + '/**/*.woff2', ['fonts']);
            console.log('Start watching ...');
            cb();
        });
    }
    tasks() {
        return this.$tasks;
    }
}
module.exports = new WatchHandler();