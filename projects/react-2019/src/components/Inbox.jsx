/* eslint-disable react/react-in-jsx-scope */
import React, { Component } from "react";

export default class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }
  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  componentWillMount() {} //17版本可能会弃用，ajax请在componentDidMount中发
  tick() {
    this.setState((state, props) => ({
      date: new Date()
    }));
  }
  render() {
    return (
      <div className="inbox">
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        <h3>{this.props.color}</h3>
      </div>
    );
  }
}

Inbox.defaultProps = {
  color: "blue"
};
