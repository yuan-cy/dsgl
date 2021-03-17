<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
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
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- <pre>{{scope.row}}</pre> -->
            <el-row
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRolesById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限 -->
              <el-col :span="19">
                <!-- for循环二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRolesById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- for循环三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      @close="removeRolesById(scope.row, item3.id)"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRolesList(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限弹出层 -->
    <el-dialog title="分配权限"  :visible.sync="setDialogVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rolesList: [],
      //控制权限对话框的显示与隐藏
      setDialogVisible: false,
      //获取到的权限数据
      rightsList: [],
      //树形控件的属性绑定
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认选中的节点id数据值
      defKeys: [ ],
      // 当前即将分配的角色id
      roleId:'',
    };
  },
  created() {
    this.getRolesList();
    this.defKeys=[]
  },
  methods: {
    // 获取权限列表
    getRolesList() {
      this.axios.get("/api/roles/").then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败");
        }
        this.rolesList = res.data;
        // console.log(this.rolesList);
      });
    },
    //根据id删除对应权限
    async removeRolesById(role, rightId) {
      const confirmReust = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      //  确认删除返回confirm
      if (confirmReust !== "confirm") {
        return this.$message.info("已取消删除");
      }

      this.axios
        .delete(`/api/roles/${role.id}/rights/${rightId}`)
        .then((res) => {
          if (res.meta.status !== 200) {
            return $message.info("删除失败");
          }
          this.$message.success("删除成功");
          role.children = res.data;
        });
    },
    //分配权限
    showRolesList(role) {
      this.roleId=role.id
      // 获取所有权限列表
      this.axios.get("/api/rights/tree").then((res) => {
        if (res.meta.status !== 200) return this.$message.error("获取列表失败");
        this.rightsList = res.data;
        // console.log(this.rightsList);
       
      });
        //解决递归获取id重复
         this.defKeys=[]
      //通过递归获取三级节点id
      this.getLeafKeys(role, this.defKeys);
      this.setDialogVisible = true;
    },
    // 通过递归的形式 获取所有三级j权限id 并保存
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
   
        this.getLeafKeys(item, arr);
    
      });
    },
  //点击确定为角色分配权限
  allotRights(){
  const keys=[
    ...this.$refs.treeRef.getCheckedKeys(),
    ...this.$refs.treeRef.getHalfCheckedKeys()
  ]
  const keysStr=keys.join(',')
          this.axios.post(`/api/roles/${this.roleId}/rights/`,{rids:keysStr}).then(res=>{
            console.log(res);
             if(res.meta.status!==200){return this.$message.error('分配权限失败')}
          this.$message.success('分配权限成功')
          
          this.getRolesList()
          this.setDialogVisible=false
          });
         
  }
    

    
  },
  components: {},
};
</script>

<style scoped lang="less">
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
