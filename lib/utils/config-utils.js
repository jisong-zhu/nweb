'use strict';
const _ = require('lodash');
const Path = require('path');
const File = require('fs');
const FileUtils = require('./file-utils');
const defaultConfig = require('../default-config');

class ConfigUtils {
    constructor() {
        this.$config = _.defaultsDeep({
            isRelease: false
        }, defaultConfig);
    }
    getConfig() {
        return this.$config;
    }
    readConfig(processDir, workDir, env) {
        let configPath = Path.join(workDir, 'nweb.yaml');
        let projectConfig = {};
        if (File.existsSync(configPath)) {
            projectConfig = FileUtils.parseYamlToJson(configPath);
        } else {
            configPath = Path.join(workDir, 'nwebfile.js');
            if (File.existsSync(configPath)) {
                projectConfig = require(configPath);
                if(typeof projectConfig === 'function'){
                    projectConfig = projectConfig(env);
                }
            } else {
                throw new Error(`没有找到配置文件nweb.yaml或nweb.js，工程目录为：${workDir}`);
            }
        }
        this.$config = _.defaultsDeep(projectConfig, this.$config);
        this.$config.workDir = workDir;
        this.$config.processDir = processDir;
        this.init();
    }
    init() {
        // 源文件结构
        let source = {
            root: Path.join(this.$config.workDir, this.$config.source_dir),
            static: Path.join(this.$config.workDir, this.$config.static_dir)
        };
        this.$config.source = _.defaultsDeep(source, {
            js: Path.join(source.root, this.$config.js_dir),
            ts: Path.join(source.root, this.$config.ts_dir),
             /*这个是最初的设计，所有图片静态资源的都是在src目录中，并且会编译时拷贝到output目录；新的设计方式是提供static目录，static目录的资源在debug模式时不拷贝，在release的时候才拷贝到output目录中*/
            img: Path.join(source.root, 'img'),
            less: Path.join(source.root, this.$config.less_dir),
            jade: Path.join(source.root, this.$config.jade_dir),
            yaml: Path.join(source.root, this.$config.yaml_dir),
            vendor: Path.join(source.root, 'vendor')
        });
        // 编译目标结构
        let output = {
            root: Path.join(this.$config.workDir, this.$config.output_dir)
        };
        this.$config.output = _.defaultsDeep(output, {
            assets: Path.join(output.root, this.$config.assets_dir),
            js: Path.join(output.root, this.$config.assets_dir, 'js'),
            img: Path.join(output.root, this.$config.assets_dir, 'img'),
            css: Path.join(output.root, this.$config.assets_dir, 'css'),
            json: Path.join(output.root, this.$config.assets_dir, 'json'),
            media: Path.join(output.root, this.$config.assets_dir, 'media'),
            html: Path.join(output.root),
            fonts: Path.join(output.root, this.$config.assets_dir, 'fonts')
        });
    }
}

module.exports = new ConfigUtils();
