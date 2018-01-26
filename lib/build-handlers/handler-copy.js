'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
const _ = require('lodash');
const Path = require('path');
const Stream = require('stream');
let ConfigUtils = require('../utils/config-utils');
let Logger = require('../utils/logger');

class CopyHandler {
    constructor() {
        let config = ConfigUtils.getConfig();
        this.$tasks = [];
        this.createCopyTask('img', [config.source.img + '/**/*'], config.output.img);
        _.forEach(config.components, component => {
            this.createCopyTask(`component-${component}`, [Path.join(config.source.root, component) + '/**/*'], config.output.root);
        });
        this.createCopyFonts('fonts', [config.source.root + '/**/*'], config.output.fonts, ['**/*.svg', '**/*.otf', '**/*.eot', '**/*.ttf', '**/*.woff', '**/*.woff2']);
    }
    tasks() {
        return this.$tasks;
    }
    gulpCallback(cb) {
        let stream = new Stream.Transform({
            objectMode: true
        });
        stream._transform = function(file, unused, callback) {
            cb();
            callback(null, file);
        };
        return stream;
    }
    createCopyTask(name, src, dest, filter) {
        this.$tasks.push(name);
        filter = filter || ['**/*'];
        gulp.task(name, () => {
            return gulp.src(src)
                .pipe($.filter(filter))
                .pipe(gulp.dest(dest));
        });
    }
    createCopyFonts(name, src, dest, filter) {
        this.$tasks.push(name);
        filter = filter || ['**/*'];
        gulp.task(name, () => {
            return gulp.src(src)
                .pipe($.filter(filter))
                .pipe($.flatten())
                .pipe(gulp.dest(dest));
        });
    }
}
module.exports = new CopyHandler();
