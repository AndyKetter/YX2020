import {
    mock
} from 'mockjs'

//财务系统-人才引进报表
mock(RegExp('/api/getTalentData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'index|+1': 1,
            'ntr': '@cname',
            'workerNum': '@natural(10000,70000)',
            'idCard': '@id',
            'area': '@region',
            'department': '业务部',
            'workerType': '@workerType',
            'workerStatus': '在职',
            'leaveDate': '@date(yyyy-MM)',
            'ntNum': '@natural(1,5)',
            'award': '900,00'
        }]
    })
})

//财务系统-培训补助
mock(RegExp('/api/getTrainData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'idCard': '@id',
            'area': '@region',
            'position': '资产管理员',
            'trainDays': '@natural(1,2)',
            'bzNum': '160.00',
            'minKq': '113',
            'value1': '@natural(100, 150)',
            'value2': '已发放',
            'value3': '@date(yyyy-MM-dd)',
        }]
    })
})
//财务系统-人事搜索
mock(RegExp('/api/getFinanceSearchData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'value1': '@sex',
            'workerNum': '@natural(80000000,89999999)',
            'value2': '业务部',
            'value3': '资产管理员',
            'value4': '补助扣回',
            'value5': '110.00',
            'value6': '@date(yyyy-MM-dd)',
            'value7': '没事那么哈'
        }]
    })
})

//个人中心-总览-信息采集
mock(RegExp('/api/getInfoData' + '.*'), 'get', () => {
    return mock({
        'dataTable|10': [{
            'id|+1': 1,
            'name': '@cname',
            'value1': '@natural(80000000,89999999)',
            'value2': '@cname',
            'value3': '@phone',
            'value4': '@id',
            'value5': '专升本',
            'value6': '已签署',
            'value7': '已扣除（275）',
            'value8': '已采集',
            'value9': '审核通过'
        }]
    })
})
//个人中心-调查结果
mock(RegExp('/api/getCheckData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'id|+1': 1,
            'val': '是',
            'value1': '@cname',
            'value2': '谭曼-杨桂生-汤维-张三',
            'value3': '@phone',
            'value4': '是',
            'value5': '@natural(1,5)',
            'value6': '@natural(1,5)',
            'value7': '@natural(1,5)',
            'value8': '@date(yyyy-MM-dd hh:mm:ss)',
        }]
    })
})
//个人中心-代扣报名费
mock(RegExp('/api/getHelpPayData' + '.*'), 'get', () => {
    return mock({
        'dataTable|12': [{
            'id|+1': 1,
            'val': '@cname',
            'val2': '@cname',
            'value1': '@id',
            'value2': '@natural(80000000,89999999)',
            'value3': '是',
            'value4': '专升本',
            'value5': '@natural(100,500)',
            'value6': '已采集',
            'value7': '未上传',
            'value8': '未提交',
            'value9': '@date(yyyy-MM)',
            'value10': '未扣款',
            'value11': '是'
        }]
    })
})
//财务系统-借支管理-每月借支名单
mock(RegExp('/api/getMonthTableData' + '.*'), 'get', () => {
    return mock({
        'dataTable|10': [{
            'id|+1': 1,
            'name': '@cname',
            'value1': '@natural(80000000,89999999)',
            'value2': '@id',
            'value3': '@date(yyyy-MM-dd)',
            'value4': '@date(yyyy-MM-dd)',
            'value5': '在职',
            'value6': '5,000.00',
            'value7': '5,000.00',
            'value8': '@date(yyyy-MM)',
            'value9': '已提交'
        }]
    })
})
//财务系统-借支管理-借支调整名单
mock(RegExp('/api/getChangeTableData' + '.*'), 'get', () => {
    return mock({
        'dataTable|10': [{
            'id|+1': 1,
            'name': '@cname',
            'value1': '@natural(80000000,89999999)',
            'value2': '@id',
            'value3': '退回',
            'value4': '5,000.00',
            'value5': '@date(yyyy-MM-dd)',
            'value6': '原因是是事实上四十是',
            'value7': '@cname',
            'value8': '@date(yyyy-MM-dd)'
        }]
    })
})

