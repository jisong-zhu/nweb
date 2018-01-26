'use strict';

const Events = require('events');
let emitter = new Events.EventEmitter();

module.exports = emitter;
