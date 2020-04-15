const propPlugins = []
if (process.env.NODE_ENV === 'production') {
    propPlugins.push('transform-remove-console')
}


module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        // 这样导入是全局导入，无论时开发阶段还是生产阶段都是起作用的
        //移除console输出插件
        // 'transform-remove-console'
        ...propPlugins,
        '@babel/plugin-syntax-dynamic-import'
    ]
}
