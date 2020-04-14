/* eslint-disable no-unused-vars */
import {
    mock
} from 'mockjs'
//财务系统-薪资扣款项-借支管理--借支明细
mock(RegExp('/api/getloanpayDetailData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'id|+1': 1,
            'value1': '类型',
            'value2': '@date(yyyy-MM-dd)',
            'value3': '@natural(10000000,70000000)',
            'value4': '是',
            'value5': '@natural(10,100)',
            'value6': '@natural(10,100)',
            'value7': '@natural(10000,70000)',
            'value8': '@natural(10,100)',
            'value9': '@natural(10,100)',
            'value10': '@natural(10000,70000)',
            'value11': '@natural(10000,70000)',
            'value12': '@natural(10000,70000)',
            'value13': '无',
            'value14': '@cname',
            'value15': '@datetime',
            'value16': '未提交'
        }]
    })
})