import Mock,{Random} from 'mockjs'
//设置mock延迟
Mock.setup({
    // timeout:'800-1000'
})
//mock扩展
Random.extend({
    businessType() {//业务类型
        let businessTypes = ['中信抢案','平安普惠','中信银行','长沙银行']
        return this.pick(businessTypes)
    }
})
Random.extend({
    sex() { //性别
        let sex = ['男','女']
        return this.pick(sex)
    }
})
Random.extend({
    phone() { //电话号码
        let phone = ['15386015359', '17742245563', '15387015354', '15396815357']
        return this.pick(phone)
    }
})
Random.extend({
    workerType() { //电话号码
        let workerType = ['正式员工', '试用员工']
        return this.pick(workerType)
    }
})
Random.extend({
    education() { //学历
        let education = ['本科', '专科','高中','小学','博士','硕士']
        return this.pick(education)
    }
})
Random.extend({
    adjustType() { //应扣调整类型
        let adjustType = ['监察扣款', '其他应扣款', '宿舍费扣款']
        return this.pick(adjustType)
    }
})
Random.extend({
    adjustWay() { //调整方式
        let adjustWay = ['退回', '补扣']
        return this.pick(adjustWay)
    }
})
Random.extend({
    workingState() { //在职状态
        let workingState = ['在职', '离职']
        return this.pick(workingState)
    }
})
//未配置基础薪资-职能部门
Mock.mock(RegExp('/api/getNoConfigTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [
            {
                'id|+1': 1,
                'name': '@cname',
                'pNumber': '@natural(8100101000,8190615000)',
                'level': '@businessType',
                'money': '@natural(10000,70000)',
                'month': '@date(yyyy-MM)',
                'lastMoney': '@natural(10000,70000)',
                'employeeType': '@natural(1,15)'
            }
        ]
    })
})
//业绩查询-个人业绩
Mock.mock(RegExp('/api/getPerformanceTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'index|+1': 1,
            'agent': '@cname',
            'businessType': '@businessType',
            'cardHolder': '@cname',
            'idCard': '@id',
            'cardNum': '@id',
            'rbMoney': '@natural(10000,70000)',
            'sfzdhk': '是',
            'rbDate': '@date(yyyy-MM-dd)',
            'endMoney': '@natural(10000,70000)',
            'complainFlag|+1':1,
        }]
    })
})
//业绩排名-总经理业绩
Mock.mock(RegExp('/api/generalTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'index|+1': 1,
            'duty': '@cname',
            'tNum': '@natural(1,10)',
            'area': '@region',
            'businessType': '@businessType',
            'teamRbTotal': '@natural(10000,70000)',
            'teamRealNum': '@natural(10000,70000)',
            'expectPerformance': '@natural(10000,70000)',
            'checkNum': '@natural(10,70)',
            'successRate': '@natural(10,100)%',
            'resultsRank': '@natural(1,10)'
        }]
    })
})
//业绩排名-副总经理业绩
Mock.mock(RegExp('/api/deputyGeneralTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'index|+1': 1,
            'duty1': '@cname',
            'duty2': '@cname',
            'tNum': '@natural(1,10)',
            'area': '@region',
            'businessType': '@businessType',
            'mainRb': '@natural(10000,70000)',
            'teamRbTotal': '@natural(10000,70000)',
            'teamRealNum': '@natural(10000,70000)',
            'expectPerformance': '@natural(10000,70000)',
            'checkNum': '@natural(10,70)',
            'successRate': '@natural(10,100)%',
            'resultsRank': '@natural(1,10)'
        }]
    })
})
//业绩排名-部长业绩
Mock.mock(RegExp('/api/ministerTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'index|+1': 1,
            'duty1': '@cname',
            'duty2': '@cname',
            'tNum': '@natural(1,10)',
            'area': '@region',
            'businessType': '@businessType',
            'mainRb': '@natural(10000,70000)',
            'teamRbTotal': '@natural(10000,70000)',
            'teamRealNum': '@natural(10000,70000)',
            'expectPerformance': '@natural(10000,70000)',
            'checkNum': '@natural(10,70)',
            'successRate': '@natural(10,100)%',
            'resultsRank': '@natural(1,10)'
        }]
    })
})
//业绩排名-个人业绩
Mock.mock(RegExp('/api/personalTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'index|+1': 1,
            'duty0': '@cname',
            'duty1': '@cname',
            'duty2': '@cname',
            'tNum': '@natural(1,10)',
            'area': '@region',
            'businessType': '@businessType',
            'teamRbTotal': '@natural(10000,70000)',
            'teamRealNum': '@natural(10000,70000)',
            'checkNum': '@natural(10,70)',
            'successRate': '@natural(10,100)%',
            'resultsRank': '@natural(1,10)'
        }]
    })
})
//业绩排名-申诉记录
Mock.mock(RegExp('/api/getAppealData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'cardHolder': '@cname',
            'businessType': '@businessType',
            'idCard': '@id',
            'cardNum': '@id',
            'repayNum': '@natural(10000,70000)',
            'teamRbTotal': '@natural(10000,70000)',
            'finalNum': '@natural(10000,70000)',
            'repayDate': '@@date(yyyy-MM-dd)',
            'appealDate': '@@date(yyyy-MM-dd)',
            'appealReason': '折算比例有误'
        }]
    })
})
//业绩排名-团队业绩
Mock.mock(RegExp('/api/getTeamData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'cardHolder': '@cname',
            'businessType': '@businessType',
            'repayNum': '@natural(10000,70000)',
            'saleNum': '@natural(10000,70000)',
            'gzje': '@natural(10000,70000)',
            'finalNum': '@natural(10000,70000)',
            'teamNum': '@natural(10000,70000)',
            'rank': '@natural(1,70)',
            'workNum': '@natural(1,70)',
            'position': '组长',
            'jbr': '组长',
            'workerType': '正式员工'
        }]
    })
})
//人事收入项-餐补
Mock.mock(RegExp('/api/getmealSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'workerType': '@workerType',
            'area': '@region',
            'mealSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})

//人事收入项-住房补贴
Mock.mock(RegExp('/api/getHsSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'workerType': '@workerType',
            'area': '@region',
            'hsSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-社保补贴
Mock.mock(RegExp('/api/getSocialSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'workerType': '@workerType',
            'area': '@region',
            'scSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-实习补贴
Mock.mock(RegExp('/api/getInterSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'workerType': '@workerType',
            'area': '@region',
            'interSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-学历补贴
Mock.mock(RegExp('/api/getEduSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'education': '@education',
            'area': '@region',
            'eduSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-工龄补贴
Mock.mock(RegExp('/api/getSvSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'area': '@region',
            'entryDate': '@date(yyyy-MM)',
            'age': '@natural(1,5)',
            'svSubsidy': '@natural(100,500)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-劳模补贴
Mock.mock(RegExp('/api/getLmSubsidyData' + '.*'), 'get', () => {
return Mock.mock({
        'dataTable|12': [{
            'id|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'workerNum': '@natural(10000000,70000000)',
            'workerType': '@workerType',
            'area': '@region',
            'lmSubsidy': '@natural(100,500)',
            'date': '@date(yyyy-MM)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})
//人事收入项-中途岗位异动差异额
Mock.mock(RegExp('/api/getMvSubsidyData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|12': [{
            'name': '@cname',
            'workerNum': '@natural(10000000,70000000)',
            'moveBeforeJobs':'前端攻城狮',
            'moveAfterJobs':'UI设计',
            'moveBeforeWage': '@natural(10000,15000)',
            'moveAfterWage': '@natural(10000,15000)',
            'moveBeforeHours': '@natural(10,15)',
            'moveAfterHours': '@natural(10,15)',
            'moveTotalWage': '@natural(13000,18000)',
            'operationer': '@cname',
            'operationTime': '@datetime'
        }]
    })
})

//财务系统-应扣款项-调整款项管理
Mock.mock(RegExp('/api/getAdjustTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'adjustType': '公积金',
            'adjustWay': '@adjustWay',
            'adjustMoney': '@natural(10000,15000)',
            'adjustDate': '@date(yyyy-MM)',
            'adjustWhy': '员工已离职，退回',
            'lastOperator': '@cname',
            'lastOperatorTime': '@datetime',
            'value1':'科技部',
            'value2': '代扣调整款项',

        }]
    })
})
//财务系统-代扣款项-调整款项管理
Mock.mock(RegExp('/api/getAdjustDaiTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'adjustDaiType': '@adjustType',
            'adjustWay': '@adjustWay',
            'adjustMoney': '@natural(10000,15000)',
            'adjustDate': '@date(yyyy-MM)',
            'adjustWhy': '员工已离职，退回',
            'lastOperator': '@cname',
            'lastOperatorTime': '@datetime'
        }]
    })
})
//财务系统-月度调整统计
Mock.mock(RegExp('/api/getAdjustMonthTableData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'inTime': '代扣调整款项',
            'workingState': '已提交',
            'adjustMoney': '@natural(10000,15000)',
            'adjustTotal': '@natural(10000,15000)',
            'adjustYearM': '@date(yyyy-MM)',
            'lastOperator': '@cname',
            'lastOperatorTime': '@datetime'
        }]
    })
})
//财务系统-考勤扣款
Mock.mock(RegExp('/api/getAttendanceDedData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'time':'@time',
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'shTime': '@natural(100,500)',
            'sjTime': '@natural(100,500)',
            'allPrize': '@natural(100,500)',
            'overTimeM': '@natural(100,500)',
            'monitoringM': '@natural(100,500)',
            'attendanceM': '@natural(100,500)',
            'remark': '@cparagraph(1)'
        }]
    })
})
//财务系统-行政扣款
Mock.mock(RegExp('/api/getAdministrativeDedData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'time': '@time',
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'cekk': '@natural(100,500)',
            'lhkk': '@natural(100,500)',
            'dkhf': '@natural(100,500)',
            'dkgzf': '@natural(100,500)',
            'hwejf': '@natural(100,500)',
            'tcf': '@natural(100,500)',
            'xzdkk': '@natural(100,500)',
            'remark': '@cparagraph(1)'
        }]
    })
})
//财务系统-五险一金扣款
Mock.mock(RegExp('/api/getFiveSocialDedData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'time': '@time',
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'sbgr': '@natural(100,500)',
            'gjjgr': '@natural(100,500)',
            'sbdw': '@natural(100,500)',
            'gjjdw': '@natural(100,500)',
            'sbgrtz': '@natural(100,500)',
            'gjjtz': '@natural(100,500)',
            'sbdwnm': '永雄',
            'remark': '@cparagraph(1)'
        }]
    })
})

