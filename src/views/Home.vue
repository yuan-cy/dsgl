    <template>
    <div class="home-container">
<el-container class="home-container">
            <!-- 头部信息 -->
  <el-header>
      <div>
          <span>电商后台管理系统</span>
      </div>
<el-button type='info' @click="logout">退出</el-button></el-header>
  <el-container>
      <!-- 侧边栏 -->
    <el-aside :width="isshow ? '64px' :'200px'">
        <div class="toggle-button" @click="toggleBtn">|||</div>
         <el-menu
    
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
    unique-opened
    :collapse='isshow'
    :collapse-transition='false'
    :router='true'
    :default-active='$router.path'
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id +''" v-for='item in menusList' :key='item.id'>
          <!-- 一级菜单模板 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconobj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
             </template>
             <!-- 二级菜单 -->
            <el-menu-item :index='"/"+subItem.path' v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.authName}}</span>
                </template>
            </el-menu-item>
                </el-submenu>
                </el-menu>
                </el-aside>
    <!-- 右侧 -->
    <el-main>
        <!--路由占位符 -->
        <router-view></router-view>
        </el-main>
  </el-container>
</el-container>

    </div>
    
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
            users:[
                {pagenum:2},
                {pagesize:2}
            ],
            menusList:[],
            iconobj:{
            '125':'iconfont el-icon-s-custom',
            '103':'iconfont el-icon-warning',
            '101':'iconfont el-icon-s-goods',
            '102':'iconfont el-icon-s-order',
            '145':'iconfont el-icon-s-platform',
            },
            isshow:false
        };
    },
    methods: {
        //退出登录
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/')
        },
        //点击按钮 切换折叠与展开
        toggleBtn(){
            this.isshow=!this.isshow
        }
    },
    mounted() {
        this.axios.get('/api/menus',this.users).then((res)=>{
            // console.log(res);
            this.menusList=res.data
        })
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.home-container{
 height: 100%;   
}
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:white;
    font-size: 20px;
}   
.el-container{
    background-color: #333744;
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;
    }
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
