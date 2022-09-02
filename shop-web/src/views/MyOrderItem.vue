<template>
  <div class="myorder">
    <div class="body">
      <div class="header">
        <p>
          <i
            class="el-icon-s-order"
            style="font-size: 30px; color: #ff6700"
          ></i>
          我的订单
        </p>
      </div>
      <div class="content">
        <el-tabs class="nav">
          <el-tab-pane label="所有订单">
            <order-list-item :orderList="orderList"></order-list-item>
          </el-tab-pane>
          <el-tab-pane label="待付款">
            <order-list-item :orderList="notPayList"></order-list-item>
          </el-tab-pane>
          <el-tab-pane label="待发货">
            <order-list-item :orderList="notSendList"></order-list-item>
          </el-tab-pane>
          <el-tab-pane label="待收货">
            <order-list-item :orderList="notGetList"></order-list-item>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import OrderListItem from '../components/OrderListItem'
  export default {
    name: 'MyOrderItem',
    components: { OrderListItem },
    data() {
      return {
        orderList: []
      }
    },
    computed: {
      notPayList() {
        return this.orderList.filter((value) => {
          return value.order_status === 1
        })
      },
      notSendList() {
        return this.orderList.filter((value) => {
          return value.order_status === 2
        })
      },
      notGetList() {
        return this.orderList.filter((value) => {
          return value.order_status === 3
        })
      }
    },
    methods: {
      //获取订单列表数据
      async getOrderList() {
        let result = await this.$axios.get('/api/order/getOrderList')
        this.orderList = result.data.orderList
      }
    },
    activated() {
      this.getOrderList()
    }
  }
</script>

<style scoped>
  .myorder {
    background-color: #f5f5f5;
    padding-bottom: 20px;
  }
  .body {
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
  }
  .header {
    height: 64px;
    background-color: #f5f5f5;
    border-bottom: 2px solid #ff6700;
    margin-bottom: 20px;
  }
  .header p {
    font-size: 28px;
    line-height: 58px;
    font-weight: normal;
    color: #424242;
  }
  .content {
    padding: 0 45px;
  }
  .content >>> .el-tabs__item {
    font-size: 18px;
    font-weight: 700;
  }
  .content >>> .el-tabs__item:hover,
  .content >>> .is-active {
    color: orange;
  }
  .content >>> .el-tabs__active-bar {
    background-color: orange;
  }
</style>