//财务系统-宿舍扣款
Mock.mock(RegExp('/api/getDormitoryDedData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'time': '@time',
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'ssfkk': '@natural(100,500)',
            'remark': '@cparagraph(1)'
        }]
    })
})

//财务系统-绩效扣款
Mock.mock(RegExp('/api/getPerformanceDedData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'time': '@time',
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'jxkh': '@natural(100,500)',
            'tsjx': '@natural(100,500)',
            'nzjl': '@natural(100,500)',
            'remark': '@cparagraph(1)'
        }]
    })
})

//财务系统-孝敬费预存名单
Mock.mock(RegExp('/api/getFilialPietyPrestoreFeeData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'rzsj': '@date(yyyy-MM-dd)',
            'zzsj': '@date(yyyy-MM-dd)',
            'workingState': '@workingState',
            'dyycqsc': '@natural(100,500)',
            'dysjcqsc': '@natural(100,500)',
            'dygrycje': '@natural(100,500)',
            'dygsycje': '@natural(100,500)',
            'jcny': '@date(yyyy-MM)',
            'remark': '@cparagraph(1)'
        }]
    })
})
//财务系统-孝敬费退回名单
Mock.mock(RegExp('/api/getFilialPietyBackFeeData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'rzsj': '@date(yyyy-MM-dd)',
            'zzsj': '@date(yyyy-MM-dd)',
            'workingState': '@workingState',
            'departureTime': '@date(yyyy-MM-dd)',
            'ljyycys': '@natural(0,50)',
            'grljyycje': '@natural(100,500)',
            'jcny': '@date(yyyy-MM)'
        }]
    })
})

