/* eslint-disable unicorn/no-process-exit */
const util = require('util')
const fs = require('fs')
const url = require('url')
const chalk = require('chalk')
const notifier = require('node-notifier')
const co = require('co')
const stripAnsi = require('strip-ansi')
const tildify = require('tildify')
const merge = require('lodash/merge')
const chokidar = require('chokidar')
const opn = require('opn')
const AppError = require('../lib/app-error')
const {
  cwd,
    ownDir,
    unspecifiedAddress,
    readPkg,
    deleteCache,
    arrify,
    localRequire
} = require('../lib/utils')
const poi = require('../lib')
const logger = require('../lib/logger')

module.exports = function (cliOptions) {
}

module.exports.handleError = handleError

function handleError(err) {
    console.log();
    if (err.name === 'AppError') {
        console.error(chalk.red(err.message));
    } else {
        console.error(err.stack.trim());
    }
    $.notify.onError(stripAnsi(err.stack).replace(/^\s+/gm, ''))(err);
    console.log();
    logger.error('Failed to start!');
    console.log();
    process.exit(1);
}