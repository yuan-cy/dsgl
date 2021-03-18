<template>
    <div>
<!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 搜索框  -->
    <el-row>
        <el-col :span='8'>
            <el-input placeholder='请输入搜索内容'
            v-model="querInfo.query"
            clearable
            @clear="getOrderList"
            >
            <el-button slot="append" icon='el-icon-search' @click="getOrderList"></el-button>
            </el-input>
        </el-col>
    </el-row>
   

    <!-- 订单列表数据 -->
    <el-table :data='orderlist' border stripe header-align='center'  fixed text-align='center'>
        <el-table-column label='#' type='index'></el-table-column>
        <el-table-column label='订单编号' prop='order_number'></el-table-column>
        <el-table-column label='订单价格' width="100" prop='order_price'></el-table-column>
        <el-table-column label='是否付款' prop='pay_status'>
             <template slot-scope="scope">
                <el-tag type='success' v-if="scope.row.pay_status==='1'">已付款</el-tag>
                <el-tag type='danger' v-else>未付款</el-tag>
             </template>
        </el-table-column>
        <el-table-column label='是否发货' header-align='center' width="100" prop='is_send'>
             <template slot-scope="scope">
                 <template>
                   {{scope.row.is_send}}  
                 </template>
             </template>
        </el-table-column>
        <el-table-column label='下单时间' prop='create_time'>
             <template slot-scope="scope">
                 {{scope.row.create_time|dateFormat}}
             </template>
        </el-table-column>
        <el-table-column label='操作' :fit=false class='column-flex'>
        <template slot-scope="">
             <el-tooltip class="item" effect="dark" content="订单编辑" placement="top-end">
        <el-button type='primary' icon=el-icon-edit  size='mini' @click="showBox"></el-button>
            </el-tooltip>
             <el-tooltip class="item" effect="dark" content="查看物流信息" placement="top-end">
        <el-button type='success' icon=el-icon-location  size='mini' @click="showProgressBox"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="订单详情" placement="top-end">
        <el-button type='info' icon=el-icon-s-operation  size='mini' @click="showProgressBox"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改订单状态" placement="top-end">
        <el-button type='warning' icon=el-icon-platform-eleme  size='mini' @click="showProgressBox"></el-button>
        </el-tooltip>
           
      
            
        </template>    
        </el-table-column>
    </el-table>
      <!-- 分页 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[1, 5, 10, 100]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      <!-- 展示修改地址的对话框 -->
     <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close='addressDialogClosed'
        >
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
            <el-form-item label="省市区/县" prop="address1">
                <el-cascader :options='cityData' v-model="addressForm.address1"></el-cascader >
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input  v-model="addressForm.address2"></el-input >
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
       <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click=" submitForm('addressForm')">确 定</el-button>
  </span>
    </el-dialog>
    
    <!-- 展示物流進度的對話框 -->
    <el-dialog
    title="物流进度"
    :visible.sync="progressdialogVisible"
    width="50%"
   >
    <span>这是一段信息</span>
    <span slot="footer" class="dialog-footer">
   
  </span>
</el-dialog>
     </el-card>

   
 
    </div>
</template>

<script>
import cityData from './city_data2017_element'
export default {
    props: {

    },
    data() {
        return {
        querInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
        total:0,
        orderlist:[],
        time: Date.now(),
        timer: null,
        addressVisible:false,
      
        addressForm:{
            address1:[],
            address2:'',
        },
        //校验规则
        addressFormRules:{
            address1:[
            {required:true,message:'清选择省市区县',trigger:'blur'},
            ],
            address2:[
            {required:true,message:'清填写 详细地址',trigger:'blur'},
            ]
        },
        //时间
        cityData,
        progressdialogVisible:false
        };
        
    },
    created() {
        this.getOrderList()
    },
    methods: {
        //获取订单数据
        getOrderList(){
                this.axios.get('/api/orders/',{params:this.querInfo}).then(res=>{
                    // console.log(res);
                    if(res.data.meta.status!==200){{return this.$message.error('获取订单列表失败')}}
                    this.total=res.data.data.total
                    this.orderlist=res.data.data.goods 
                    
                    // console.log(this.total,this.orderlist);
                })
                
        },
  // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码之改变事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage;
      this.getUserList();
    },
        //当前数量
        handleSizeChange(newSize){
            this.querInfo.pagesize=newSize
            this.getOrderList()
        },
        //当前页面
         handleCurrentChange(newPageNum){
            this.querInfo.pagenum=newPageNum
            this.getOrderList()
        },

        //展示修改地址的对话框
        showBox(){
            this.addressVisible=true
        },
        //清空form表单
        addressDialogClosed(){
            this.$refs.addressFormRef.resetFields()
        },
        //确定时校验规则
        submitForm(addressForm){
             this.$refs.addressFormRef.validate((valid) => {
          if (!valid) {
            
           this.$message.error("地址修改失败")
           
          } else {
              this.addressDialogClosed()
            
          }
        });
        },
        //物流进度
        showProgressBox(){
            this.progressdialogVisible=true
            // this.axios.get('/api/kuaidi/:1106975712662/').then(res=>{
            //     console.log(res);
            // })
        },
        //查询数据
    },
    components: {

    },
};
</script>

<style scoped lang="less">
.column-flex{
    display: flex;

   flex-direction: column;
   align-items: center;
}
</style>
