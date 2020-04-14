/* eslint-disable no-console */
//根级别action
export default {
    increment ({commit,state,rootState},payload){
        //{commit,state,rootState,dispatch}可以注入dispatch参数来在action发异步action
        //在根action,局部state与根rootState是一样的，都是指向整个state树,payload为负载
        console.log('局部state', state)
        console.log('根rootState', rootState)
        commit('add',payload)
    }
}