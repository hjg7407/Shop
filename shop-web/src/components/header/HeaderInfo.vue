<template>
  <header class="header">
    <!-- 头部导航栏 -->
    <div class="top">
      <div class="container w">
        <ul class="nav">
          <!-- 未登录 -->
          <li v-if="!username">
            <router-link
              :to="{
                path: '/login',
                query: {
                  redirect: this.$router.currentRoute.fullPath
                }
              }"
            >
              你好，请登录
            </router-link>
            |
            <router-link to="/register">免费注册</router-link>
          </li>
          <!-- 已登录，显示用户名 -->
          <li v-else>
            <div class="username">
              {{ username }}
              <i class="el-icon-arrow-down"></i>
              <div class="user">
                <div class="icon"></div>
                <div class="account">
                  <div></div>
                  <a @click="dialogVisible = true">修改密码</a>
                  <a type="text" @click="logout">退出</a>
                </div>
              </div>
            </div>
          </li>
          <li v-show="visible">
            <router-link to="/home">回到首页</router-link>
          </li>
          <li><router-link to="/myOrder">我的订单</router-link></li>
          <li><router-link to="/collection">我的收藏</router-link></li>
          <li><router-link to="/address">收货地址</router-link></li>
          <li><router-link to="/about">关于我们</router-link></li>
        </ul>
      </div>
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        :before-close="changeCancel"
        width="35%"
      >
        <el-form
          :model="passwordForm"
          :rules="passwordRules"
          ref="passwordForm"
        >
          <el-form-item
            label="原密码"
            :label-width="formLabelWidth"
            prop="oldPassword"
          >
            <el-input
              v-model="passwordForm.oldPassword"
              prefix-icon="el-icon-lock"
              show-password
              ref="oldPassword"
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
            prop="newPassword"
          >
            <el-input
              v-model="passwordForm.newPassword"
              prefix-icon="el-icon-lock"
              show-password
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            :label-width="formLabelWidth"
            prop="confirmPassword"
          >
            <el-input
              v-model="passwordForm.confirmPassword"
              prefix-icon="el-icon-lock"
              show-password
              style="width: 80%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changeCancel">取 消</el-button>
          <el-button type="primary" @click="changePassword">确认修改</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 头部搜索栏 -->
    <div class="searchArea w">
      <div class="logo">
        <h1>
          <router-link to="/home">好而多商城</router-link>
        </h1>
      </div>
      <div class="search">
        <input type="text" v-model="keyword" placeholder="请输入搜索内容" />
        <button @click="goSearch">
          <i class="el-icon-search"></i>
        </button>
      </div>
      <button class="shoppingCar" @click="goShoppingCar">
        <i class="el-icon-shopping-cart-2"></i>
        购物车
        <i class="el-icon-arrow-right"></i>
        <i class="number">{{ number }}</i>
      </button>
    </div>
  </header>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: 'HeaderInfo',
    data() {
      let validatePassword1 = (rule, value, callback) => {
        if (this.passwordForm.confirmPassword !== '') {
          this.$refs.passwordForm.validateField('confirmPassword')
        }
        callback()
      }
      let validatePassword2 = (rule, value, callback) => {
        if (value !== this.passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        keyword: '', //搜索关键词
        dialogVisible: false,
        formLabelWidth: '120px',
        passwordForm: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        passwordRules: {
          oldPassword: [
            {
              required: true,
              message: '请输入原密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度在 6 到 20 个字符',
              trigger: 'blur'
            }
          ],
          newPassword: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度在 6 到 20 个字符',
              trigger: 'blur'
            },
            {
              validator: validatePassword1,
              trigger: 'blur'
            }
          ],
          confirmPassword: [
            {
              required: true,
              message: '请再次输入新密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '密码长度在 6 到 20 个字符',
              trigger: 'blur'
            },
            {
              validator: validatePassword2,
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      //借助mapState生成计算属性，从state中读取数据
      ...mapState('user', ['username']),
      ...mapState('shoppingCar', ['number']),
      // 是否显示回到首页
      visible() {
        return this.$route.name === 'home' ? false : true
      }
    },
    methods: {
      ...mapMutations('shoppingCar', ['SetCarNumber']),
      ...mapMutations('user', ['SetUsername']),
      logout() {
        //清除用户名
        this.SetUsername('')
        //清除token
        localStorage.removeItem('Token')
        //清除购物车数量
        this.SetCarNumber(0)
      },
      goSearch() {
        //搜索栏非空，跳转到搜索页面
        if (this.keyword.trim() === '') {
          alert('输入不能为空，请重新输入')
          this.keyword = ''
        } else {
          this.$router.push({
            name: 'search',
            query: {
              keyword: this.keyword.trim()
            }
          })
        }
      },
      goShoppingCar() {
        this.$router.push({ path: '/shoppingCar' })
      },
      // 修改密码
      changePassword() {
        this.$nextTick(() => {
          this.$refs.passwordForm.validate((valid) => {
            if (valid) {
              this.$axios
                .post('/api/users/changePassword', {
                  oldPassword: this.passwordForm.oldPassword,
                  newPassword: this.passwordForm.newPassword
                })
                .then((resolve) => {
                  if (resolve.data.code === '0') {
                    // 修改密码成功，提示成功信息
                    this.$successedMessage(resolve.data.message)
                    // 关闭对话框
                    this.dialogVisible = false
                    this.$refs.passwordForm.resetFields()
                    // 退出登录
                    this.logout()
                    // 跳转到登录界面
                    this.$router.push({
                      path: '/login',
                      query: {
                        redirect: this.$router.currentRoute.fullPath
                      }
                    })
                  } else {
                    // 修改密码失败，提示失败信息
                    this.$errorMessage(resolve.data.message)
                    this.$refs.oldPassword.focus()
                  }
                })
            } else {
              return false
            }
          })
        })
      },
      // 取消保存重置表单数据
      changeCancel() {
        this.$nextTick(function () {
          this.$refs.passwordForm.resetFields()
          for (let index in this.passwordForm) {
            this.passwordForm[index] = ''
          }
          this.dialogVisible = false
        })
      }
    }
  }
</script>

<style scoped>
  /* 版心 */
  .w {
    width: 1200px;
    margin: 0 auto;
  }
  /* 顶部导航栏 */
  .top {
    /* 解决浏览器缩小后右侧背景丢失问题 */
    min-width: 1200px;
    height: 40px;
    line-height: 40px;
    background-color: rgb(245, 245, 245);
  }
  .nav {
    display: flex;
    justify-content: flex-end;
    font-size: 14px;
  }
  .nav li {
    margin-left: 30px;
  }
  .nav li:first-child {
    display: flex;
  }
  .nav li a {
    padding: 0 5px;
  }
  .nav .username {
    position: relative;
    text-align: right;
    width: 150px;
    padding-left: 5px;
  }
  .nav .username > a {
    float: left;
    width: 120px;
    /* 文本溢出时显示省略号 */
    text-overflow: ellipsis;
    /* 强制在同一行内显示所有文本，合并文本间的多余空白，直到文本结束或者遭遇br对象 */
    white-space: nowrap;
    overflow: hidden;
  }
  .nav .username:hover {
    background-color: #fff;
  }
  .nav .username:hover .user {
    display: block;
  }
  .user {
    z-index: 2;
    position: absolute;
    display: none;
    width: 200px;
    height: 80px;
    left: 0;
    top: 40px;
    background-color: #fff;
    border: 1px solid rgb(245, 245, 245);
    border-top: 0;
  }
  .user .icon {
    position: relative;
    width: 56px;
    height: 56px;
    left: 10px;
    top: 40px;
    transform: translateY(-50%);
    background: url('./images/avatar.jpg') no-repeat;
    background-size: 100%;
  }
  .user .account {
    position: absolute;
    top: 20px;
    left: 75px;
  }
  /* 头部搜索栏 */
  .searchArea {
    display: flex;
    height: 120px;
    font-size: 14px;
    align-items: center;
  }
  .logo {
    width: 240px;
    height: 75px;
    margin-right: 160px;
  }
  .logo a {
    display: block;
    width: 240px;
    height: 75px;
    font-size: 0;
    background: url(./images/logos.png) no-repeat;
  }
  .search {
    position: relative;
    width: 391px;
    height: 36px;
    border: 2px solid orange;
    margin-right: 150px;
  }
  .search input {
    position: absolute;
    width: 335px;
    height: 32px;
    top: 0;
    padding: 0 10px;
  }
  .search button {
    position: absolute;
    width: 52px;
    height: 32px;
    right: 0;
    background-color: orange;
  }
  .search button i {
    font-size: 20px;
    color: #fff;
  }
  .shoppingCar {
    position: relative;
    width: 120px;
    height: 35px;
    font-size: 13px;
  }
  .shoppingCar i {
    padding: 0 5px;
  }
  .shoppingCar i:first-child {
    font-size: 20px;
    color: orange;
  }
  .number {
    position: absolute;
    top: -5px;
    left: 82px;
    height: 16px;
    background-color: orange;
    border-radius: 8px 8px 8px 0;
    font-size: 12px;
    color: #fff;
  }
</style>
