//自定义全局过滤器filter by 墨含
export default {
    toThousands(x) { //数字每隔三位数加逗号再加.00
        if (typeof x === 'number' && x < 0) return x.toFixed(2);
        if (typeof(parseFloat(x)) === 'number' && x < 0) return parseFloat(x).toFixed(2);
        if (isNaN(parseFloat(x))) return '';
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length < (rs + 1) + 2) {
            s += '0';
        }
        var leftNum = s.split(".")[0];
        var rightNum = "." + s.split('.')[1];
        var result;
        var resultArray = new Array();
        if (leftNum.length > 3) {
            var i = true;
            while (i) {
                resultArray.push(leftNum.slice(-3));
                leftNum = leftNum.slice(0, leftNum.length - 3);
                if (leftNum.length < 4) {
                    i = false;
                }
            }
            var sortArray = new Array();
            for (var y = resultArray.length - 1; y >= 0; y--) {
                sortArray.push(resultArray[y]);
            }
            result = leftNum + "," + sortArray.join(",") + rightNum;
        } else {
            result = s;
        }
        return result;
    },
    subDateYear(val) { //截取日期如201806格式的年份
        return val.substring(0, 4)
    },
    subDateMonth(val) { //截取日期如201806格式的月份
        return val.substring(4, 6)
    },
    repair(val) { //容错 解决0的问题  --为占位符
        if (val === 0) {
            return 0
        } else {
            return val || '--'
        }
    },
    repairZero(val) { //容错 0为占位符
        return val || '0'
    },
    repairEmpty(val) { //容错 ''为占位符
        return val || ''
    }
}