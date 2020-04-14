/* eslint-disable no-console */
//根级别mutation
export default {
    add(state,payload){
        //这里state也为根state
        console.log('mutationState', state)
        state.rootState += payload.n
    }
}