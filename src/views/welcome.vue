<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>welcome</el-breadcrumb-item>
      
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
         <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width:1024px;height:400px;"></div>
    </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    props: {

    },
    data() {
        return {
            //需要合并的数据
                options: {
                     "data": [
        {
            "id": 30,
            "roleName": "主管",
            "roleDesc": "技术负责人",
            "children": [
                {
                    "id": 101,
                    "authName": "商品管理",
                    "path": null,
                    "children": [
                        {
                            "id": 104,
                            "authName": "商品列表",
                            "path": null,
                            "children": [
                                {
                                    "id": 105,
                                    "authName": "添加商品",
                                    "path": null
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
                }
        };
    },
    created() {
 
    },
    mounted() {
         // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        //获取图表数据
             this.axios.get('/api/reports/type/1').then(res=>{
                 if(res.meta.status!==200){return $message.error('获取图表数据失败')}
        //准备数据的配置项
        const result=_.merge(res.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(res.data);
             })
     
    
       
             
             
    },
    methods: {
         



        
      
    },
    components: {

    },
};
</script>

<style scoped lang="less">

</style>
