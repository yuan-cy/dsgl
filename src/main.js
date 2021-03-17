    import Vue from 'vue'
    import App from './App.vue'
    import router from './router'
    import store from './store'
    import ElementUI from 'element-ui';
    import 'element-ui/lib/theme-chalk/index.css';
    import glob from './assets/glob.css'
    //导入vue tree类型
    import treeTable from 'vue-table-with-tree-grid'
    Vue.component('tree-table', treeTable)

    // import './assets/iconfont.css'
    Vue.use(ElementUI, glob)


    //axios
    import axios from 'axios'

    import VueAxios from 'vue-axios'

    Vue.use(VueAxios, axios)


    // axios.defaults.baseURL = 'http://192.168.1.30:8888/api/private/v1/'
    // Vue.prototype.$http = axios
    Vue.config.productionTip = false
        //拦截器
        // 添加请求拦截器
    axios.interceptors.request.use((res) => {
        // console.log(res);
        // 在发送请求之前做些什么
        let token = sessionStorage.getItem('token');
        if (token) {
            // res.headers.Authorization = token
            res.headers.Authorization = window.sessionStorage.getItem('token')
        }
        return res;
    }, (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 添加响应拦截器
    axios.interceptors.response.use(function(response) {
        // 对响应数据做点什么

        if (response.data.status == 200) {
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
        /*在使用过滤器的时候可以在后面加括号 {{time|filter|filter可以多次过滤(在前一个过滤完后再过滤)}}*/
    Vue.filter('dateFormat', function(value, fmStr) {
        let date = new Date(value);
        let year = date.getFullYear();
        let month = date.getMonth() + 1 + '';
        let day = date.getDate() + '';
        let hour = date.getHours() + '';
        let minute = date.getMinutes() + '';
        let second = date.getSeconds() + '';
        // console.log(date);
        if (fmStr && fmStr === 'yyyy-MM-dd') {
            return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`
        }
        return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')} ${hour.padStart(2,'0')}:${minute.padStart(2,'0')}:${second.padStart(2,'0')}`
    })