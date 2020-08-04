let Vue;

function install(_Vue, storeName = '$store') {
    Vue = _Vue;
    Vue.mixin({
        beforeCreate() {
            if (this.$options.store) {
                Vue.prototype[storeName] = this.$options.store;
            }
        }
    })
}

class Store {
    constructor(options) {
        let {
            state = {}, getters = {}, mutations = {}, actions = {}, modules = {}
        } = options;
        for (var key in modules) {
            state = {
                ...state,
                ...modules[key].state
            }
            mutations = Object.assign(mutations, modules[key].mutations);
            getters = {
                ...getters,
                ...modules[key].getters
            };
            actions = Object.assign(actions, modules[key].actions);
        }
        this.state = new Vue({
            data: state
        });
        this.actions = actions;
        this.mutations = mutations;
        this.allGetters = getters;
        this.observerGettersFunc(getters);
    }

    // 触发mutations，需要实现commit
    commit = (type, arg) => {
        const fn = this.mutations[type] 
        fn(this.state, arg)
    }

    // 触发action，需要实现dispatch
    dispatch = (type, arg) => {
        const fn = this.actions[type]
        return fn({
            commit: this.commit,
            state: this.state
        }, arg)
    }

    //数据劫持getters
    observerGettersFunc(getters) {
        this.getters = {} // store实例上的getters
        Object.keys(getters).forEach(key => {
            Object.defineProperty(this.getters, key, {
                get: () => {
                    console.log(`retrunValue:` + JSON.stringify(this.state.$data));
                    return getters[key](this.state)
                }
            })
        })
    }
}

export default {
    Store,
    install
}