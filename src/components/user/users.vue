<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 状态模板 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作按钮 -->
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑框 -->
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="showEdit(scope.row.id)"
                type="primary"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
            </el-tooltip>
            <!-- 删除框 -->
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                 @click='removeUserListById(scope.row.id)'
              ></el-button>
            </el-tooltip>
            <!-- 分配框 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFromRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
       
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用户对话框  -->
    <el-dialog title="修改用户" :visible.sync="editdialogVisible" width="50%"
    @close='editdialogClose'
    >
      <!-- 内容总体 -->
     <!-- 修改用户form表单 -->
     <el-form :model="editFrom" :rules="editFromRules" ref="editruleForm" label-width="70px" >
        <el-form-item label="用户名" >
          <el-input v-model="editFrom.username" disabled></el-input>
        </el-form-item>
          <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editFrom.email" ></el-input>
        </el-form-item>
          <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editFrom.mobile" ></el-input>
        </el-form-item>
       
     </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserFrom"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
       <el-dialog title="分配角色"  :visible.sync="setRoleDialogVisible" width="50%">
     
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole()"
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
    //手机号校验规则
    var checkmobile = (rule, value, reset) => {
      const regmoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regmoblie.test(value)) {
        return reset();
      }
      reset(new Error("请输入合法的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      //   控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      //控制修改用户的对话框的显示与隐藏
      editdialogVisible: false,
      //查询用户对象
      editFrom:{},
      //添加用户表单数据
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: "",
       
      },
      //   添加表单的验证规则对象
      addFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 8,
            message: "用户名在 2 到 8 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 16,
            message: "用户名在 6 到 16 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      //   添加表单的验证规则对象
      editFromRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
       //分配角色对话框显示隐藏
      setRoleDialogVisible:false
    };
  },
  //钩子函数
  created() {
    this.getUserList();
  },
  methods: {
    //   获取列表数据
    getUserList() {
      this.axios.get("/api/users", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！");
        }
        this.userList = res.data.users;
        this.total = res.data.total;
      });
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
    //监听开关按钮
    userStateChange(userinfo) {
      this.axios
        .put(`/api/users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          // console.log(res);
          if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state;
            return this.$message.error("用户权限更改失败");
          } else {
            this.$message.success("用户权限更新成功");
          }
        });
    },
    //监听添加用户对话框的关闭事件
    dialogClosed() {
      this.$refs.addFromRef.resetFields();
    },
    //点击按钮添加新用户
    addUser() {
      this.$refs.addFromRef.validate((valid) => {
        if (!valid) return;
        //成功时添加
        this.axios.post("/api/users", this.addFrom).then((res) => {
          // console.log(res);
          if (res.meta.status !== 201) {
            this.$$message.error("添加用户失败");
          }
          this.$message.success("添加用户成功"),
            //隐藏添加用户对话框
            (this.dialogVisible = false);
          //重新获取用户列表
          this.getUserList();
        });
      });
    },
    //编辑用户框
    showEdit(id) {
      // console.log(id);
      this.axios.get('/api/users/'+ id ).then(res=>{
        // console.log(res);
        if(res.meta.status!==200) {return this.$message.error('查询用户失败！')}
        this.editFrom=res.data
        this.editdialogVisible=true

})
      
    },
    //监听修改用户对话框的关闭事件
    editdialogClose(){
     this.$refs.editruleForm.resetFields()
    },
    //封装 刷新列表 更新成功


    //修改用户并提交
    editUserFrom(){
      this.$refs.editruleForm.validate(valid=>{
        if(!valid) return 
          //提交修改用户数据请求
          this.axios.put('/api/users/'+this.editFrom.id,
          {
            email:this.editFrom.email,
            mobile:this.editFrom.mobile
          }).then(res=>{
            if(res.meta.status!==200){
              return this.$message.error('更新用户信息失败')
            }
            //关闭对话框
            this.editdialogVisible=false
            //刷新列表
            this.getUserList()
            //更新成功
            return this.$message.success('更新用户信息成功')
          })
      })
    

    },

    // 根据id来删除某个用户
  async  removeUserListById(id){
   const confirmReust=await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(error=>error
        );
        // console.log(confirmReust );   
      //  确认删除返回confirm 
         if(confirmReust!=='confirm'){return this.$message.info('已取消删除')} 
          this.axios.delete('/api/users/'+id).then(res=>{ 
            if(res.meta.status!==200){return $message.error('删除失败')}
            this.$message.success('删除成功')
            this.getUserList()
          }) 
      },
     //展示分配角色的对话框
     setRole(){
       this.setRoleDialogVisible=true
     }
    
    },
  
  components: {},
};
</script>

<style scoped lang="less"></style>
