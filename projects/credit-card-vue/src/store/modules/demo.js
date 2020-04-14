/* eslint-disable no-console */
// demo modules
export default {
    namespaced: true,
    state: {
        count: 1,
        a: 5
    },
    mutations: {
        increment(state, payload) {
            state.count += payload.n
        }
    },
    getters: {
        doubleCount(state) {
            return state.count * 2
        }
    },
    actions: {
        incrementIfOdd({
            rootState,
            state,
            commit
        }, payload) {
            console.log('局部state', state)
            console.log('根rootState', rootState)
            commit('increment', payload)
        }
    },
    modules: {
        myPage: {
            namespaced: true,
            state: {
                page: 'page888mapState'
            },
            actions: {
                //->dispatch('demo/myPage/page')
                page({
                    rootState,
                    state
                }) {
                    console.log('myPage局部state', state)
                    console.log('myPage根rootState', rootState)
                }
            },
            getters: {
                profile(state) { //->getters[demo/myPage/profile]
                    return state.page + 'profile'
                }
            }
        },
        myPost: {
            state: {
                post: 5
            },
            actions: {
                //继承父级的命名空间
                post({
                    rootState,
                    state
                }) {
                    console.log('myPost局部state', state)
                    console.log('myPost根rootState', rootState)
                }
            },
            getters: {
                //继承父级的命名空间
                profile(state) { //->getters[demo/profile]
                    return state.post * 2
                }
            }
        }
    }
}