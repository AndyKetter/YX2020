/*
 * @Author: 墨含
 * @Date: 2019-09-18 11:03:06
 * @Last Modified by: 墨含
 * @Last Modified time: 2019-09-18 11:04:07
 */
/* eslint-disable no-cond-assign */
/**
 * 检查浏览器版本js
 * //探测浏览器 目前oa生产环境全屏是chrome61.0
 * //var neihe = getBrowser("n"); // 所获得的就是浏览器所用内核。
 * //var banben = getBrowser("v");// 所获得的就是浏览器的版本号。
 * //var browser = getBrowser();// 所获得的就是浏览器内核加版本号。
 * @export getBrowser方法
 * @param {*} n 可不传
 * @returns 浏览器类型与内核版本字符串
 */
export function getBrowser(n) {
    var ua = navigator.userAgent.toLowerCase(),
        s,
        name = "",
        ver = 0;
    (s = ua.match(/msie ([\d.]+)/)) ? _set("ie", _toFixedVersion(s[1])): (s = ua.match(/firefox\/([\d.]+)/)) ? _set("firefox", _toFixedVersion(s[1])) : (s = ua.match(/chrome\/([\d.]+)/)) ? _set("chrome", _toFixedVersion(s[1])) : (s = ua.match(/opera.([\d.]+)/)) ? _set("opera", _toFixedVersion(s[1])) : (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("safari", _toFixedVersion(s[1])) : 0

    function _toFixedVersion(ver, floatLength) {
        ver = ("" + ver).replace(/_/g, ".")
        floatLength = floatLength || 1
        ver = String(ver).split(".")
        ver = ver[0] + "." + (ver[1] || "0")
        ver = Number(ver).toFixed(floatLength)
        return ver
    }

    function _set(bname, bver) {
        name = bname
        ver = bver
    }
    return n == "n" ? name : n == "v" ? ver : name + ver
}