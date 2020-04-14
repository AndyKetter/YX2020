/*
 * @Author: 墨含
 * @Date: 2019-09-18 11:03:33
 * @Last Modified by: zc
 * @Last Modified time: 2019-11-22 15:09:43
 */
//公用工具方法
import _includes from "lodash/includes"

export default {
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)") //构造一个含有目标参数的正则表达式对象
        var r = window.location.hash.substr(1).match(reg) //匹配目标参数
        if (r != null) return unescape(r[2])
        return null //返回参数值
    },
    getHashUrlParam(name) {
        // eslint-disable-next-line no-useless-escape
        var reg = new RegExp("(^|&?)" + name + "=([^&]*)(&|$)", "i")
        var r = window.location.href.match(reg)
        if (r != null) {
            return unescape(r[2])
        } else {
            return null
        }
    },
    getCookie(name) {
        let strcookie = document.cookie
        let arrcookie = strcookie.split(";")
        for (let i = 0; i < arrcookie.length; i++) {
            const arr = arrcookie[i].split("=")
            if (arr[0] == name) {
                return arr[1]
            }
        }
        return ""
    },
    setCookie(name, value, days) {
        //days设置过期时间 单位：天 不传默认是cookie在浏览器关闭时删除
        let exp = new Date()
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
    },
    getYtd_Hms() {
        //获取当前年月日 时分秒 格式为 yyyy-MM-dd HH:mm:ss
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minute = date.getMinutes()
        let second = date.getSeconds()
        month = month < 10 ? "0" + month : month
        day = day < 10 ? "0" + day : day
        hour = hour < 10 ? "0" + hour : hour
        minute = minute < 10 ? "0" + minute : minute
        second = second < 10 ? "0" + second : second
        let myYtd_Hms = year.toString() + "-" + month.toString() + "-" + day.toString() + " " + hour.toString() + ":" + minute.toString() + ":" + second.toString()
        return myYtd_Hms
    },
    getYtd() {
        //获取当前年月 本月 格式为 yyyyMM
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? "0" + month : month
        let myYtd = year.toString() + month.toString()
        return myYtd
    },
    getYMd() {
        // 获取当前年月日 本月 格式为 yyyy-MM-dd
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month < 10 ? "0" + month : month
        day = day < 10 ? "0" + day : day
        let myYMd = year.toString() + "-" + month.toString() + "-" + day.toString()
        return myYMd
    },
    getYd() {
        //获取当前年月 本月 格式为 yyyy-MM
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? "0" + month : month
        let myYtd = year.toString() + "-" + month.toString()
        return myYtd
    },
    getPYd() {
        //获取当前年，上月 格式为 yyyy-MM
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        month = month < 10 ? "0" + month : month
        let myYtd = year.toString() + "-" + month.toString()
        return myYtd
    },
    getPYtd() {
        //获取当前年，上月 格式为 yyyyMM
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth()
        month = month < 10 ? "0" + month : month
        let myYtd = year.toString() + month.toString()
        return myYtd
    },
    includes(arr, value) {
        //检查 value(值) 是否在 collection(集合) 中,如果找到 value 返回 true， 否则返回 false
        return _includes(arr, value)
    },
    getTbHeight(v) {
        return window.innerHeight - v //动态计算表格高度
    }
}