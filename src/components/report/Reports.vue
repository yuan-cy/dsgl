<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>添加报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片试图区域 -->
        <el-card>
             <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>

import * as echarts from 'echarts';
    export default {
        props: {

        },
        data() {
            return {

            };
        },
        methods: {

        },
        components: {

        },
        mounted() {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            this.axios.get('/api/reports/type/1').then(res=>{
                if(res.data.meta.status !== 200){
                   return this.$message.error('获取折线图数据失败')  
                }
               // 绘制图表
               myChart.setOption(res.data.data);
            })
            
        },
    };
</script>

<style scoped lang="less">
.el-card{
    margin-top: 15px;
}
</style>