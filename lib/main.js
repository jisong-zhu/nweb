'use strict';
import Package from '../package';
import Path from 'path';
import _ from 'lodash';
import GulpLoadPlugins from 'gulp-load-plugins';
import ConfigUtils from './utils/config-utils';
import app from './app';
const $ = GulpLoadPlugins();
export const run = (args) => {
    ConfigUtils.readConfig(__dirname, args[0], $.util.env);
    let env = args.length > 1 ? args[1] : '';

    console.log('nweb当前版本：', $.util.colors.green(Package.version));

    let $config = ConfigUtils.getConfig();
    console.log('项目当前版本：', $.util.colors.green($config.version));
    switch (env) {
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
        case 'br':
        case 'babel-releae':
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
        case 'nd':
        case 'nginx-dev':
            app.debug()
                .initComponents()
                .startNginx();
            break;
        case 'nr':
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
        case 'cr':
        case 'component-release':
            app.release()
                .initComponents()
                .component();
            break;
        default:
            let help = '\r\ndebug:                     以debug模式运行\r\n\r\n' +
                'release:                   以release模式运行\r\n\r\n' +
                'babel:                     对JS和LESS进行babel处理，然后以debug模式运行\r\n\r\n' +
                'br | babel-releae:         对JS和LESS进行babel处理，然后以release模式运行\r\n\r\n' +
                'static:                    将项目目录作为静态目录进行处理\r\n\r\n' +
                'enc:                       对配置文件中指定的js文件列表进行Stringer加密\r\n\r\n' +
                'nd | nginx-dev:           以debug模式模拟运行nginx服务器\r\n\r\n' +
                'nr | nginx-release:       以release模式模拟运行nginx服务器\r\n\r\n' +
                'cd | component-debug:     编译组件库的debug版本，如taco项目\r\n\r\n' +
                'cr | component-release:   编译组件库的release版本，如taco项目';
            console.log(help);
            break;
    }
};