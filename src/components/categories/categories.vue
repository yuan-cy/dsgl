<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色表格区域 -->
      <tree-table
        :data="cateList"
        :selection-type="false"
        stripe
        index-text="#"
        show-index
        border
        :expand-type="false"
        :columns="columns"
        class="tree-table"
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:green"
          ></i>
          <i class="el-icon-error" style="color:green" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button type="primary"  icon="el-icon-edit" size='mini'
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete " size='mini'
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //商品分类列表
      cateList: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        //定义插槽
        {
          label: "是否有效",
          //把当前定定义为模板
          type: "template",
          //模板名称
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品分类列表
    getCateList() {
      this.axios
        .get("/api/categories/", { params: this.querInfo })
        .then((res) => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("获取商列表失败");
          }
          //复制列表
          this.cateList = res.data.result;
          //总数据条数获取
          this.total = res.data.total;
          console.log(this.cateList);
        });
    },
    //监听pagesize改变
    handleSizeChange(newSize){
        this.querInfo.pagesize=newSize
        this.getCateList()
    },
    //监听pagenum改变
    handleCurrentChange(newPage){
        this.querInfo.pagenum=newPage
        this.getCateList()
    }
  },
  components: {},
};
</script>

<style scopedlang="less">
.tree-table{
    margin-top: 15px;
}
</style>
