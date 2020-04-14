//公用工具方法
export default {
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
    getCookie(name){
        let strcookie = document.cookie
        let arrcookie = strcookie.split(";")
        //遍历匹配
        for (let i = 0; i < arrcookie.length; i++) {
            const arr = arrcookie[i].split("=")
            if(arr[0] == name){
                return arr[1]
            }
            
        }
        return""
    },
    setCookie(name,value,days){//days设置过期时间 单位：天 不传默认是cookie在浏览器关闭时删除
        let exp = new Date()
        exp.setTime(exp.getTime()+days*24*60*60*1000)
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()
    }
}