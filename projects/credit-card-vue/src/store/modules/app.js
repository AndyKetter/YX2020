/* eslint-disable no-console */
// app modules
import Http from '../../http/index' //导入axios请求库
import { Message } from 'element-ui'

export default {
    namespaced: true,
    state: {
        context: ''
    },
    mutations: {
        saveAdvice(state, payload) { //保存意见反馈
            if (payload.Code ==0) {
                Message({
                    type: 'success',
                    message:'温馨提示：添加意见反馈成功！'
                })
                state.context = ''
            } else { //新增失败
                Message({
                    type: 'warning',
                    message: '温馨提示：添加意见反馈失败！'
                })
            }
        },
        updateContext(state, context) { //同步更新context到vuex state
            state.context = context
        }
    },
    actions: {
        saveAdvice({ //保存意见反馈
            commit
        }, payload) {
            Http.postParams("/oa-card/newCardSuggest/save", payload).then(res=>{
                commit('saveAdvice', res)
            })
        }
    }
}