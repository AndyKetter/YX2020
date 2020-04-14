import React, { Component } from "react"
import PropTypes from "prop-types"
import { connect } from "dva"
import { Table, Popconfirm, Button } from "antd"
// import { routerRedux } from "dva/router"

// dva不像vuex是一个全局store,你想要链接state全局哪一个属性值得明确写出connect,然后connect函数会默认注入dispatch
@connect(({ test }) => ({
  test
}))
class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = { ppp: "46464" }
  }
  componentDidMount() {
    console.log(this.props)
    // setTimeout(() => {
    //   this.props.dispatch(routerRedux.push("/"))
    // }, 5000)
  }
  onDeleteTT(id) {
    //通过connect test后获取到dispatch就可以直接dispatch action
    this.props.dispatch({
      type: "products/delete",
      payload: id
    })
  }
  render() {
    const columns = [
      {
        title: "名字",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "操作",
        render: (text, record) => {
          return (
            <Popconfirm title="确定删除?" onConfirm={() => this.props.onDelete(record.id)}>
              <Button>删除</Button>
            </Popconfirm>
          )
        }
      }
    ]
    return (
      <div>
        <div>
          <Button onClick={() => this.props.onGetUserInfo(5)}>测试</Button>
        </div>
        <div>{this.props.products.userInfo.username}</div>
        <div>{this.props.products.userInfo.age}</div>
        <div>{this.props.test}</div>
        <Table dataSource={this.props.products.productsList} columns={columns} />
      </div>
    )
  }
}

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onGetUserInfo: PropTypes.func.isRequired,
  products: PropTypes.object.isRequired
}

export default ProductList
