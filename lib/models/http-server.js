'use strict';
const Express = require('express');
const Path = require('path');
const File = require('fs');
const _ = require('lodash');
const proxyMiddleware = require('http-proxy-middleware');

class HttpServer {
    constructor() {
        this.$server = Express();
        this.$defaultProxyOptions = {
            target: '', // target host
            changeOrigin: true, // needed for virtual hosted sites
            ws: false // proxy websockets
        };
        this.defaultPage = null;
    }
    setName(val) {
        this.name = val;
        return this;
    }
    getName() {
        return this.name;
    }
    name(val) {
        if (val === undefined) {
            return this.$name;
        } else {
            this.$name = val;
            return this;
        }
    }
    directory(dir) {
        this.htmlDir = dir;
        return this;
    }
    defaultLocation(page){
        this.defaultPage = page;
        return this;
    }
    proxy(proxies) {
        _.forEach(proxies, proxy => {
            let options = _.defaultsDeep(proxy.options, this.$defaultProxyOptions);
            let proxyServer = proxyMiddleware(proxy.path, options);
            this.$server.use(proxyServer);
        });
    }
    route(){
        this.$server.get('*', (req, res) => {
            let htmlPath = this.locateHtml(req.path);
            if (htmlPath !== null) {
                res.sendFile(htmlPath);
            } else {
                res.send(404);
            }
        });
        return this;
    }
    static(statics){
        _.forEach(statics, staticObj => {
            this.$server.use(staticObj.path, Express.static(staticObj.location));
        });
        return this;
    }
    locals(name, value){
        this.$server.locals = this.$server.locals || {};
        this.$server.locals[name] = value;
        return this;
    }
    listen(port) {
        this.port = port;
        return this;
    }
    run(cb) {
        this.$server.listen(this.port, () => {
            console.log('Listening at %s', this.port);
            cb();
        }).on('error', err => {
            console.error(err);
        });

        return this;
    }
    stop() {}
    locateHtml(urlPath) {
        if(!urlPath || urlPath === '/'){
            urlPath = 'index.html';
        }
        let candidates = [
            urlPath + ".html",
            Path.join(urlPath, "index.html"),
            urlPath,
            "404.html"
        ];
        for (let filename of candidates) {
            let filePath = Path.join(this.htmlDir, filename);
            if (File.existsSync(filePath)) {
                return filePath;
            }
        }
        if(!!this.defaultPage){
            return Path.join(this.htmlDir, this.defaultPage);
        }
        return null;
    }
}

module.exports = function() {
    return new HttpServer();
};
