import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'

import Print from 'vue-print-nb'
Vue.use(Print); //注册

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'



//配置请求的基准地址
axios.defaults.baseURL = 'http://39.98.73.4:8888/api/private/v1'

//axios请求拦截器
axios.interceptors.request.use(config => {

    //为请求对象comfig,添加token验证的Authorization
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
}, function (err) {
    console.log(err);
})
// axios响应拦截器
/*axios.interceptors.response.use(res => {
    //在这里对返回的数据进行加工和处理
   var data=res.data;//使用了响应拦截器，那么在后面的后台请求返回的data就是真的data数据
    return res
}, function (err) {
    console.log(err);
})*/

//挂载axios
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
