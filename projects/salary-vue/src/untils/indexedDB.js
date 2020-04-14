/* eslint-disable no-unused-vars */
/**
 * by mohan
 * @export
 * @param {*} dataBaseInfo indexedDB信息对象 name 名字  version 版本号码
 * @param {*} storename 存储空间名字
 * @param {*} key 存储空间的键
 * @param {*} callback 取到对应数据回调函数
 */
export function getDataByKey(dataBaseInfo, storename, key, callback) { //根据DB名字,版本号,存储空间的键找到对应数据并给出回调
    var request = window.indexedDB.open(dataBaseInfo.name, dataBaseInfo.version)
    request.onsuccess = function (event) {
        var db = event.target.result
        var transaction = db.transaction([storename], 'readwrite')
        var objectStore = transaction.objectStore(storename)
        // 错误处理
        request.onerror = function (event) {
            console.error('error')
        }
        // 第一种，get方法
        objectStore.get(key).onsuccess = function (event) {
            callback(event.target.result)
        }
    }
}
// 用法
// var dataBaseInfo = {
//     name: 'yx_default',
//     version: 1
// }
// var storename = 'yx_default_db'
// var key = 'menus_hx+PzIwBywn0uezDq1MXIQ=='
// var callback = function (res) {
//     console.log(res)
// }
// getDataByKey(dataBaseInfo, storename, key, callback)