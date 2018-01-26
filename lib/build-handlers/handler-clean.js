'use strict';
const gulp = require('gulp');
const Path = require('path');
const del = require('del');
const _ = require('lodash');
let ConfigUtils = require('../utils/config-utils');

class CleanHandler {
    constructor() {
        this.$tasks = ['clean'];
        this.$config = ConfigUtils.getConfig();
        if (this.$config.clean.length === 0) {
            gulp.task('clean', (cb) => {
                return del([this.$config.output.root], cb);
            });
        } else {
            let toClean = [];
            _.forEach(this.$config.clean, (item) => {
                toClean.push(Path.join(this.$config.output.root, item));
            });
            gulp.task('clean', (cb) => {
                return del(toClean, cb);
            });
        }
    }
    tasks() {
        return this.$tasks;
    }
}

module.exports = new CleanHandler();
