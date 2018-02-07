'use strict';
const gulp = require('gulp');
let $ = require('gulp-load-plugins')();
const _ = require('lodash');
const Path = require('path');
const merge2 = require('merge2');
let FileUtils = require('../utils/file-utils');
let ConfigUtils = require('../utils/config-utils');

class VendorHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$tasks = ['vendor-global', 'vendor-pages'];
        gulp.task('vendor-global', () => {
            $.util.log($.util.colors.magenta('vendor-global'), 'start');
            let blob = merge2();
            blob.add(gulp.src(['*', '!*']));
            let vendorJs = this.$config.vendor.js || [];
            let vendorCss = this.$config.vendor.css || [];
            if(this.$config.isRelease && this.$config.vendor.release && this.$config.vendor.release.js){
                vendorJs = _.concat(vendorJs, this.$config.vendor.release.js);
            }else if(!this.$config.isRelease && this.$config.vendor.dev && this.$config.vendor.dev.js){
                vendorJs = _.concat(vendorJs, this.$config.vendor.dev.js);
            }
            if(this.$config.isRelease && this.$config.vendor.release && this.$config.vendor.release.css){
                vendorCss = _.concat(vendorCss, this.$config.vendor.release.css);
            }else if(!this.$config.isRelease && this.$config.vendor.dev && this.$config.vendor.dev.css){
                vendorCss = _.concat(vendorCss, this.$config.vendor.dev.css);
            }
            this.pipeVendorJs(blob, vendorJs);
            this.pipeVendorCss(blob, vendorCss);
            this.copyVendorAssets(blob, this.$config.vendor.assets);
            return blob;
        });
        gulp.task('vendor-pages', () => {
            $.util.log($.util.colors.magenta('vendor-pages'), 'start');
            let blob = merge2();
            blob.add(gulp.src(['*', '!*']));
            _.forEach(this.$config.page_bundles, (page_bundle, page) => {
                if (!page_bundle.vendor) {
                    return;
                }
                let vendorJs = page_bundle.vendor.js || [];
                let vendorCss = page_bundle.vendor.css || [];
                if(this.$config.isRelease && page_bundle.vendor.release && page_bundle.vendor.release.js){
                    vendorJs = _.concat(vendorJs, page_bundle.vendor.release.js);
                }else if(!this.$config.isRelease && page_bundle.vendor.dev && page_bundle.vendor.dev.js){
                    vendorJs = _.concat(vendorJs, page_bundle.vendor.dev.js);
                }
                if(this.$config.isRelease && page_bundle.vendor.release && page_bundle.vendor.release.css){
                    vendorCss = _.concat(vendorCss, page_bundle.vendor.release.css);
                }else if(!this.$config.isRelease && page_bundle.vendor.dev && page_bundle.vendor.dev.css){
                    vendorCss = _.concat(vendorCss, page_bundle.vendor.dev.css);
                }
                this.pipeVendorJs(blob, vendorJs, page + '-vendor.js');
                this.pipeVendorCss(blob, vendorCss, page + '-vendor.css');
                this.copyVendorAssets(blob, page_bundle.vendor.assets);
            });
            return blob;
        });
    }
    pipeVendorJs(blob, src, dest) {
        dest = dest || 'vendor.js';
        if (!src) {
            $.util.log($.util.colors.magenta('vendor-global'), 'build', $.util.colors.magenta(dest));
            return;
        }
        blob.add(gulp.src(FileUtils.absolutePathList(this.$config.source.vendor, src))
            .pipe($.concat(dest))
            .pipe($.if(this.$config.isRelease, $.uglify({
                ie8: true
            })))
            .pipe(gulp.dest(this.$config.output.js))
            .pipe($.callback(function() {
                $.util.log($.util.colors.magenta('Build vendor js'), ' finished ', $.util.colors.magenta(dest));
            })));
    }
    pipeVendorCss(blob, src, dest) {
        dest = dest || 'vendor.css';
        if (!src) {
            $.util.log($.util.colors.yellow('Skip building css: ' + dest));
            return;
        }
        blob.add(gulp.src(FileUtils.absolutePathList(this.$config.source.vendor, src))
            .pipe($.concat(dest))
            .pipe($.if(this.$config.isRelease, $.cleanCss({
                keepSpecialComments: false
            })))
            .pipe(gulp.dest(this.$config.output.css))
            .pipe($.callback(function() {
                $.util.log($.util.colors.magenta('Build vendor css'), ' finished ', $.util.colors.magenta(dest));
            })));
    }
    copyVendorAssets(blob, assets) {
        _.forEach(assets || [], bundle => {
            blob.add(gulp.src(FileUtils.absolutePathList(this.$config.source.vendor, bundle.src))
                .pipe(gulp.dest(Path.join(this.$config.output.assets, bundle.dest)))
                .pipe($.callback(function() {
                    $.util.log($.util.colors.magenta('Copy vendor assets'), ' finished');
                })));
        });
    }
    tasks(cb) {
        return this.$tasks;
    }
}

module.exports = new VendorHandler();
