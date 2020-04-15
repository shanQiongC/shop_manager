import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'

import axios from 'axios'

import Print from 'vue-print-nb'
Vue.use(Print); //注册

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入复文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入复文本样式


//导入进度条
import NProgress from 'nprogress'



// let _ = require('lodash')

//配置请求的基准地址
//axios.defaults.baseURL = 'http://39.98.73.4:8888/api/private/v1'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

//axios请求拦截器
//在拦截器中，展示进度条  NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start()
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

//在拦截器中，隐藏进度条  NProgress.start()
axios.interceptors.response.use(res => {
    NProgress.done()
    return res
}, function (err) {
    console.log(err);
})


//挂载axios
Vue.prototype.$http = axios
// import VeHistogram from "v-charts/lib/histogram.common"
// Vue.component(VeHistogram.name, VeHistogram)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.component('tree-table', TreeTable)
//将复文本导入为全局组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (orignval) {
    const date = new Date(orignval)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2, '0')
    const d = (date.getDate() + '').padStart(2, '0')
    const hh = (date.getHours() + '').padStart(2, '0')
    const mm = (date.getMinutes() + '').padStart(2, '0')
    const ss = (date.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
