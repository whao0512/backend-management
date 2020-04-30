import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import config from './config/index'
import comFun from './utils/commonFun.js'
// 引用API文件
import api from './api/index.js'   //切换环境js

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import './errorLog' // error log
// import '@/permission' // permission control

import * as filters from './filters' // global filters
Vue.prototype.imgHost = process.env.NODE_ENV === 'development' ? config.imgHost.dev : config.imgHost.prod
Vue.prototype.comFun = comFun
Vue.prototype.$api = api

Vue.use(ElementUI, { locale })

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
