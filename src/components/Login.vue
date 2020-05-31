<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form class="login-form" :model="loginForm" :rules="rules" ref="refForm">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-edit" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm">登陆</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.refForm.resetFields()
    },
    submitForm () {
      this.$refs.refForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$request.post('login', this.loginForm)
          if (res.meta.status !== 200) return this.$message({ showClose: true, message: '登录失败', type: 'error', duration: 2000 })
          else {
            this.$message({ showClose: true, message: '登录成功', type: 'success', duration: 1600 })
            window.sessionStorage.setItem('token', res.data.token)
            // 编程式导航跳转主页
            this.$router.push('/home')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .login-box {
    width: 450px;
    height: 280px;
    background: #fff;
    border-radius: 3px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.18);
    position: relative;

    .avatar-box {
      height: 100px;
      width: 100px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 8px;
      box-shadow: 0 0 8px #ddd;
      position: absolute;
      left: 50%;
      box-sizing: border-box;
      background-color: #fff;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .btns {
    display: flex;
    justify-content: center;
  }

  .login-form {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
