'use strict';
const File = require('fs');
const Path = require('path');
const gulp = require('gulp');
const moment = require('moment');
let $ = require('gulp-load-plugins')();
const _ = require('lodash');
const merge2 = require('merge2');
const Stream = require('stream');
let FileUtils = require('../utils/file-utils');
let ConfigUtils = require('../utils/config-utils');
let blob = merge2();
let injectTransform = require('gulp-inject').transform;
function end() {
  return injectTransform.selfClosingTag ? ' />' : '>';
}
injectTransform.html.css = function (filepath) {
  return '<link type="text/css" rel="stylesheet" href="' + filepath + '"' + end();
};

injectTransform.html.js = function (filepath) {
  return '<script type="text/javascript" src="' + filepath + '"></script>';
};

let errorCounter = 0;
class JadeHandler {
    constructor() {
        this.$config = ConfigUtils.getConfig();
        this.$defaultLocals = {
            version: this.$config.version || '1.0.0',
            timestamp: new Date().getTime(),
            nodeEnv: this.$config.isRelease ? 'production' : 'debug'
        };
        this.pageCache = {};
        this.$tasks = ['jade'];
        gulp.task('jade', () => {
            $.util.log($.util.colors.magenta('gulp-jade'), 'start');
            let blob = merge2();
            let pages = FileUtils.getPages(this.$config.source.jade, this.$config.page_ext);
            let isMixinChanged = this.checkModified(Path.join(this.$config.source.jade, '_mixin' + this.$config.page_ext));
            let isLayoutChanged = this.checkModified(Path.join(this.$config.source.jade, '_layout' + this.$config.page_ext));
            _.forEach(pages, page => {
                let isModified = this.checkModified(Path.join(this.$config.source.jade, page));
                if (isModified ||
                    isMixinChanged ||
                    isLayoutChanged) {
                    this.pipeJade(blob, page);
                }
            });
            return blob;
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
    checkModified(page) {
        if (!this.$config.enablePageChecker) {
            return true;
        }
        let isModified = true;
        let oldTime = this.pageCache[page];
        if (!oldTime) {
            this.pageCache[page] = moment();
            return true;
        }
        if (File.existsSync(page)) {
            let stats = File.statSync(page);
            isModified = oldTime.isBefore(moment(stats.mtime));
            if (isModified) {
                this.pageCache[page] = moment(stats.mtime);
            }
            return isModified;
        } else {
            return false;
        }
    }
    pipeJade(blob, jadeFile) {
        let extname = Path.extname(jadeFile);
        let pageKey = _.replace(jadeFile, extname, '');

        let locals = this.loadLocals(this.$config.page_bundles[pageKey] && this.$config.page_bundles[pageKey].locals);
        locals = _.defaultsDeep(locals, this.$defaultLocals);
        let render = null;
        let options = {
            pretty: this.$config.isRelease,
            locals: locals
        };
        if (extname === '.pug') {
            render = $.pug(options);
        } else {
            render = $.jade(options);
        }
        // render.on('error', e => {
        //     $.util.log($.util.colors.red(e.stack));
        //     render.end();
        // });
        blob.add(gulp.src([Path.join(this.$config.source.jade, jadeFile)])
            .pipe(this.errorHandler())
            .pipe(render)
            .pipe($.inject(gulp.src(this.createInjectors(pageKey), {
                cwd: this.$config.output.root,
                read: false
            }), {
                addSuffix: `?v=${this.$config.version}`
            }))
            .pipe($.if(this.$config.isRelease, $.htmlmin({
                collapseWhitespace: true
            })))
            .pipe(gulp.dest(Path.join(this.$config.output.html, Path.dirname(jadeFile))))
            .pipe($.callback(function() {
                $.util.log($.util.colors.magenta('gulp-jade'), 'finished', $.util.colors.magenta(pageKey + extname));
            })));
    }
    createInjectors(pageKey) {
        let bundle = _.defaultsDeep(this.$config.page_bundles[pageKey] || {}, {
            useGlobalVendor: true
        });
        let injectors = [];
        if (bundle.useGlobalVendor) {
            injectors = _.concat(injectors, this.getGlobalInjectors());
        }
        if (bundle.vendor) {
            injectors = _.concat(injectors, [`${this.$config.assets_dir}/css/${pageKey}-vendor.css`, `${this.$config.assets_dir}/js/${pageKey}-vendor.js`]);
        }
        injectors = _.concat(injectors, [`${this.$config.assets_dir}/css/${pageKey}.css`, `${this.$config.assets_dir}/js/${pageKey}.js`]);
        return injectors;
    }
    getGlobalInjectors() {
        return [`${this.$config.assets_dir}/css/vendor.css`, `${this.$config.assets_dir}/js/vendor.js`, `${this.$config.assets_dir}/css/global.css`, `${this.$config.assets_dir}/js/global.js`];
    }
    loadLocals(param) {
        var locals;
        if (_.isFunction(param)) {
            locals = param();
        } else if (_.isObject(param)) {
            locals = param;
        } else {
            locals = {};
        }
        locals.version = this.$config.version;
        return _.assign(locals, this.$defaultLocals);
    }
    tasks() {
        return this.$tasks;
    }
}
module.exports = new JadeHandler();