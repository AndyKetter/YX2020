import React, { Component } from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import "./lib/css/index.css"
import App from "./components/App.jsx" // 导入App组件
import About from "./components/About.jsx" // 导入About组件
import Inbox from "./components/Inbox.jsx" // 导入Inbox组件
import * as serviceWorker from "./serviceWorker"

export default class Hello extends Component {
  render() {
    return (
      <Router>
        <div>
          <div>{new Date().toLocaleTimeString()}</div>
          <ul className="nav">
            <li>
              <Link to="/">App</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>
              <Link to="/Inbox">Inbox</Link>
            </li>
          </ul>
          <hr />
          <Route exact path="/" component={App} />
          <Route path="/About" component={About} />
          <Route path="/Inbox" component={Inbox} />
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<Hello />, document.getElementById("root"))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
