import styles from './_layout.css';

export default function(props) {
  return (
    <div className={styles.normal}>
      <h1> Page 嵌套路由 </h1>
      <div>{props.children}</div>
    </div>
  );
}
