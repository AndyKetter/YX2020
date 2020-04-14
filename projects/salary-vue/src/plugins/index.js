/**
 * 这样会存在一个插件引入顺序问题， 因为webpack是根据你文件夹中文件的位置排序的， 如有A、 B、 C三个插件， A插件需要用到B插件提供的某个功能， 这种情况下由于A插件被先引用， B后引用， 导致A插件代码报错情况， 这里用个取巧的方法， 将A、 B插件命名成以下形式：
 * a - 2 - A.js、 a - 1 - B.js， 这样B插件就会排在前面优先加载。
 * 如果不存在依赖关系， 可随意。
 */
const requirePlugin = require.context(
    // 当前plugins目录
    '/',
    // 是否查询其子目录
    false,
    // 匹配当前plugins目录下的js文件
    /.+\.js$/
)
requirePlugin.keys().forEach(fileName => {
    requirePlugin(fileName)
})