'use strict';
const Jade = require('jade');
const Path = require('path');
const File = require('fs');

module.exports = class JadeCompiler {
    constructor() {
        this._options = {
            compileDebug: true
        };
    }
    pretty(val) {
        this._options.pretty = val;
        return this;
    }
    source(dir) {
        this._sourceDir = dir;
        return this;
    }
    target(dir) {
        this._targetDir = dir;
        return this;
    }
    param(dir) {
        return this;
    }
    compile(jadeFile) {
        let htmlFile = Path.relative(this._sourceDir, jadeFile);
        return new Promise((resolve, reject) => {
            let fn = Jade.compileFile(jadeFile, this._options);
            let htmlText = fn({});
            File.writeFile(htmlFile, htmlText, 'utf8', (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
};
