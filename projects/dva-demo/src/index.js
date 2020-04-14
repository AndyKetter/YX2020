import dva from "dva"
// import createLoading from "dva-loading"
import "./index.css"

// 1. Initialize  这里初始化的state优先级最高  会覆盖局部models中state
const app = dva({
    initialState: {
        test: 8
    },
    onError(e, dispatch) {
        //统一错误处理
        console.log(e.message)
    }
})

// 2. Plugins
// app.use(createLoading())

// 3. Model
app.model(require("./models/products").default)
app.model(require("./models/test").default)

// 4. Router
app.router(require("./router").default)

// 5. Start
app.start("#root")