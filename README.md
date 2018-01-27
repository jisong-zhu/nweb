# nweb

NWeb工具主要是封装了Gulp编译脚本，通过配置文件，快速搭建一个gulp编译的工程。用来解决个人在开发过程中，经常要写gulp来编译Pug/Jade页面，编译和合并打包Less，合并压缩JS。

默认配置：

```
module.exports = {
    server: {
        port: 3000,
        proxy: false,
        external_static: false,
        default_page: null
    },
    build_jade: true,
    js_dir: 'js',
    page_ext: '.jade',  // 页面文件的后缀，支持.jade和.pug
    source_dir: 'src', // 所有代码文件的目录
    jade_dir: 'jade', // 页面文件的目录
    less_dir: 'less', // 样式文件的目录，只支持是less
    yaml_dir: 'yaml',
    assets_dir: 'assets', // 编辑后静态资源的目录路径
    output_dir: 'out', // 编辑后输出的目录路径，相对项目根目录的路径
    vendor: {
        'js': null,
        'css': null
    }, // 所有页面都依赖的css、js文件
    page_bundles: {
    }, // 配置每个页面的编译内容，包括使用的css、js文件以及依赖的css、js文件
    components: [], // 只编译js组件代码时，组件的js文件相对于js_dir目录的路径
    enc: [], // 需要加密的js文件清单，相对于js_dir目录的相对路径
    clean: [], 
    version: '1.0.0',
    doBabel: false, // 是否执行babel js文件，主要是为了兼容ES6
    enablePageChecker: true, // 是否启用.pug文件监控，true：监听pug文件的变化，动态重新编译pug
    enableJSChecker: true // 是否启用js文件监控，true：监听js文件的变化，动态重新编译js
};
```