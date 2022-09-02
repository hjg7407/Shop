<template>
  <div class="order">
    <!-- 头部 -->
    <div class="header">
      <div class="header-content">
        <p>
          <i class="el-icon-s-order"></i>
        </p>
        <p>确认订单</p>
      </div>
    </div>
    <!-- 头部END -->

    <!-- 主要内容容器 -->
    <div class="content">
      <!-- 收货地址 -->
      <div class="section-address">
        <div class="address-header">
          <p class="title">收货地址</p>
          <!-- 添加地址 -->
          <p class="address-add">
            <a type="text" @click="addAddress">添加收货地址</a>
            <el-dialog
              title="添加收货地址"
              :visible.sync="dialogFormVisible"
              :before-close="handleCancel"
            >
              <el-form :model="addressForm" :rules="rules" ref="ruleForm">
                <el-form-item
                  label="收件人"
                  :label-width="formLabelWidth"
                  prop="address_name"
                >
                  <el-input v-model="addressForm.address_name"></el-input>
                </el-form-item>
                <el-form-item
                  label="手机号码"
                  :label-width="formLabelWidth"
                  prop="address_phone"
                >
                  <el-input
                    v-model="addressForm.address_phone"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="地址"
                  :label-width="formLabelWidth"
                  prop="address_details"
                >
                  <el-input
                    type="textarea"
                    autosize
                    v-model="addressForm.address_details"
                    maxlength="100"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="handleCancel">取 消</el-button>
                <el-button type="primary" @click="saveAddress">保 存</el-button>
              </div>
            </el-dialog>
          </p>
        </div>

        <div class="address-body">
          <!-- <el-select
            v-model="address_id"
            placeholder="请选择收货地址"
            style="width: 600px"
          >
            <el-option
              v-for="item in addressList"
              :key="item.address_id"
              :label="
                item.address_name + item.address_phone + item.address_details
              "
              :value="item.address_id"
            >
            </el-option>
          </el-select> -->
          <!-- 地址信息 -->
          <div class="address-choose" v-if="choosed">
            <p class="address-details">
              <span>{{ choosed.address_name }}</span>
              <span>{{ choosed.address_details }}</span>
              <span>{{ choosed.address_phone }}</span>
            </p>
          </div>
          <div class="address-more" v-show="!isMore" @click="isMore = !isMore">
            更多地址
            <i class="el-icon-arrow-down"></i>
          </div>
          <ul v-show="isMore">
            <li
              class="address-details"
              v-for="(item, index) in addressList"
              :key="item.address_id"
              @click="changeChoosed(index)"
            >
              <span>{{ item.address_name }}</span>
              <span>{{ item.address_details }}</span>
              <span>{{ item.address_phone }}</span>
            </li>
            <div class="address-more" @click="isMore = !isMore">
              收起地址
              <i class="el-icon-arrow-up"></i>
            </div>
          </ul>
        </div>
      </div>
      <!-- 收货地址END -->

      <!-- 商品列表 -->
      <div class="section-goods">
        <p class="title">商品列表</p>
        <div class="goods-list">
          <ul>
            <li v-for="item in getCheckedGoods" :key="item.id">
              <img :src="$baseURL + item.goods_picture" />
              <span class="pro-name">{{ item.goods_name }}</span>
              <span class="pro-price"
                >{{ item.goods_price | numFilter }}元 x {{ item.number }}</span
              >
              <span class="pro-status"></span>
              <span class="pro-total"
                >{{ (item.goods_price * item.number) | numFilter }}元</span
              >
            </li>
          </ul>
        </div>
      </div>
      <!-- 商品列表END -->

      <!-- 配送方式 -->
      <div class="section-shipment">
        <p class="title">配送方式</p>
        <p class="shipment">包邮</p>
      </div>
      <!-- 配送方式END -->

      <!-- 发票 -->
      <div class="section-invoice">
        <p class="title">发票</p>
        <p class="invoice">电子发票</p>
        <p class="invoice">个人</p>
        <p class="invoice">商品明细</p>
      </div>
      <!-- 发票END -->

      <!-- 结算列表 -->
      <div class="section-count">
        <div class="money-box">
          <ul>
            <li>
              <span class="title">商品件数：</span>
              <span class="value">{{ checkedNumber }}件</span>
            </li>
            <li>
              <span class="title">商品总价：</span>
              <span class="value">{{ checkedPrice | numFilter }}元</span>
            </li>
            <li>
              <span class="title">运费：</span>
              <span class="value">0元</span>
            </li>
            <li class="total">
              <span class="title">应付总额：</span>
              <span class="value">
                <span class="total-price">{{ checkedPrice | numFilter }}</span
                >元
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 结算列表END -->

      <!-- 结算导航 -->
      <div class="section-bar">
        <div class="btn">
          <router-link to="/shoppingCar" class="btn-base btn-return">
            返回购物车
          </router-link>
          <a
            href="javascript:void(0);"
            @click="dialogVisible = true"
            class="btn-base btn-primary"
            >结算</a
          >
          <el-dialog title="确认付款" :visible.sync="dialogVisible" width="30%">
            <span>是否已完成支付</span>
            <span slot="footer">
              <el-button @click="addOrder(1)">取 消</el-button>
              <el-button type="primary" @click="addOrder(2)">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <!-- 结算导航END -->
    </div>
    <!-- 主要内容容器END -->
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapState } from 'vuex'
  export default {
    name: 'OrderItem',
    data() {
      return {
        //地址信息
        addressList: null,
        // 控制是否显示添加地址表单
        dialogFormVisible: false,
        addressForm: {
          address_name: '',
          address_phone: '',
          address_details: ''
        },
        formLabelWidth: '120px',
        // 选择的地址
        choosed: null,
        // 是否显示更多地址
        isMore: false,
        // 显示确认支付提示窗
        dialogVisible: false,
        // 地址信息校验规则,validator(校验方法),trigger(触发方式),blur为在组件 Input 失去焦点时触发
        rules: {
          address_name: [
            {
              required: true,
              message: '收货人不能为空',
              trigger: 'blur'
            }
          ],
          address_phone: [
            {
              required: true,
              message: '手机号不能为空',
              trigger: 'blur'
            },
            {
              pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
              message: '请输入正确的手机号',
              trigger: 'blur'
            }
          ],
          address_details: [
            {
              required: true,
              message: '地址信息不能为空',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    computed: {
      ...mapState('shoppingCar', ['carList']),
      ...mapGetters('shoppingCar', [
        'checkedNumber',
        'checkedPrice',
        'getCheckedGoods'
      ])
    },
    methods: {
      ...mapMutations('shoppingCar', ['DeleteShoppingCar', 'SetCarNumber']),
      //获取地址列表
      async getAddressList() {
        let result = await this.$axios.get('/api/address/getAddress')
        this.addressList = result.data.addressList
        // console.log(this.addressList.length)
        // 给选择的地址赋值
        if (this.addressList.length !== 0) {
          // console.log(this.addressList, this.addressList.splice(0, 1)[0])
          this.choosed = this.addressList.splice(0, 1)[0]
          // console.log(this.choosed)
        }
      },
      // 添加地址
      addAddress() {
        if (this.addressList.length >= 4) {
          this.$errorMessage('您保存的地址已达到上限！')
        } else {
          this.dialogFormVisible = true
        }
      },
      // 保存地址
      async saveAddress() {
        let { address_name, address_phone, address_details } = this.addressForm
        if (!this.isEdit) {
          this.$axios
            .post('/api/address/addAddress', {
              address_name,
              address_phone,
              address_details
            })
            .then((resolve) => {
              if (resolve.data.code === '0') {
                //重新获取地址列表
                this.getAddressList()
                // 隐藏表单
                this.dialogFormVisible = false
                //提示添加成功信息
                this.$successedMessage(resolve.data.message)
              } else {
                //提示添加失败信息
                this.$errorMessage(resolve.data.message)
              }
              this.$refs.ruleForm.resetFields()
            })
        }
      },

      // 添加我的订单
      async addOrder(order_status) {
        // 关闭弹窗
        this.dialogVisible = false
        // 判断是否选择地址
        if (!this.choosed) {
          this.$errorMessage('请选择收货地址')
          return
        }
        let result = await this.$axios.post('/api/order/addOrder', {
          address_id: this.choosed.address_id,
          goodsList: this.getCheckedGoods,
          order_status,
          order_price: this.checkedPrice
        })
        // “0”代表结算成功
        if (result.data.code === '0') {
          for (let value of this.getCheckedGoods) {
            // 删除已经结算的购物车商品
            this.DeleteShoppingCar(value.goods_id)
            // 修改购物车数量
            this.SetCarNumber(this.carList.length)
          }
          // 提示结算结果
          this.$successedMessage(result.data.message)
          // 跳转我的订单页面
          this.$router.replace({ path: '/myOrder' })
        } else {
          // 提示失败信息
          this.$errorMessage(result.data.message)
        }
      },
      // 改变选中地址
      changeChoosed(index) {
        this.addressList.push(this.choosed)
        this.choosed = this.addressList.splice(index, 1)[0]
        this.isMore = !this.isMore
      },
      // 取消保存重置表单数据和清除表单验证
      handleCancel() {
        this.$nextTick(function () {
          this.$refs.ruleForm.resetFields()
          for (let key in this.addressForm) {
            this.addressForm[key] = ''
          }
          this.dialogFormVisible = false
        })
      }
    },
    activated() {
      this.getAddressList()
      // 如果没有勾选购物车商品直接进入确认订单页面,提示信息并返回购物车
      if (this.checkedNumber < 1) {
        this.$errorMessage('请勾选商品后再结算')
        this.$router.push({ path: '/shoppingCart' })
      }
    }
  }
</script>

<style scoped>
  .order {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }
  /* 头部CSS */
  .header {
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
  }
  .header-content {
    width: 1200px;
    margin: 0 auto;
    height: 80px;
  }
  .header-content p {
    float: left;
    font-size: 28px;
    line-height: 80px;
    color: #424242;
    margin-right: 20px;
  }
  .header-content p i {
    font-size: 45px;
    color: #ff6700;
    line-height: 80px;
  }
  /* 头部CSS END */

  /* 主要内容容器CSS */
  .content {
    width: 1200px;
    margin: 0 auto;
    padding: 48px 0 0;
    background-color: #fff;
  }

  /* 选择地址CSS */
  .section-address {
    margin: 0 48px;
    overflow: hidden;
  }
  .address-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .section-address .title {
    color: #333;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 20px;
  }
  .address-add {
    margin-right: 55px;
  }
  .address-add a {
    color: orange;
  }
  .address-add a:hover {
    color: orangered;
  }
  .address-details {
    margin-bottom: 10px;
  }
  .address-details:hover {
    background-color: rgb(250, 224, 176);
  }
  .address-details span {
    margin-left: 20px;
    font-size: 14px;
  }
  .address-more {
    margin: 0 0 10px 20px;
  }
  /* 选择地址CSS END */

  /* 商品列表CSS */
  .section-goods {
    margin: 0 48px;
  }
  .section-goods p.title {
    color: #333;
    font-size: 18px;
    line-height: 40px;
  }
  .goods-list {
    padding: 5px 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 16px;
  }
  .goods-list li {
    display: flex;
    padding: 10px 0;
    color: #424242;
    overflow: hidden;
  }
  .goods-list li img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
  .goods-list li .pro-name {
    width: 650px;
    line-height: 30px;
  }
  .goods-list li .pro-price {
    width: 150px;
    text-align: center;
    line-height: 30px;
  }
  .goods-list li .pro-status {
    width: 99px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }
  .goods-list li .pro-total {
    width: 190px;
    text-align: center;
    color: #ff6700;
    line-height: 30px;
  }
  /* 商品列表CSS END */

  /* 配送方式CSS */
  .section-shipment {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
  }
  .section-shipment .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
  }
  .section-shipment .shipment {
    float: left;
    line-height: 38px;
    font-size: 14px;
    color: #ff6700;
  }
  /* 配送方式CSS END */

  /* 发票CSS */
  .section-invoice {
    margin: 0 48px;
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
  }
  .section-invoice .title {
    float: left;
    width: 150px;
    color: #333;
    font-size: 18px;
    line-height: 38px;
  }
  .section-invoice .invoice {
    float: left;
    line-height: 38px;
    font-size: 14px;
    margin-right: 20px;
    color: #ff6700;
  }
  /* 发票CSS END */

  /* 结算列表CSS */
  .section-count {
    margin: 0 48px;
    padding: 20px 0;
    font-size: 16px;
    overflow: hidden;
  }
  .section-count .money-box {
    float: right;
    text-align: right;
  }
  .section-count .money-box .title {
    float: left;
    width: 126px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #757575;
  }
  .section-count .money-box .value {
    float: left;
    min-width: 105px;
    height: 30px;
    display: block;
    line-height: 30px;
    color: #ff6700;
  }
  .section-count .money-box .total .title {
    padding-top: 15px;
  }
  .section-count .money-box .total .value {
    padding-top: 10px;
  }
  .section-count .money-box .total-price {
    font-size: 30px;
  }
  /* 结算列表CSS END */

  /* 结算导航CSS */
  .section-bar {
    padding: 20px 48px;
    border-top: 2px solid #f5f5f5;
    overflow: hidden;
  }
  .section-bar .btn {
    float: right;
  }
  .section-bar .btn .btn-base {
    float: left;
    margin-left: 30px;
    width: 158px;
    height: 38px;
    border: 1px solid #b0b0b0;
    font-size: 14px;
    line-height: 38px;
    text-align: center;
  }
  .section-bar .btn .btn-return {
    color: rgba(0, 0, 0, 0.27);
    border-color: rgba(0, 0, 0, 0.27);
  }
  .section-bar .btn .btn-primary {
    background: #ff6700;
    border-color: #ff6700;
    color: #fff;
  }
  /* 结算导航CSS */

  /* 主要内容容器CSS END */
</style>
