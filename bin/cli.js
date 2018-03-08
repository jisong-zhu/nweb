#!/usr/bin/env node

'use strict';
const CLI = require('cac');
const Runner = require('./run');

function getOpts(input, flags, mode) {
    const opts = Object.keys(flags).reduce((res, next) => {
        if (typeof flags[next] !== 'undefined') {
            res[next] = flags[next];
        }
        return res;
    }, {});

    if (input.length > 0) {
        opts.entry = input;
    }
    return Object.assign({
        mode
    }, opts);
}

function createHandler(mode) {
    return (input, flags) => {
        Runner.start(getOpts(input, flags, mode));
    };
}

const cli = CLI();

cli.option('signature', {
    alias: 'S',
    desc: '签名'
});

cli.command('*', 'show help', (input, flags) => {
    cli.showHelp();
});
cli.command('debug', '以debug模式编译运行项目', createHandler('debug'));
cli.command('release', '以release模式编译运行项目', createHandler('release'));
cli.command('babel', '以debug模式编译运行项目，并且对JS代码进行babel降级', createHandler('babel'));
cli.command('babel-release', {
    desc: '以release模式编译运行项目',
    alias: 'br'
}, createHandler('babel-release'));
cli.command('static', '启动一个静态资源服务', createHandler('static'));
cli.command('nginx', {
    desc: '模拟Nginx的方式搭建静态资源服务，并且支持代理；以debug模式处理js、css和pug的编译',
    alias: 'nd'
}, createHandler('nginx'));
cli.command('nginx-release', {
    desc: '模拟Nginx的方式搭建静态资源服务，并且支持代理；以release模式处理js、css和pug的编译',
    alias: 'nr'
}, createHandler('nginx-release'));
cli.command('component-debug', {
    desc: '打包编译组件模块；以debug模式处理js、css和pug的编译',
    alias: 'cd'
}, createHandler('component-debug'));
cli.command('component-release', {
    desc: '打包编译组件模块；以release模式处理js、css和pug的编译',
    alias: 'cr'
}, createHandler('component-release'));

cli.command('init', '从模板创建nweb应用，默认创建基础Web应用模板：templates-web。', (input, flags) => {
        let options = getOpts(input, flags, 'init');
        require('../lib/xserver-cli')(options.template, options.project);
    })
    .option('template', {
        alias: 't',
        desc: "指定模板的名称"
    })
    .option('project', {
        alias: 'p',
        desc: "指定项目的名称"
    });
cli.parse();