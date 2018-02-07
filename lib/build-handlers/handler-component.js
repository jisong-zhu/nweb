'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
const _ = require('lodash');
const Path = require('path');
const merge2 = require('merge2');
let ConfigUtils = require('../utils/config-utils');

class ComponentHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tasks = ['package-component'];
        gulp.task('package-component', () => {
            console.log('package-component start');
            let blob = merge2();
            if(this.$config.component_bundles.img){
                this.createCopyTask(blob, this.$config.component_bundles.img, this.$config.output.img, 'images');
            }
            if(this.$config.component_bundles.fonts){
                this.createCopyTask(blob, this.$config.component_bundles.fonts, this.$config.output.fonts, 'fonts');
            }
            if(this.$config.component_bundles.css){
                this.buildLess(blob, this.$config.component_bundles.css, this.$config.output.css);
            }
            if(this.$config.component_bundles.out_js_name){
                this.buildJS(blob, this.$config.component_bundles.out_js_name, this.$config.component_bundles.js, this.$config.output.js);
            }
            return blob;
        });
    }
    tasks() {
        return this.$tasks;
    }
    createCopyTask(blob, src, dest, name) {
        console.log('Copy component ' + name + ' start!');
        blob.add(gulp.src(src)
            .pipe(gulp.dest(dest))
            .pipe($.callback(function() {
                console.log('Copy component ' + name + ' finished!');
            })));
        return this;
    }
    buildJS(blob, jsName, src, dest) {
        console.log('Build component JS start!');
        blob.add(gulp.src(src)
            .pipe($.if(!this.$config.isRelease, $.sourcemaps.init()))
            .pipe($.concat(jsName))
            .pipe($.if(this.$config.doBabel, $.babel({
                presets: ['es2015-loose']
            })))
            .pipe($.if(this.$config.isRelease, $.uglify()))
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(dest))
            .pipe($.callback(function() {
                console.log('Build component JS finished!');
            })));
        return this;
    }
    buildLess(blob, src, dest) {
        console.log('Build component css start!');
        let processors = [
            require('autoprefixer'),
        ];
        blob.add(gulp.src(src)
            .pipe($.less())
            .pipe($.postcss(processors))
            .pipe($.if(this.$config.isRelease, $.csso()))
            .pipe(gulp.dest(dest))
            .pipe($.callback(function() {
                console.log('Build component css finished!');
            })));
        return this;
    }
}
module.exports = new ComponentHandler();
