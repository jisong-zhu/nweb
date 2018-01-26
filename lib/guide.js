'use strict';
const Path = require('path');
const File = require('fs');

class Example {
    constructor() {
        console.log(123);
    }
    show() {
        console.log('It\'s me');
        console.log(this);
    }
}

module.exports = function(param1, param2) {
    return new Example();
};

// const example = require('./example.js')();
// const Example = require('./example.js');
// let example = new Example();
