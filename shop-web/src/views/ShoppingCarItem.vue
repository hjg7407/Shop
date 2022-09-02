<template>
  <div class="shoppingcar">
    <div class="header">
      <div class="title">
        <p>
          <i class="el-icon-shopping-cart-2"></i>
          我的购物车
        </p>
        <span>温馨提示：产品是否购买成功，以最终下单为准哦，请尽快结算</span>
      </div>
    </div>
    <div class="content" v-show="carList">
      <ul>
        <!-- 购物车表头 -->
        <li class="content_header">
          <div class="goods_name">商品名称</div>
          <div class="goods_price">单价</div>
          <div class="goods_number">数量</div>
          <div class="goods_total">小计</div>
          <div class="goods_delete">删除</div>
        </li>
        <!-- 商品列表 -->
        <li v-for="(item, index) in carList" :key="item.sc_id">
          <shopping-car-list-item
            :goodsObj="item"
            :index="index"
          ></shopping-car-list-item>
        </li>
      </ul>
    </div>
    <!-- 结算 -->
    <div class="footer" v-show="carList">
      <div class="f_left">
        <div class="check_all">
          <el-checkbox v-model="isCheckedAll">全选</el-checkbox>
        </div>
        <span>|</span>
        <span class="shoptotal">
          共
          <span class="color_ff6700">{{ carList.length }}</span> 件商品，已选择
          <span class="color_ff6700">{{ checkedNumber }}</span> 件
        </span>
      </div>
      <div class="f_right">
        <span class="total">合计：</span>
        <span class="color_ff6700 price">{{ checkedPrice | numFilter }}元</span>
        <router-link :to="isEnable === true ? '/order' : ''">
          <div
            class="btn"
            :class="isEnable === true ? 'btn_enable' : 'btn_disabled'"
          >
            去结算
          </div>
        </router-link>
      </div>
    </div>
    <!-- 收藏列表为空的时候显示的内容 -->
    <div v-show="!carList" class="is_empty">
      <div>
        <h2>您的购物车还是空的！</h2>
        <p>快去购物吧！</p>
      </div>
    </div>
    <!--  收藏列表为空的时候显示的内容END -->
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import ShoppingCarListItem from '../components/ShoppingCarListItem'
  export default {
    name: 'ShoppingCarItem',
    components: { ShoppingCarListItem },
    created() {
      //获取购物车列表
      this.getCarList()
    },
    computed: {
      ...mapGetters('shoppingCar', ['checkedNumber', 'checkedPrice']),
      ...mapState('shoppingCar', ['carList', 'number']),
      //全选或全不选
      isCheckedAll: {
        get() {
          return this.carList.every((value) => value.isChecked === true)
        },
        set(value) {
          this.UpdateAllItemChecked(value)
        }
      },
      //控制去结算按钮是否能用
      isEnable: {
        get() {
          return this.carList.some((value) => value.isChecked === true)
        }
      }
    },
    methods: {
      ...mapActions('shoppingCar', ['getCarList']),
      ...mapMutations('shoppingCar', ['UpdateAllItemChecked'])
    }
  }
</script>

<style scoped>
  .shoppingcar {
    width: 1200px;
    margin: 0 auto;
  }
  /* 头部 */
  .color_ff6700 {
    color: #ff6700;
  }
  .header {
    height: 64px;
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
  }
  .title {
    display: flex;
    height: 64px;
    line-height: 58px;
    font-size: 28px;
  }
  .title i {
    color: #ff6700;
    font-weight: 600;
  }
  .title span {
    height: 64px;
    line-height: 20px;
    font-size: 12px;
    color: #757575;
    padding: 28px 12px 0;
  }
  /* 购物车表头 */
  .content_header {
    display: flex;
    justify-content: space-between;
    height: 85px;
    font-weight: 550;
    margin-top: 20px;
    background-color: rgb(245, 245, 245);
  }
  .content_header div {
    height: 85px;
    line-height: 85px;
    font-size: 16px;
    text-align: center;
  }
  .content_header .goods_name {
    padding-right: 85px;
    width: 500px;
  }
  .content_header div {
    width: 150px;
  }
  /* 尾部 */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    bottom: 241px;
    margin-top: 5px;
    border: 1px solid orange;
  }
  .f_left {
    display: flex;
    align-items: center;
    font-size: 16px;
  }
  .check_all >>> .el-checkbox__inner {
    font-size: 16px;
    margin-left: 20px;
  }
  .check_all >>> .el-checkbox__label {
    font-size: 16px;
    padding-left: 20px;
    margin-right: 20px;
  }
  .shoptotal {
    margin-left: 20px;
  }
  .f_right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .total {
    font-size: 16px;
  }
  .price {
    font-size: 30px;
  }
  .btn {
    width: 200px;
    height: 64px;
    text-align: center;
    line-height: 64px;
    font-size: 18px;
    margin-left: 50px;
  }
  .btn_enable {
    background: #ff6700;
    color: #fff;
  }
  .btn_enable:hover {
    background: #f25807;
  }
  .btn_disabled {
    width: 198px;
    height: 62px;
    background: #e0e0e0;
    color: #b0b0b0;
  }
  .is_empty {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 560px;
    text-align: center;
    background-color: azure;
    color: rgb(189, 151, 102);
    font-size: 20px;
  }
</style>
