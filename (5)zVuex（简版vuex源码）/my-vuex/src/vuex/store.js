import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from './myVuex'
import otherModel from './moduels/other-model'
import userModel from './moduels/user-model'

Vue.use(Vuex);
var store = new Vuex.Store({
    modules: {
        userModel,
        otherModel
    },
})

export default store;