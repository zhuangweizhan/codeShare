const state = {
    name: '前端小伙', //
    url: 'https://juejin.im/user/5e8fddc9e51d4546be39a558', //
}

const getters = {
    getName(state) {
        return state.name;
    },
    getUrl(state) {
        return state.url;
    }
}

const mutations = {
    setName( value ){
        this.state.name = value;
    }
}

const actions = {
    setNameActions({commit}, value){
        setTimeout(() => {
            commit('setName', value );
        }, 500 );
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