//财务系统-孝敬费年度报表
Mock.mock(RegExp('/api/getFilialPietyYearFeeData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'rzsj': '@date(yyyy-MM-dd)',
            'zzsj': '@date(yyyy-MM-dd)',
            'workingState': '@workingState',
            'departureTime': '@date(yyyy-MM-dd)',
            'processingState': '处理状态',
            'ljyycys': '@natural(1,50)',
            'grljyycje': '@natural(100,500)',
            'gsljyfcje': '@natural(100,500)',
            'totalNum': '@natural(1000,5000)',
            'jcny': '@date(yyyy)'
        }]
    })
})

//财务系统-个税管理-每月个税人员采集名单
Mock.mock(RegExp('/api/getTaxListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'phone': '@phone',
            'pNumber': '@natural(100000,500000)',
            'certifcateType': '居民省份证',
            'idCard': '@id',
            'guoji': '中国',
            'csrq': '@date(yyyy-MM-dd)',
            'ryzt': '正常',
            'rzsgcylx': '雇员',
            'rzsgcyrq': '@date(yyyy-MM-dd)',
            'lzsj': '@date(yyyy-MM-dd)',
            'ssqy': '岳阳分公司',
            'jcny': '@date(yyyy-MM)'
        }]
    })
})

//财务系统-个税管理-专项附加扣除信息收集
Mock.mock(RegExp('/api/getTaxInfoListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'certifcateType': '居民省份证',
            'idCard': '@id',
            'sdqjq': '@date(yyyy-MM-dd)',
            'sdqjz': '@date(yyyy-MM-dd)',
            'bqsr': '@natural(1000,5000)',
            'bqmssr': '@natural(1000,5000)',
            'jbylbxf': '@natural(1000,5000)',
            'jboldbxf': '@natural(1000,5000)',
            'sybxf': '@natural(1000,5000)',
            'zfgjj': '@natural(1000,5000)',
            'ljzljy': '@natural(1000,5000)',
            'ljzfdklx': '@natural(1000,5000)',
            'ljzfzj': '@natural(1000,5000)',
            'ljsylr': '@natural(1000,5000)',
            'ljjxjy': '@natural(1000,5000)',
            'qynj': '@natural(1000,5000)',
            'syjkbx': '@natural(1000,5000)',
            'syylbx': '@natural(1000,5000)',
            'zjkcjze': '@natural(1000,5000)',
            'sqkcxmhj': '@natural(1000,5000)',
            'jmse': '@natural(1000,5000)',
            'jcfybz': '@natural(1000,5000)',
            'ykjse': '@natural(1000,5000)',
            'remark': '@cparagraph(1)',
            'operator': '@cname',
            'operatorTime': '@date(yyyy-MM-dd)'
        }]
    })
})

