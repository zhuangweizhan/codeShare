//渲染routerView组件
const routerView = {
  name: 'RouterView',
  render(h) {
    const currentPath = this._self._routerRoot._router.currentObj.path;
    const routeMap = this._self._routerRoot._router.routesMap;
    return h(routeMap[currentPath])
  }
}

//渲染routerLink组件
const routerLink = {
  name: 'RouterLink',
  props: {
    to: String
  },
  render(h) {
    const isHashMode = this._self._routerRoot._router.isHashMode;
    return h('a', {
      attrs: {
        href: ( isHashMode? "#" : "") + this.to
      }
    }, this.$slots.default)
  }
}

class VueRouter {

  constructor(options) {
    this.isHashMode = !( options.mode == "history" );//只要不是history模式，其他均为hash模式
    this.routes = options.routes || [];//存储路由地址
    this.routesMap = this.getRoutesMap(this.routes);
    this.currentObj = { path: '' };
    this.initListener()
  }

  initListener() {
    //hash模式以hash为准，history以pathname为准,且为空时默认为/
    const initPath = ( this.isHashMode ? location.hash.slice(1) : location.pathname ) || "/";
    const listName =  this.isHashMode ? "hashchange": "popstate";//监听的对象名称，hash模式监听hashchange，history监听popstate
    window.addEventListener("load", () => {
      this.currentObj.path = initPath;
    })
    window.addEventListener( listName, () => {
      this.currentObj.path =  ( this.isHashMode ? location.hash.slice(1) : location.pathname ) || "/";;
    })
  }

  getRoutesMap(routes) {
    return routes.reduce((pre, current) => {
      pre[current.path] = current.component
      return pre;
    }, {})
  }

}

VueRouter.install = function (v) {
  v.mixin({
    beforeCreate() {
      if (this.$options && this.$options.router) { // 如果是根组件
        this._routerRoot = this; //把当前实例挂载到_root上
        this._router = this.$options.router;
        v.util.defineReactive(this, '_route', this._router.currentObj); // 来实现双线绑定
      } else { //如果是子组件
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }

      Object.defineProperty(this, '$router', {
        get() {
          return this._routerRoot._router;
        }
      });

      Object.defineProperty(this, '$route', {
        get() {
          return this._routerRoot._route;
        }
      })
    }
  });

  v.component('RouterLink', routerLink);
  v.component('RouterView', routerView);

}

export default VueRouter;