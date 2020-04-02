import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'


//组件模块
Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        }, /**，访问localhost：8080路径时重定向到登录页面 */
        {
            path: '/login',
            component: Login
        }, {
            path: '/home',
            component: Home
        }

    ]
})

/*
路由导航守卫控制访问权限
如果用户没有登录，但是直接通过URL访问特定页面，需要重新导航到登录页面


*/

// 挂载路由导航守卫 为路由对象，添加beforEach导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next() 是一个函数表示放行     next('/login') 强制跳转

    //如果访问登录页，直接放放行
    if (to.path === '/login') return next()
    // 从sessionStorage中获取token,如果token存在证明已经登录，可以放行；如果token不存在，强制跳转到登录页面
    const tokenStr = window.sessionStorage.getItem('token')
    //没有token，强制跳转到登录页面
    if (!tokenStr) return next('/login')
    next()
})



export default router;
