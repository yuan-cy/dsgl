import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [{
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/Home',
            name: 'Home',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import ( /* webpackChunkName: "about" */ '../views/Home.vue'),
            children: [{
                    path: '/',
                    redirect: 'userList'
                },
                {
                    path: 'userList',
                    component: () =>
                        import ('../components/userList.vue')
                },

            ]
        }
    ]
    //挂载路由导航守卫

const router = new VueRouter({
    routes
})

export default router