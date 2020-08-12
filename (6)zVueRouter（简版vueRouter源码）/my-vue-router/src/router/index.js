import Vue from 'vue'
// import Router from 'vue-router'
import Router from '../vue-router/index.js'
import First from '@/components/First'
import Second from '@/components/Second'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'First',
      component: First
    },
     {
       path: '/Second',
       name: 'Second',
       component: Second
     }
  ]
})
