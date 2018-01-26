'use strict';
const Stream = require('stream');

class Logger {
    constructor() {}
    info(log) {
        let stream = new Stream.Transform({
            objectMode: true
        });
        stream._transform = function(file, unused, callback) {
            console.log(log);
            callback(null, file);
        };
        return stream;
    }
}
