import { queryUsers } from "../services/user"
export default {
    namespace: "products",
    state: {
        userInfo: { username: "test", age: "test" },
        productsList: [{ key: "1", name: "dva1", id: 1 }, { key: "2", name: "antd2", id: 2 }, { key: "3", name: "dva3", id: 3 }, { key: "4", name: "antd4", id: 4 }, { key: "5", name: "dva5", id: 5 }, { key: "6", name: "antd6", id: 6 }, { key: "7", name: "dva7", id: 7 }, { key: "8", name: "antd8", id: 8 }, { key: "9", name: "dva9", id: 9 }, { key: "10", name: "antd10", id: 10 }, { key: "11", name: "dva11", id: 11 }, { key: "12", name: "antd12", id: 12 }, { key: "13", name: "antd13", id: 13 }, { key: "14", name: "dva14", id: 14 }, { key: "15", name: "antd15", id: 15 }, { key: "16", name: "dva16", id: 16 }, { key: "17", name: "antd17", id: 17 }]
    },
    reducers: {
        delete(state, action) {
            console.log("局部state,就是上面定义的state", state)
            console.log("action", action)
            let productsListCount = state.productsList.filter(item => item.id !== action.payload)
            let productsList = { productsList: productsListCount }
            return {
                ...state,
                ...productsList
            }
        },
        // delete(state, { payload: id }) {
        //     return state.filter(item => item.id !== id)
        // }
        getUserInfo(
            state, {
                payload: { data }
            }
        ) {
            console.log("state", state)
            return {
                ...state,
                ...data
            }
        }
    },
    effects: {
        * userDetail({ payload: userId }, { call, put, select }) {
            const result = yield call(queryUsers, userId)
            console.log(result)
            const test = yield select(state => state.test)
            console.log("select test", test)
            yield put({
                type: "getUserInfo",
                payload: {
                    data: result.data.data
                }
            })
        }
    }
}