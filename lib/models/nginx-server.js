'use strict';
const HttpProxy = require('http-proxy');
const Express = require('express');
const Http = require('http');
const Path = require('path');
const _ = require('lodash');
const File = require('fs');

class NginxServer {
    constructor(options) {
        this.$options = options || {};
        // nginx.js的服务端口
        this.$port = options.port || 3000;
        // 静态服务器端口
        this.$staticPort = this.$port + 1;
        this.$server = Express();
        this.$proxyServer = HttpProxy.createServer();
    }
    proxy(proxyRules, defaultProxy) {
        this.$proxyRules = proxyRules;
        this.$defaultProxy = defaultProxy;
        return this;
    }
    mapProxy(url) {
        for (let rule of this.$proxyRules) {
            let reg = new RegExp(rule.exp, '');
            if (reg.test(url)) {
                return rule.target;
            }
        }
        return this.$defaultProxy;
    }
    route(rootDir) {
        this.$server.get('*', (req, res) => {
            let htmlPath = this.tryFiles(rootDir, req.path);
            if (htmlPath !== null) {
                res.sendFile(htmlPath);
            } else {
                res.send(404);
            }
        });
        return this;
    }
    static(staticDir) {
        this.$server.use(Express.static(staticDir));
        return this;
    }
    run(cb) {
        this.$server.listen(this.$staticPort, () => {
            console.log('Static Server is listening at %s', this.$staticPort);
        });
        Http.createServer((req, res, next) => {
            let target = this.mapProxy(req.url);
            console.info("proxy \"" + req.url + "\" to \"" + target + "\"");
            this.$proxyServer.web(req, res, {
                target: target
            });
        }).listen(this.$port).on('listening', () => {
            console.log('Nginx.js server is running on:', this.$port);
            cb();
        }).on('error', err => {
            console.error(err);
        });

        return this;
    }
    tryFiles(rootDir, urlPath) {
        let candidates = [
            urlPath + ".html",
            Path.join(urlPath, "index.html"),
            "404.html"
        ];
        for (let filename of candidates) {
            let filePath = Path.join(rootDir, filename);
            if (File.existsSync(filePath)) {
                return filePath;
            }
        }
        return null;
    }
}

module.exports = function(options) {
    return new NginxServer(options);
};