//财务系统-明细-工资条
mock(RegExp('/api/getDataSummaryDetail' + '.*'), 'get', () => {
    return mock({
        'dataTable|13': [{
            'index|+1': 1,
            'idCard': '@id',
            'pNumber': '@natural(200000,899999)',
            'area': '@region',
            'zzzt': '@natural(2000,8999)',
            'ywlx': '@natural(2000,8999)',
            'ycqsj': '@natural(2000,8999)',
            'scqsj': '@natural(2000,8999)',
            'name': '@natural(2000,8999)',
            'sex': '@natural(2000,8999)',
            'zjl': '@natural(2000,8999)',
            'jt': '@natural(2000,8999)',
            'bz': '@natural(2000,8999)',
            'zz': '@natural(2000,8999)',
            'zw': '@natural(2000,8999)',
            'zww': '@natural(2000,8999)',
            'rzsj': '@natural(2000,8999)',
            'zzsj': '@natural(2000,8999)',
            'rylb': '@natural(2000,8999)',
            'jbgz': '@natural(2000,8999)',
            'bmbz': '@natural(2000,8999)',
            'zcbz': '@natural(2000,8999)',
            'jtbz': '@natural(2000,8999)',
            'dhbz': '@natural(2000,8999)',
            'nmbz': '@natural(2000,8999)',
            'zzgz': '@natural(2000,8999)',
            'jbgzz': '@natural(2000,8999)',
            'sbbz': '@natural(2000,8999)',
            'sxbt': '@natural(2000,8999)',
            'cb': '@natural(2000,8999)',
            'zfbt': '@natural(2000,8999)',
            'glgz': '@natural(2000,8999)',
            'xlbz': '@natural(2000,8999)',
            'qqj': '@natural(2000,8999)',
            'rcyjj': '@natural(2000,8999)',
            'jxjt': '@natural(2000,8999)',
            'jxkh': '@natural(2000,8999)',
            'tsjx': '@natural(2000,8999)',
            'ndjl': '@natural(2000,8999)',
            'pxbz': '@natural(2000,8999)',
            'clbz': '@natural(2000,8999)',
            'qtbz': '@natural(2000,8999)',
            'jrfl': '@natural(2000,8999)',
            'bzbtkh': '@natural(2000,8999)',
            'ztydcytzed': '@natural(2000,8999)',
            'fqqkk': '@natural(2000,8999)',
            'val1': '@natural(2000,8999)',
            'val2': '@natural(2000,8999)',
            'val3': '@natural(2000,8999)',
            'val4': '@natural(2000,8999)',
            'val5': '@natural(2000,8999)',
            'val6': '@natural(2000,8999)',
            'val7': '@natural(2000,8999)',
            'val8': '@natural(2000,8999)',
            'val9': '@natural(2000,8999)',
            'val10': '@natural(2000,8999)',
            'val11': '@natural(2000,8999)',
            'val12': '@natural(2000,8999)',
            'val13': '@natural(2000,8999)',
            'val14': '@natural(2000,8999)',
            'val15': '@natural(2000,8999)',
            'val16': '@natural(2000,8999)',
            'val17': '@natural(2000,8999)',
            'val18': '@natural(2000,8999)',
            'val19': '@natural(2000,8999)',
            'val20': '@natural(2000,8999)',
            'val21': '@natural(2000,8999)',
            'val22': '@natural(2000,8999)',
            'val23': '@natural(2000,8999)',
            'val24': '@natural(2000,8999)',
            'val25': '@natural(2000,8999)',
            'val26': '@natural(2000,8999)',
            'val27': '@natural(2000,8999)',
            'val28': '@natural(2000,8999)',
            'val29': '@natural(2000,8999)',
            'val30': '@natural(2000,8999)',
            'val31': '@natural(2000,8999)',
            'val32': '@natural(2000,8999)',
            'val33': '@natural(2000,8999)',
            'val34': '@natural(2000,8999)',
            'val35': '@natural(2000,8999)',
            'val36': '@natural(2000,8999)',
            'val37': '@natural(2000,8999)',
            'val38': '@natural(2000,8999)'
        }]
    })
})

//个人中心-我的工资条-消息通知
mock(RegExp('/api/getMessageData' + '.*'), 'get', () => {
    return mock({
        'dataTable|8': [{
            'title': '您5月的工资账单已生成',
            'source': '财务-章三',
            'date': '@date(yyyy-MM-dd)'
        }]
    })
})