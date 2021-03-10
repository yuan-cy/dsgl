import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: ()=>import('../views/login.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: ()=>import('../views/login.vue')
  },
  {
    path: '/Home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children:[
      {
        path:'/',
        redirect:'userList'
      },
      {
        path:'userList',
        component:()=>import('./../components/userList.vue')
      },
      {
        path:'addUser',
        component:()=>import('./../components/addUser.vue')
      },
      {
        path:'removeUser',
        component:()=>import('./../components/removeUser.vue')
      },
    ]
  }
]



const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行 next('/login') 强行跳转
  if(to.path ==='/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router