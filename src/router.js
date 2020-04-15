import Vue from 'vue'
import Router from 'vue-router'

// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
//路由懒加载的方式
const Login = () => import( /* webpackChunkName: "login_home_welcom" */ './components/Login.vue')
const Home = () => import( /* webpackChunkName: "login_home_welcom" */ './components/Home.vue')
const Welcome = () => import( /* webpackChunkName: "login_home_welcom" */ './components/Welcome.vue')


// import Users from './components/user/Users.vue'
// import Roles from './components/role/Roles.vue'
// import Rights from './components/role/Rights.vue'
const Users = () => import( /* webpackChunkName: "user_role_right" */ './components/user/Users.vue')
const Roles = () => import( /* webpackChunkName: "user_role_right" */ './components/role/Roles.vue')
const Rights = () => import( /* webpackChunkName: "user_role_right" */ './components/role/Rights.vue')


// import Goods from './components/good/Goods.vue'
// import Add from './components/good/Add.vue'
// import EditGoodInfo from './components/good/EditGoodInfo.vue'
// import Params from './components/good/Params.vue'
// import Categories from './components/good/Categories.vue'
const Goods = () => import( /* webpackChunkName: "Good" */ './components/good/Goods.vue')
const Add = () => import( /* webpackChunkName: "Good" */ './components/good/Add.vue')
const EditGoodInfo = () => import( /* webpackChunkName: "Good" */ './components/good/EditGoodInfo.vue')
const Params = () => import( /* webpackChunkName: "Good" */ './components/good/Params.vue')
const Categories = () => import( /* webpackChunkName: "Good" */ './components/good/Categories.vue')

// import Orders from './components/order/Orders.vue'
// import Reports from './components/report/Reports.vue'
const Orders = () => import( /* webpackChunkName: "order_report" */ './components/order/Orders.vue')
const Reports = () => import( /* webpackChunkName: "order_report" */ './components/report/Reports.vue')


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
            component: Home,
            redirect: '/welcome',
            children: [{
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: Users
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/goods',
                    component: Goods
                },
                {
                    path: '/goods/add',
                    component: Add
                },
                {
                    path: '/goods/edit/:id',
                    component: EditGoodInfo
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/categories',
                    component: Categories
                },
                {
                    path: '/orders',
                    component: Orders
                },
                {
                    path: '/reports',
                    component: Reports
                }
            ]
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
