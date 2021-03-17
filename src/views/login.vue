<template>
  <div class="login">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avater_box">
        <img src="./../assets/logo.png" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        class="login_form"
        :label-position="labelPosition"
        :model="logininfo"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item prop="name">
          <el-input
            v-model="logininfo.name"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            v-model="logininfo.pwd"
            placeholder="请输入密码"
            show-password
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login('ruleForm')">登录</el-button>
          <el-button type="info" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      labelPosition: "right",
      logininfo: {
        name: "admin",
        pwd: "123456",
      },

      rules: {
        name: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击重置按钮 重置登录组件
    resetLoginFrom() {
      this.$refs.ruleForm.resetFields();
    },
     login(formName) {
      this.$refs[formName].validate((valid) => {
        // location:'http://192.168.1.29:3000';
        // console.log(this.logininfo.name);
        if (valid) {
          this.axios
            .post("/api/login", {
              username: this.logininfo.name,
              password: this.logininfo.pwd,
            })
            .then((res) => {
              // console.log(res);
              if (res.meta.msg === '用户名不存在') {
             
              this.$message({
                  message: "没有此账号",
                  type: "error",
                });
              } else {
                this.$message({
                  message: "恭喜你，登录成功",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push("/home");
                  },
                });
              }
            });
        } else {
           this.$message({
                  message: "没有此账号",
                  type: "error",
                });
          return false;
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avater_box {
      height: 130px;
      width: 130px;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #ccc;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    // align-items: center;
  }
}
</style>
