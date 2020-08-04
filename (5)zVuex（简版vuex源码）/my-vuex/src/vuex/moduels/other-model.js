const state = {
    status: '欢迎小姑凉', //
}

const getters = {
    getStatus(state) {
        return state.status;
    }
}

const mutations = {
    changeStatus(state, status) {
        // alert("status=" + status);
        state.status = status;
        // console.log("changeStatus=" + JSON.stringify( state));
    }
}

const actions = {
    changeStatusActions({commit}, value) { // 参数解构，拿到上下文
        setTimeout(() => {
            commit('changeStatus', value);
        }, 1000);
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}