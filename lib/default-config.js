'use strict';

module.exports = {
    server: {
        port: 3000,
        proxy: false,
        external_static: false,
        default_page: null
    },
    build_page: true,
    js_dir: 'js',
    ts_dir: 'ts',
    page_ext: '.jade',
    source_dir: 'src',
    jade_dir: 'jade',
    less_dir: 'less',
    yaml_dir: 'yaml',
    assets_dir: 'assets',
    output_dir: 'out',
    static_dir: 'static',
    vendor: {
        'js': null,
        'css': null,
        dev: {
            'js': null,
            'css': null
        },
        release: {
            'js': null,
            'css': null
        }
    },
    page_bundles: {
        index: {
            useGlobalVendor: true,
            js: ['index.js'],
            css: ['index.css']
        }
    },
    components: [],
    enc: [],
    clean: [],
    version: '1.0.0',
    doBabel: false,
    enablePageChecker: true,
    enableJSChecker: true
};