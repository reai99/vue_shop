import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/rights.vue')
// import Roles from '../components/power/roles.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/roles.vue')

// import Cate from '../components/goods/cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_roles" */ '../components/goods/cate.vue')
// import Params from '../components/goods/params.vue'
const Params = () => import(/* webpackChunkName: "cate_roles" */ '../components/goods/params.vue')

// import List from '../components/goods/list.vue'
const List = () => import(/* webpackChunkName: "list_goodsAdd" */ '../components/goods/list.vue')
// import goodsAdd from '../components/goods/add.vue'
const goodsAdd = () => import(/* webpackChunkName: "list_goodsAdd" */ '../components/goods/add.vue')

// import Orderlist from '../components/order/list.vue'
const Orderlist = () => import(/* webpackChunkName: "order_reports" */ '../components/order/list.vue')
// import Reports from '../components/statistics/reports.vue'
const Reports = () => import(/* webpackChunkName: "order_reports" */ '../components/statistics/reports.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: goodsAdd },
      { path: '/orders', component: Orderlist },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫 to表示将要访问的路径 from 从那个路径跳转而来 next谁函数，表示放行
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
