<template>
    <!-- 员工组织关系-个人信息组件 -->
    <div class="grid-content bg-purple">
        <span class="grid-department">个人信息</span>
        <div class="item-table">
            <table border="1" cellspacing="0" cellpadding="0" class="dTable">
            <tr>
                <td style="width:20%">姓名</td>
                <td style="width:30%">张伟</td>
                <td style="width:20%">性别</td>
                <td style="width:30%">男</td>
            </tr>
            <tr>
                <td >员工编号</td>
                <td >8190402006</td>
                <td >所属级别</td>
                <td >组员</td>
            </tr>
            <tr>
                <td> 隶属单位</td>
                <td colspan="3">智慧催</td>
            </tr>
            <tr>
                <td>所属部门</td>
                <td>科技部</td>
                <td>所属职务</td>
                <td>前端开发</td>
            </tr>
            <tr>
                <td>组织关系</td>
                <td colspan="3">谭曼-周雄-甘献-张伟</td>
            </tr>
            <tr>
                <td>直接上级</td>
                <td colspan="3">甘献</td>
            </tr>
            <tr>
                <td style="width:20%">在职状态</td>
                <td style="width:30%">在职</td>
                <td style="width:20%">入职日期</td>
                <td style="width:30%">2019-04-02</td>
            </tr>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name:'personalInfo',
    props: {
        personalInfoObj:{
            type:Object,
            required:true,
            default:{
            // name:'暂无姓名',
            personalInfo:{}

            }
        }
  }
}
</script>

<style scoped>
    /* 数据表 */
    .bg-purple {
        background: #F5F7FA;
    }

    .grid-content {
        min-height: 36px;
        border: 1px solid #E2E5EF;
        position: relative;
        padding: 5px;
    }

    .pot {
        width: 12px;
        height: 12px;
        display: block;
        border-radius: 50%;
        position: absolute;
        left: 7px;
        top: 12px;
        z-index: 10;
    }

    .grid-department {
        font-size: 14px;
        color: #24282F;
        letter-spacing: 0.88px;
        line-height: 26px;
        margin-left: 17px;
    }

    .grid-btn {
        float: right;
        margin-right: 5px;
        cursor: default;
    }

    table.dTable {
        border-collapse: collapse;
        width: 100%;
        border: 1px solid #C6CCDD;
        background-color: #fff;
    }

    table.dTable tr th,
    table.dTable tr td {
        border: 1px solid #C6CCDD;
        padding-left: 10px;
        height: 40px;
        color: #000;
        font-size: 13px;
        text-align: left;
        font-weight: 500;
    }

    table.dTable tr.thead {
        background-color: #E5E9F3;
    }

    table.dTable tr.thead th {
        color: #60646C;
    }
</style>
