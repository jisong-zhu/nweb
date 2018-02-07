const clone = require('git-clone');
const shell = require('shelljs');
const logger = require('./utils/logger');

module.exports = (template, project)=>{
    template = template || 'templates-web';
    project = project || 'nweb-demo';
    let pwd = shell.pwd();
    logger.info(`正在拉取模板代码，下载位置：${pwd}/${project}/ ...`);
    clone(`https://github.com/jisong-zhu/${tpl}.git`, pwd + `/${project}`, null, function () {
        shell.rm('-rf', pwd + `/${project}/.git`);
        logger.info(`成功从模板创建项目：${project}`);
    });
};