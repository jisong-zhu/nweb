'use strict';
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const $ = require('gulp-load-plugins')();
const logger = require('../lib/utils/logger');
const ConfigUtils = require('../lib/utils/config-utils');
const Package = require('../package.json');
const runner = module.exports = {};

runner.start = (options) => {
    ConfigUtils.readConfig(__dirname, process.cwd(), options);

    console.log('nweb当前版本：', $.util.colors.green(Package.version));

    let $config = ConfigUtils.getConfig();
    console.log('项目当前版本：', $.util.colors.green($config.version));
    // 注意：这个APP必须在这个地方require，否则取不到config的值
    let app = require('../lib/app');
    switch (options.mode) {
        case 'debug':
            app.debug()
                .initComponents()
                .run();
            break;
        case 'release':
            app.release()
                .initComponents()
                .run();
            break;
        case 'babel':
            app.babelDebug()
                .initComponents()
                .run();
            break;
        case 'babel-release':
            app.babelRelease()
                .initComponents()
                .run();
            break;
        case 'static':
            app.static();
            break;
        case 'enc':
            app.enc();
            break;
        case 'nginx-dev':
            app.debug()
                .initComponents()
                .startNginx();
            break;
        case 'nginx-release':
            app.release()
                .initComponents()
                .startNginx();
            break;
        case 'cd':
        case 'component-debug':
            app.debug()
                .initComponents()
                .component();
            break;
        case 'component-release':
            app.release()
                .initComponents()
                .component();
            break;
    }
};

runner.handleError = (err) => {
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
};