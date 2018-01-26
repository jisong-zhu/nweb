'use strict';
const proxyMiddleware = require('http-proxy-middleware');

class HttpProxy {
    constructor(server){
        this.$server = server;
    }
    proxy(path, options){
        let proxy = proxyMiddleware(path, options);
        this.$server.use(proxy);
    }
}
