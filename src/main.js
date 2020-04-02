import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config)
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
