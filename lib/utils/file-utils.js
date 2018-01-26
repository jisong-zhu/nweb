'use strict';
const File = require('fs');
const Path = require('path');
const Yaml = require('js-yaml');
const _ = require('lodash');

module.exports = class {
    static changeExtension(file, newExt) {

    }
    static getExtension(filePath) {
        return Path.extname(filePath);
    }
    static parseYamlToJson(yamlPath) {
        return Yaml.safeLoad(File.readFileSync(yamlPath, 'utf8'));
    }
    static absolutePathList(root, relativePathList) {
        relativePathList = relativePathList || [];
        let absolutePathList = [];
        _.forEach(relativePathList, relativePath => {
            absolutePathList.push(Path.join(root, relativePath));
        });
        return absolutePathList;
    }
    static getPages(pageDir, ext) {
        let pages = [];

        function filterPages(dir, rel, pages, ext) {
            var files = File.readdirSync(dir);
            files = files.filter(file => {
                return !_.startsWith(file, '_');
            });
            _.forEach(files, file => {
                let name = Path.join(dir, file);
                let key = rel + file;
                if (File.statSync(name).isDirectory()) {
                    filterPages(name, key + '/', pages, ext);
                } else if (_.endsWith(file, ext)) {
                    pages.push(key);
                }
            });
            return pages;
        }
        return filterPages(pageDir, '', pages, ext);
    }
};