import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'
import home from '../views/home.vue'
import welcome from '../views/welcome.vue'
import users from '../components/user/users.vue'
Vue.use(VueRouter)

const routes = [{
            path: '/',
            component: login
        },
        // 主页
        {
            path: '/home',
            component: home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: welcome },
                { path: '/users', component: users },
                {
                    path: '/roles',
                    component: () =>
                        import ('./../components/roles/roles.vue')
                },
                {
                    path: '/rights',
                    component: () =>
                        import ('./../components/rights/rights.vue')
                },
                {
                    path: '/categories',
                    component: () =>
                        import ('./../components/categories/categories.vue')
                },
                {
                    path: '/orders',
                    component: () =>
                        import ('./../components/orders/orders.vue')
                },
                {
                    path: '/reports',
                    component: () =>
                        import ('./../components/reports/reports.vue')
                },
            ]
        },
        //权限


    ]
    //挂载路由导航守卫

const router = new VueRouter({
    routes
})

export default router