//财务系统-个税管理-每月人员收入情况
Mock.mock(RegExp('/api/getTaxMonthListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'phone': '@phone',
            'pNumber': '@natural(100000,500000)',
            'idCard': '@id',
            'ssqy': '岳阳分公司',
            'bqsr': '@natural(100000,500000)',
            'jcny': '@date(yyyy-MM)'
        }]
    })
})

//财务系统-个税管理-全国填报情况
Mock.mock(RegExp('/api/getTaxNationalListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'ssqy': '岳阳分公司',
            'zxxxdrqk': '未导入',
            'zzgsxtsjdrqk': '已导入',
            'jcny': '@date(yyyy-MM)'
        }]
    })
})

//财务系统-个税管理-每月个税差异对比
Mock.mock(RegExp('/api/getTaxMonthDiffListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'sex': '@sex',
            'iphone': '@iphone',
            'pNumber': '@natural(100000,500000)',
            'certifcateType': '居民身份证',
            'idCard': '@idCard',
            'xtjsgsje': '@natural(1000,5000)',
            'gsxtzzhssj': '@natural(1000,5000)',
            'sybxf': '@natural(1000,5000)',
            'ssqy': '岳阳分公司',
            'jcny': '@date(yyyy-MM)'
        }]
    })
})

//财务系统-个税管理-每月税金计算明细
Mock.mock(RegExp('/api/getTaxMonthDetailsListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'certifcateType': '居民省份证',
            'idCard': '@id',
            'sdqjq': '@date(yyyy-MM-dd)',
            'sdqjz': '@date(yyyy-MM-dd)',
            'bqsr': '@natural(1000,5000)',
            'bqmssr': '@natural(1000,5000)',
            'jbylbxf': '@natural(1000,5000)',
            'jboldbxf': '@natural(1000,5000)',
            'sybxf': '@natural(1000,5000)',
            'zfgjj': '@natural(1000,5000)',
            'ljzljy': '@natural(1000,5000)',
            'ljzfdklx': '@natural(1000,5000)',
            'ljzfzj': '@natural(1000,5000)',
            'ljsylr': '@natural(1000,5000)',
            'ljjxjy': '@natural(1000,5000)',
            'qynj': '@natural(1000,5000)',
            'syjkbx': '@natural(1000,5000)',
            'syylbx': '@natural(1000,5000)',
            'other':'50.00',
            'zjkcjze': '@natural(1000,5000)',
            'sqkcxmhj': '@natural(1000,5000)',
            'jmse': '@natural(1000,5000)',
            'jcfybz': '@natural(1000,5000)',
            'ykjse': '@natural(1000,5000)',
            'remark': '@cparagraph(1)',
            'operator': '@cname',
            'operatorTime': '@date(yyyy-MM-dd)'
        }]
    })
})

