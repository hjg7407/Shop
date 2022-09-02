<template>
  <div class="l_body">
    <div class="main clearfix">
      <div class="l_area">
        <div class="l_header">
          <h3>账号登录</h3>
        </div>
        <div class="login_body">
          <div class="message">
            <el-input
              maxlength="10"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              v-model="username"
              ref="username"
              @blur="checkUsername"
            >
            </el-input>
            <el-input
              placeholder="请输入登录密码"
              prefix-icon="el-icon-lock"
              v-model="password"
              ref="password"
              show-password
              @blur="checkPassword"
            >
            </el-input>
          </div>
          <div class="tip" v-show="isError">{{ errorMessage }}</div>
          <button class="submit" @click="login">登录</button>
          <router-link class="register" to="/register">免费注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  export default {
    name: 'LoginItem',
    data() {
      return {
        username: '',
        password: '',
        isError: false,
        errorMessage: ''
      }
    },
    methods: {
      ...mapMutations('user', ['SetUsername']),
      ...mapActions('shoppingCar', ['setCarNumber']),
      checkUsername() {
        //检查用户名是否为空
        this.showInfo(this.username.trim())
      },
      //检查密码是否为空
      checkPassword() {
        this.showInfo(this.password)
      },
      //显示错误信息
      showInfo(value) {
        if (!value) {
          this.isError = true
        } else {
          this.isError = false
        }
      },
      //登录
      async login() {
        let { username, password } = this
        username = username.trim()
        //判断输入是否为空
        if (!username) {
          this.showInfo(username)
          this.errorMessage = `请输入用户名`
          this.$refs.username.focus()
        } else if (!password) {
          this.showInfo(password)
          this.errorMessage = `请输入密码`
          this.$refs.password.focus()
        } else {
          let result = await this.$axios.post('/api/users/login', {
            username,
            password
          })
          //返回状态码0表示登录成功
          if (result.data.code === '0') {
            //把token存到localStorage中
            localStorage.setItem('Token', 'Bearer ' + result.data.token)
            // 把用户名保存到store仓库
            this.SetUsername(result.data.username)
            //获取购物车数量
            this.setCarNumber()
            //登录的路由组件：看路由当中是否包含query参数，有：调到query参数指定路由，没有：调到home
            let toPath = this.$route.query.redirect || '/home'
            this.$router.replace(toPath)
            //提示登录成功信息
            this.$successedMessage(result.data.message)
          } else {
            this.isError = true
            //提示登录失败信息
            this.errorMessage = result.data.message
            this.$errorMessage(result.data.message)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .l_body {
    height: 550px;
    min-width: 1200px;
    background: url(./images/login.jpg) no-repeat;
    background-size: 100% 100%;
    background-color: aqua;
  }
  .main {
    width: 1200px;
    margin: 0 auto;
    padding: 50px 20px;
  }
  .l_area {
    float: right;
    width: 360px;
    height: 420px;
    border: 1px solid rgb(255, 220, 150);
    background-color: #fff;
  }
  .l_header {
    width: 360px;
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    border-bottom: 1px solid rgb(255, 220, 150);
    font-size: 14px;
  }
  .l_header h3 {
    text-align: center;
    font-size: 18px;
  }
  .login_body {
    position: relative;
    width: 360px;
    height: 420px;
    padding: 0 30px;
  }
  .message div {
    margin-top: 30px;
  }
  .tip {
    width: 300px;
    height: 35px;
    line-height: 35px;
    margin: 10px 0;
    font-size: 14px;
    color: red;
  }
  .submit {
    position: absolute;
    width: 300px;
    height: 40px;
    background-color: orange;
    top: 230px;
    left: 30px;
    font-size: 16px;
    color: #fff;
  }
  .register {
    position: absolute;
    top: 300px;
    right: 30px;
  }
</style>
