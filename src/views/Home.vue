<template>
  <el-container class="home">
    <el-header>
      <div>电商后台管理系统</div>
      <el-button type="info" class="bt" @click="out">退出</el-button>
    </el-header>
    <el-container>
    
      <el-aside width="200px">
          <div align='center' style="background-color:#939393;">
        <i class="el-icon-s-fold" ></i>
      </div>
        <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#333" text-color="#fff"
          active-text-color="#409eff" :router='isrouter'>
          <el-submenu :index="item.id+''" v-for='item in list ' :key="item.id" >
            <template slot="title">
              <i :class="Icon[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="ite.id+''" v-for="ite in item.children" :key="ite.id" :route="{path:'/home/'+ite.path}">
            <i class="el-icon-menu"></i>
              {{ite.authName}}
              
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script>
  export default {
    props: {

    },
    data() {
      return {
        list: [],
        isrouter: true,
        Icon: {
          "125": "el-icon-location",
          "103": "el-icon-warning",
          "101": "el-icon-s-goods",
          "102": "el-icon-s-order",
          "145": "el-icon-s-platform",
        },
      };
    },
    methods: {
      out() {
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
    },
    components: {

    },
    mounted() {
      this.axios.get('/api/menus').then(res => {
        console.log(res);
        this.list = res.data.data
      })
    },
  };
</script>

<style scoped lang="less">
  .home {
    height: 100%;

    .el-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #333;
      color: #fff;

      .bt {
        width: 70px;
        text-align: center;
        font-size: 14px;
      }
    }

    .el-aside {
      background-color: #333;
      color: #fff;

      
      }

    
  }

  // el-icon-news
</style>