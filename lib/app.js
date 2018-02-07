'use strict';
const File = require('fs');
const gulp = require('gulp');
const _ = require('lodash');
const $ = require('gulp-load-plugins')();
const HttpServer = require('./models/http-server');
const NginxServer = require('./models/nginx-server');

// read config
let ConfigUtils = require('./utils/config-utils');

class Application {
    constructor() {
        this.$config = ConfigUtils.getConfig();
    }
    initComponents() {
        this.$clean = require('./build-handlers/handler-clean');
        this.$copy = require('./build-handlers/handler-copy');
        this.$js = require('./build-handlers/handler-js');
        this.$jade = require('./build-handlers/handler-jade');
        this.$less = require('./build-handlers/handler-less');
        this.$yaml = require('./build-handlers/handler-yaml');
        this.$vendor = require('./build-handlers/handler-vendor');
        this.$watch = require('./build-handlers/handler-watch');
        this.$component = require('./build-handlers/handler-component');
        gulp.task('server', cb => {
            let httpServer = new HttpServer();
            if (this.$config.server.proxy) {
                httpServer.proxy(this.$config.server.proxy);
            }
            this.$config.server.static = this.$config.server.static || [];
            if (File.existsSync(this.$config.source.staticDir)) {
                this.$config.server.static.push({
                    path: `/`,
                    location: this.$config.isRelease ? this.$config.output.staticDir : this.$config.source.staticDir
                });
            }
            this.$config.server.static.push({
                path: `/${this.$config.assets_dir}`,
                location: this.$config.output.assets
            });
            httpServer.static(this.$config.server.static);
            httpServer.locals('nodeEnv', this.$config.isRelease ? 'production' : 'debug');
            httpServer.directory(this.$config.output.root)
                .defaultLocation(this.$config.server.default_page)
                .route()
                .listen(this.$config.server.port)
                .run(() => {
                    require("openurl").open(`http://${require('ip').address()}:${this.$config.server.port}/`);
                    cb();
                });
        });
        gulp.task('nginx-server', cb => {
            let nginxServer = new NginxServer({
                port: this.$config.server.port
            });
            if (this.$config.server.nginx) {
                nginxServer.proxy(this.$config.server.nginx, this.$config.server.default_proxy);
            }
            nginxServer.static(this.$config.output.root)
                .run(() => {
                    require("openurl").open(`http://${require('ip').address()}:${this.$config.server.port}/`);
                    cb();
                });
        });
        let buildTasks = _.concat(this.$less.tasks(), this.$js.tasks());
        gulp.task('default', $.sequence(this.$clean.tasks(), this.$copy.tasks(), this.$yaml.tasks(), this.$vendor.tasks(), buildTasks, this.$jade.tasks(), 'server', this.$watch.tasks()));
        gulp.task('nginx', $.sequence(this.$clean.tasks(), this.$copy.tasks(), this.$yaml.tasks(), this.$vendor.tasks(), buildTasks, 'nginx-server', this.$watch.tasks()));
        gulp.task('build-component', $.sequence(this.$clean.tasks(), this.$component.tasks()));
        return this;
    }
    debug() {
        this.$config.isRelease = false;
        this.$config.doBabel = false;
        return this;
    }
    babelDebug() {
        this.$config.isRelease = false;
        this.$config.doBabel = true;
        return this;
    }
    babelRelease() {
        this.$config.isRelease = true;
        this.$config.doBabel = true;
        return this;
    }
    release() {
        this.$config.isRelease = true;
        return this;
    }
    run() {
        gulp.start('default');
    }
    startNginx() {
        gulp.start('nginx');
    }
    static() {
        this.$config.isRelease = true;
        let httpServer = new HttpServer();
        if (this.$config.server.proxy) {
            httpServer.proxy(this.$config.server.proxy);
        }
        httpServer.directory(this.$config.output.root).static(this.$config.server.static).route().listen(this.$config.server.port).run(function () {});
        return this;
    }
    enc() {
        let FileEnc = require('./utils/file-enc');
        let fileEnc = new FileEnc();
        fileEnc.addFiles(this.$config.enc || []).enc();
        return this;
    }
    component() {
        gulp.start('build-component');
        return this;
    }
}

let app = new Application();
module.exports = app;