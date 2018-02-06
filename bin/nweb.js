#!/usr/bin/env node

import CLI from 'cac';

function getOpts(input, flags) {
    const opts = Object.keys(flags).reduce((res, next) => {
        if (typeof flags[next] !== 'undefined') {
            res[next] = flags[next];
        }
        return res;
    }, {});

    if (input.length > 0) {
        opts.entry = input;
    }
    return Object.assign({}, opts);
}

function createHandler() {
    return (input, flags) => {
        const run = require('./run');
        run(getOpts(input, flags)).catch(run.handleError);
    };
}

const cli = CLI();

cli.command('*', {
    desc: '',
    alias: 'debug'
});
cli.command('debug', '以debug模式编译运行项目', createHandler());
cli.command('release', '以release模式编译运行项目', createHandler());
cli.command('babel', '以debug模式编译运行项目，并且对JS代码进行babel降级', createHandler());
cli.command('babel-release', {
    desc: '以release模式编译运行项目',
    alias: 'br'
}, createHandler());
cli.command('static', '启动一个静态资源服务', createHandler());
cli.command('nginx', {
    desc: '模拟Nginx的方式搭建静态资源服务，并且支持代理；以debug模式处理js、css和pug的编译',
    alias: 'nd'
}, createHandler());
cli.command('nginx-release', {
    desc: '模拟Nginx的方式搭建静态资源服务，并且支持代理；以release模式处理js、css和pug的编译',
    alias: 'nr'
}, createHandler());
cli.command('component-debug', {
    desc: '打包编译组件模块；以debug模式处理js、css和pug的编译',
    alias: 'cd'
}, createHandler());
cli.command('component-release', {
    desc: '打包编译组件模块；以release模式处理js、css和pug的编译',
    alias: 'cr'
}, createHandler());
cli.parse();