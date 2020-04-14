import React,{useState} from "react"
// import styles from "../lib/css/about.module.css" // 将 css modules 文件导入为 styles

function FancyBorder(props) {
  return (
    <div className={"FancyBorder FancyBorder-" + props.color}>
      {props.children}
    </div>
  )
}

function About() {
  const[count,setCount] = useState(0)
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">Welcome</h1>
      <p className="Dialog-message">Thank you for visiting our spacecraft!</p>
      <p>{count}</p>
      <button onClick={()=>setCount(count+1)}>Click me</button>
    </FancyBorder>
  )
}

export default About