//财务系统-个税管理-每月实际税金明细
Mock.mock(RegExp('/api/getTaxMonthActualListData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'name': '@cname',
            'pNumber': '@natural(100000,500000)',
            'certifcateType': '居民省份证',
            'idCard': '@id',
            'sdqjq': '@date(yyyy-MM-dd)',
            'sdqjz': '@date(yyyy-MM-dd)',
            'bqsr': '@natural(1000,5000)',
            'bqmssr': '@natural(1000,5000)',
            'jbylbxf': '@natural(1000,5000)',
            'jboldbxf': '@natural(1000,5000)',
            'sybxf': '@natural(1000,5000)',
            'zfgjj': '@natural(1000,5000)',
            'ljzljy': '@natural(1000,5000)',
            'ljzfdklx': '@natural(1000,5000)',
            'ljzfzj': '@natural(1000,5000)',
            'ljsylr': '@natural(1000,5000)',
            'ljjxjy': '@natural(1000,5000)',
            'qynj': '@natural(1000,5000)',
            'syjkbx': '@natural(1000,5000)',
            'syylbx': '@natural(1000,5000)',
            'other': '50.00',
            'zjkcjze': '@natural(1000,5000)',
            'sqkcxmhj': '@natural(1000,5000)',
            'jmse': '@natural(1000,5000)',
            'jcfybz': '@natural(1000,5000)',
            'ykjse': '@natural(1000,5000)',
            'remark': '@cparagraph(1)',
            'operator': '@cname',
            'operatorTime': '@date(yyyy-MM-dd)'
        }]
    })
})

//人事收入项设置
Mock.mock(RegExp('/api/getIncomeItemsSettingData' + '.*'), 'get', () => {
    return Mock.mock({
        'dataTable|15': [{
            'index|+1': 1,
            'area': '@region',
            'cb': '@natural(100,500)',
            'zfbt': '@natural(100,500)',
            'sbbt': '@natural(100,500)',
            'operator': '@cname',
            'operatorTime': '@date(yyyy-MM-dd)'
        }]
    })
})

const functionTableData = require('../json/functionTableData.json')
Mock.mock(RegExp('/api/getFunctionTableData' + '.*'), 'get', () => {
    return functionTableData
})

const businessTableData = require('../json/businessTableData.json')
Mock.mock(RegExp('/api/getBusinessTableData' + '.*'), 'get', () => {
    return businessTableData
})

const allTableData = require('../json/allTableData.json')
Mock.mock(RegExp('/api/getAllTableData' + '.*'), 'get', () => {
    return allTableData
})

const formulaTableData = require('../json/formulaTableData.json')
Mock.mock(RegExp('/api/getFormulaTableData' + '.*'), 'get', () => {
    return formulaTableData
})
const initSalaryTableData = require('../json/initSalaryTableData.json')
Mock.mock(RegExp('/api/getInitSalaryTableData' + '.*'), 'get', () => {
    return initSalaryTableData
})
