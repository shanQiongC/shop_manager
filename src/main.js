import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

axios.defaults.baseURL = 'http://39.98.73.4:8888/api/private/v1'

//axios请求拦截
axios.interceptors.request.use(config => {
    //为请求对象comfig,添加token验证的Authorization
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
})

//挂载axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
