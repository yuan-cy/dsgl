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
        redirect:'welcom'
      },
      {
        path:'welcom',
        component:()=>import('./../components/welcom.vue')
      },
      {
        path:'users',
        component:()=>import('./../components/users.vue')
      },
      {
        path:'rights',
        component:()=>import('./../components/power/Rights.vue')
      },
      {
        path:'roles',
        component:()=>import('./../components/power/Roles.vue')
      },
      {
        path:'categories',
        component:()=>import('./../components/goods/Cate.vue')
      },
      {
        path:'params',
        component:()=>import('./../components/goods/Params.vue')
      },
      {
        path:'goods',
        component:()=>import('./../components/goods/Goods.vue')
      }, 
      {
        path:'add',
        component:()=>import('./../components/goods/add.vue')
      }, 
      {
        path:'reports',
        component:()=>import('./../components/report/Reports.vue')
      },
      {
        path:'orders',
        component:()=>import('./../components/orders/orders.vue')
      }

     
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