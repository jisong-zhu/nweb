'use strict';

let locals = {
    a: 1,
    b: 2
};

module.exports = {
    server: {
        port: 3000,
        proxy: [{
            path: '/xkmodels',
            options: {
                target: 'http://127.0.0.1:3300/'
            }
        }, {
            path: '/apis',
            options: {
                target: 'http://127.0.0.1:10000/'
            }
        }]
    },
    source_dir: 'src',
    jade_dir: 'jade',
    less_dir: 'less',
    output_dir: 'out',
    vendor: {
        'js': ['jquery.js']
    },
    page_bundles: {
        index: {
            useGlobalVendor: true
        },
        'sub/sub': {
            useGlobalVendor: false,
            locals: function() {
                return locals;
            },
            vendor: {
                js: ['jquery.js']
            }
        }
    },
    components: ['test'],
    enc: ['./out/assets/js/index.js'],
    version: '1.0.0'
};
