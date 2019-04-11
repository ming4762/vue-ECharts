// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import '../lib/static/css/app.css'
// import 'element-ui/lib/theme-chalk/index.css'
// import VueComponentsLib from '../src/index'
// import VueComponentsLib from '../lib/vueComponentsLib.min.js'
// Vue.use(VueComponentsLib)
/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
