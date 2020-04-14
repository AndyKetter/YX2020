import React, { Component } from "react"
import { connect } from "dva"
import ProductList from "../components/ProductList"
import Test from "../components/Test"
import { Route } from "dva/router"

//修饰符connect写法
@connect(({ products }) => ({
  products
}))
class Products extends Component {
  constructor(props) {
    super(props)
    this.state = { title: "List of Products" }
    this.handleDelete = this.handleDelete.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
  }
  static defaultProps = {
    name: "彭坤"
  }
  handleDelete(id) {
    this.props.dispatch({
      type: "products/delete",
      payload: id
    })
  }
  getUserInfo(id) {
    this.props.dispatch({
      type: "products/userDetail",
      payload: id
    })
  }
  componentDidMount() {
    console.log("================父组件调用子组件的方法与获取子组件的props与state====================")
    console.log(this.refs.test.state.ppp)
    // this.refs.test.props.onDelete(1)
    console.log("====================================")
    console.log("kkk", this.props)
  }
  render() {
    return (
      <div>
        <h2>
          {this.state.title}
          {this.props.name}
        </h2>
        <Route path="/products/test" component={Test} />
        <ProductList ref="test" onGetUserInfo={this.getUserInfo} onDelete={this.handleDelete} products={this.props.products} />
      </div>
    )
  }
}
// Products.defaultProps = {
//   age: 99
// }

export default Products

// 第一种connect写法
// const mapStateToProps = (state, ownProps) => {
//   console.log("dva全局state", state)
//   return {
//     products: state.products
//   }
// }
// export default connect(mapStateToProps)(Products)

// 第二种connect写法
// 这里的products相当与传products state进来(通过products解构赋值全局state)，把namespace为products的state通过解构赋值注入到Products主件并附带dispatch,state与dispatch都是挂在Products组件props上而形成容器组件
// export default connect(({ products }) => ({
//   products
// }))(Products)
