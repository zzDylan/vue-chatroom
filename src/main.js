// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VeeValidate from 'vee-validate'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.use(VeeValidate)
Vue.use(MintUI)

router.beforeEach((to, from, next) => {
    if (to.meta.requiredLogin) {  // 判断该路由是否需要登录权限
        if (localStorage.getItem('token')) {  // 获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                //query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
