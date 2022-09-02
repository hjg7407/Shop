<template>
  <div class="r_body">
    <div class="main clearfix">
      <div class="r_area">
        <div class="r_header">
          <div>
            已有账号?
            <router-link to="/login">去登陆</router-link>
          </div>
          <h3>用户注册</h3>
        </div>
        <div class="register_body">
          <!-- 用户名最长为10 -->
          <el-input
            maxlength="10"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="username"
            @blur="checkUsername"
          >
          </el-input>
          <div class="tip">
            <span>{{ tips.username }}</span>
          </div>
          <!-- 只能输入数字，且最多11位 -->
          <el-input
            maxlength="11"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
            v-model="phone"
            @input="checkNumber"
            @blur="checkPhone"
          >
          </el-input>
          <div class="tip">
            <span>{{ tips.phone }}</span>
          </div>
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="password"
            @blur="checkpassword"
            show-password
          >
          </el-input>
          <div class="tip">
            <span>{{ tips.password }}</span>
          </div>
          <el-input
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            v-model="password1"
            @blur="checkpassword1"
            show-password
          >
          </el-input>
          <div class="tip">
            <span>{{ tips.password1 }}</span>
          </div>

          <ul class="agree">
            <li>
              <input type="checkbox" v-model="isAgree" @blur="checkAgree" />
            </li>
            <li>
              已阅读并同意以下协议：
              <a href="#">《好而多服务协议》</a>
              <a href="#">《隐私权政策》</a>
            </li>
          </ul>
          <div class="tip">
            <span>{{ tips.agree }}</span>
          </div>
          <button class="submit" @click="register">立即注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RegisterItem',
    data() {
      return {
        username: '',
        phone: '',
        password: '',
        password1: '',
        isAgree: false,
        isReady: [false, false, false, false],
        tips: {
          username: '',
          phone: '',
          password: '',
          password1: '',
          agree: ''
        }
      }
    },
    methods: {
      //判断用户名是否合法
      checkUsername() {
        this.isReady[0] = false
        let reg = /([^\w\u4e00-\u9fa5])+/
        if (this.username.trim() === '') {
          this.tips.username = '用户名不能为空'
        } else if (reg.test(this.username.trim())) {
          this.tips.username = '用户名不能包含_以外的特殊字符'
        } else {
          this.tips.username = ''
          this.isReady[0] = true
        }
      },
      //将非数字替换为空串
      checkNumber() {
        let reg = /[^\d]/g
        this.phone = this.phone.replace(reg, '')
      },
      //判断手机号是否正确
      checkPhone() {
        let reg = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
        if (!reg.test(this.phone)) {
          this.tips.phone = '请输入正确的手机号'
          this.isReady[1] = false
        } else {
          this.tips.phone = ''
          this.isReady[1] = true
        }
      },
      //判断密码是否合法
      checkpassword() {
        this.isReady[2] = false
        if (this.password === '') {
          this.tips.password = '密码不能为空'
        } else if (this.password.length < 6 || this.password.length > 20) {
          this.tips.password = '请输入6-20位的密码'
        } else {
          this.tips.password = ''
          this.isReady[2] = true
        }
      },
      //判断两次密码是否相同
      checkpassword1() {
        if (this.password != this.password1) {
          this.tips.password1 = '两次输入的密码不一致，请重新输入'
          this.isReady[3] = false
        } else {
          this.tips.password1 = ''
          this.isReady[3] = true
        }
      },
      //判断是否同意协议
      checkAgree() {
        if (!this.isAgree) {
          this.tips.agree = '同意服务协议才能注册'
        } else {
          this.tips.agree = ''
        }
      },
      //注册
      async register() {
        let { username, phone, password, isReady, isAgree } = this
        let success = isReady.every((value) => value === true) && isAgree
        if (success) {
          let result = await this.$axios.post('/api/users/register', {
            username,
            phone,
            password
          })
          //返回状态码0表示注册成功
          if (result.data.code === '0') {
            //跳转到登录界面
            this.$router.replace({
              path: '/login'
            })
            // 提示注册成功信息
            this.$successedMessage(result.data.message)
          } else {
            // 提示注册失败信息
            this.$errorMessage(result.data.message)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .r_body {
    height: 650px;
    min-width: 1200px;
    background: url(./images/register.png) no-repeat;
    background-size: 100% 100%;
  }
  .main {
    width: 1200px;
    margin: 0 auto;
    padding: 50px 20px;
  }
  .r_area {
    float: right;
    width: 360px;
    height: 520px;
    border: 1px solid rgb(255, 220, 150);
    background-color: #fff;
  }
  .r_header {
    width: 360px;
    height: 50px;
    line-height: 50px;
    padding: 0 30px;
    border-bottom: 1px solid rgb(255, 220, 150);
    font-size: 14px;
  }
  .r_header h3 {
    font-size: 18px;
  }
  .r_header div {
    float: right;
  }
  .r_header div a {
    margin-left: 5px;
    color: orange;
  }
  .register_body {
    position: relative;
    width: 360px;
    height: 470px;
    padding: 0 30px;
  }
  .register_body div:first-child {
    margin-top: 25px;
  }
  .agree {
    display: flex;
    width: 300px;
  }
  .agree li:first-child {
    width: 15px;
    height: 36px;
    margin-right: 10px;
    padding-top: 3px;
  }
  .agree li:last-child {
    width: 275pxpx;
    height: 36px;
  }
  .agree li a {
    color: rgb(102, 161, 222);
  }
  .submit {
    position: absolute;
    width: 300px;
    height: 40px;
    background-color: orange;
    top: 370px;
    left: 30px;
    font-size: 16px;
    color: #fff;
  }
  .tip {
    width: 360px;
    height: 30px;
    line-height: 30px;
  }
  .tip span {
    color: red;
  }
</style>
