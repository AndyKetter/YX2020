import React, { Component } from "react" //导入react相关内置方法class
import { DatePicker, message, ConfigProvider } from "antd" //导入antd组件
import zhCN from "antd/es/locale/zh_CN"
import moment from "moment"
import "moment/locale/zh-cn"
// import "antd/dist/antd.css" //导入antd全部样式，如果是配置了按需加载就不需要这么引入,这行就可以注释，因为比如 import {Button}就已经按需加载了button相关css
moment.locale("zh-cn")

export default class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = { date: null }
  }
  handeChange = date => {
    this.setState(
      {
        date
      },
      function() {
        console.log("react")
      }
    )
    message.info(`${this.props.text}：${date ? date.format("YYYY-MM-DD") : "未选择"}`)
  }
  componentDidMount() {}
  componentWillUnmount() {}
  render() {
    const { date } = this.state
    return (
      <ConfigProvider locale={zhCN}>
        <div style={{ width: 400, margin: "100px auto" }}>
          <DatePicker onChange={this.handeChange} />
          <div style={{ marginTop: 20 }}>当前日期：{date ? date.format("YYYY-MM-DD") : "未选择"}</div>
        </div>
      </ConfigProvider>
    )
  }
}

Demo.defaultProps = {
  text: "你选择的日期是"
}
