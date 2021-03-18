<template>
  <div class="login">
    <div class="icon">
      <div>
        <img src="./../assets/logo.png" alt="">
      </div>
    </div>
    <el-form :label-position="labelPosition" :model="loginInfo" class="login_form" :rules="rules" ref="loginInfo">
      <el-form-item prop="name">
        <el-input v-model=" loginInfo.name" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input v-model="loginInfo.pwd" show-password prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <div class="bt">
        <el-button type="primary" class="login_btn" @click="submitForm('loginInfo')">登录</el-button>
        <el-button type="info" >注册</el-button>
      </div>

    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        labelPosition: 'left',
        loginInfo: {
          name: 'admin',
          pwd: '123456',

        },
        rules: {
          name: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          pwd: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20 个字符',
              trigger: 'blur'
            }
          ],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/api/login', {
              username: this.loginInfo.name,
              password: this.loginInfo.pwd
            }).then(res => {
              // console.log(res)
              if (res.data.meta.msg == '登录成功') {
                this.$message({
                  message: '恭喜你，登录成功',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    window.sessionStorage.setItem('token', res.data.data.token);
                    this.$router.push('/home')
                  }
                });
              }else{
                this.$message({
                  message: '没有账号',
                  type: 'error',
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  }
</script>
<style scoped lang="less">
  .login {
    height: 100%;
    background-color: #535a53;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .icon {
      width: 120px;
      height: 120px;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 20%;
      z-index: 2;
      box-shadow: 0px 0px 8px 2px #fff;
      border: 1px solid #eee;

      div {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100px;
        height: 100px;
        background-color: #eee;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

    }

    .login_form {
      width: 30%;
      padding: 40px;
      background-color: #fff;
      border-radius: 10px;

      .bt {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
</style>