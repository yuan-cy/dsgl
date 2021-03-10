    import Vue from 'vue'
    import App from './App.vue'
    import router from './router'
    import store from './store'
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    // import './assets/iconfont.css'
    Vue.use(ElementUI)
        //axios
    import axios from 'axios'

    import VueAxios from 'vue-axios'

    Vue.use(VueAxios, axios)


    // axios.defaults.baseURL = 'http://192.168.1.30:8888/api/private/v1/'
    // Vue.prototype.$http = axios
    Vue.config.productionTip = false
        //拦截器
        // 添加请求拦截器
    axios.interceptors.request.use(function(config) {
        // 在发送请求之前做些什么
        let token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token
        }
        return config;
    }, function(error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function(response) {
        // 对响应数据做点什么

        if (response.data.status == 400) {
            router.replace('/')
        }
        return response.data;
    }, function(error) {
        // 对响应错误做点什么
        return Promise.reject(error);
    });
    //挂载路由导航守卫
    router.beforeEach((to, from, next) => {
            if (to.path === '/') return next()
            const tokenStr = window.sessionStorage.getItem('token')
            if (!tokenStr) return next('/')
            next()
        }),

        new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')