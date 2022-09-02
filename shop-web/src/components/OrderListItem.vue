<template>
  <div class="orderlist">
    <div class="header">
      <div class="details">
        <div>商品详情</div>
        <div>单价</div>
        <div>数量</div>
      </div>
      <div>金额</div>
      <div>状态</div>
      <div>操作</div>
    </div>
    <ul class="order-list">
      <li class="order" v-for="(item, index) in orderList" :key="item.id">
        <div class="order-header">
          <div class="left">
            <span>{{ item.order_time | dateFilter }}</span>
            <span>订单编号: {{ item.order_id }}</span>
          </div>
          <!-- 删除订单 -->
          <div class="right">
            <el-popover placement="right" :ref="'ref_' + item.order_id">
              <p>确定要删除该订单吗？</p>
              <div style="text-align: right; margin: 10px 0 0">
                <el-button
                  type="plain"
                  size="mini"
                  @click="$refs['ref_' + item.order_id][0].doClose()"
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="deleteOrder(item.order_id, item.order_status, index)"
                >
                  确定
                </el-button>
              </div>
              <i class="el-icon-delete" slot="reference"></i>
            </el-popover>
          </div>
        </div>
        <!-- 订单详情 -->
        <div class="list-content">
          <ul class="goods-list">
            <li
              class="goods"
              v-for="value in item.goodsList"
              :key="value.goods_id"
            >
              <div class="goods-details">
                <div class="goods-img">
                  <img :src="$baseURL + value.goods_picture" alt="" />
                </div>
                <router-link
                  :to="{
                    path: '/details',
                    query: { goodsId: value.goods_id }
                  }"
                  class="goods-name"
                >
                  {{ value.goods_name }}
                </router-link>
              </div>
              <div class="goods-price">
                {{ value.goods_price | numFilter }}
              </div>
              <div class="goods-number">x{{ value.goods_number }}</div>
            </li>
          </ul>
          <div class="order-price">
            <div>
              {{ item.order_price | numFilter }}
            </div>
          </div>
          <div class="order-status">
            <div>
              {{ item.order_status | orderStatus }}
            </div>
          </div>
          <div class="action">
            <div v-if="item.order_status === 1">
              <a @click="handleDialog(item.order_id, index, 'payDialog')">
                去付款
              </a>
            </div>
            <div v-if="item.order_status < 3">
              <a @click="handleDialog(item.order_id, index, 'cancelDialog')">
                取消订单
              </a>
            </div>
            <div v-if="item.order_status === 3">
              <a @click="handleDialog(item.order_id, index, 'confirmDialog')">
                确认收货
              </a>
            </div>
            <!-- <div v-if="item.order_status === 4"><a>去评价</a></div> -->
          </div>
        </div>
      </li>
    </ul>
    <el-dialog title="确认付款" :visible.sync="payDialog" width="30%">
      <span>是否已完成支付</span>
      <span slot="footer">
        <el-button @click="payDialog = false">取 消</el-button>
        <el-button type="primary" @click="payOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="取消订单" :visible.sync="cancelDialog" width="30%">
      <span>是否要取消该订单</span>
      <span slot="footer">
        <el-button @click="cancelDialog = false">取 消</el-button>
        <el-button type="primary" @click="cancelOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认收货" :visible.sync="confirmDialog" width="30%">
      <span>是否已收到商品</span>
      <span slot="footer">
        <el-button @click="confirmDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 订单为空的时候显示的内容 -->
    <div v-show="isEmpty" class="is_empty">
      <div>
        <h2>您的订单还是空的！</h2>
        <router-link to="/home">去首页看看</router-link>
      </div>
    </div>
    <!--  订单为空的时候显示的内容END -->
  </div>
</template>

<script>
  export default {
    name: 'OrderListItem',
    props: { orderList: Array },
    data() {
      return {
        // 控制弹窗
        payDialog: false,
        cancelDialog: false,
        confirmDialog: false,
        // 需要操作的订单编号
        order_id: '',
        // 需要操作的项
        index: '',
        isEmpty: false
      }
    },
    activated() {
      if (!this.orderList) {
        this.isEmpty = true
      }
    },
    methods: {
      // 删除订单
      async deleteOrder(order_id, order_status, index) {
        // 关闭提示框
        this.$refs['ref_' + order_id][0].showPopper = false
        // 判断订单是否已完成
        if (order_status !== 4 && order_status !== 5) {
          this.$errorMessage('订单未完成交易，不能删除!')
          // console.log(order_id, order_status)
        } else {
          let result = await this.$axios.post('/api/order/deleteOrder', {
            order_id
          })
          if (result.data.code === '0') {
            this.orderList.splice(index, 1)
            this.$successedMessage(result.data.message)
          } else {
            this.$errorMessage(result.data.message)
          }
        }
      },
      // 获取需要操作的订单号和订单项
      handleDialog(order_id, index, key) {
        this[key] = true
        this.order_id = order_id
        this.index = index
      },
      // 去付款
      async payOrder() {
        this.payDialog = false
        let result = await this.$axios.post('/api/order/payOrder', {
          order_id: this.order_id
        })
        if (result.data.code === '0') {
          this.orderList[this.index].order_status = 2
          this.$successedMessage(result.data.message)
        } else {
          this.$errorMessage(result.data.message)
        }
      },
      // 取消订单
      async cancelOrder() {
        this.cancelDialog = false
        let result = await this.$axios.post('/api/order/cancelOrder', {
          order_id: this.order_id
        })
        if (result.data.code === '0') {
          this.orderList[this.index].order_status = 5
          this.$successedMessage(result.data.message)
        } else {
          this.$errorMessage(result.data.message)
        }
      },
      // 确认收货
      async confirmOrder() {
        this.confirmDialog = false
        let result = await this.$axios.post('/api/order/confirmOrder', {
          order_id: this.order_id
        })
        if (result.data.code === '0') {
          this.orderList[this.index].order_status = 4
          this.$successedMessage(result.data.message)
        } else {
          this.$errorMessage(result.data.message)
        }
      }
    },
    // 订单状态过滤器
    filters: {
      orderStatus(values) {
        switch (values) {
          case 1:
            return '等待付款'
          case 2:
            return '等待发货'
          case 3:
            return '等待收货'
          case 4:
            return '交易成功'
          case 5:
            return '交易取消'
        }
      }
    }
  }
</script>

<style scoped>
  .orderlist {
    margin-bottom: 20px;
  }
  .header {
    display: flex;
    align-items: center;
    height: 45px;
    background-color: rgb(245, 245, 245);
    border: 1px solid rgb(232, 232, 232);
  }
  .header .details {
    display: flex;
    flex: 6;
  }
  .header > div {
    flex: 1;
    font-size: 14px;
    text-align: center;
  }
  .header .details div:first-child {
    flex: 4;
  }
  .header .details div {
    flex: 1;
  }
  .order-list .order {
    margin-top: 20px;
    border: 1px solid rgb(232, 232, 232);
  }
  .order-list .order:hover {
    border-color: rgb(191, 191, 191);
  }
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding: 0 15px;
    font-size: 14px;
    background-color: rgb(245, 245, 245);
  }
  .order-header .left span {
    margin-right: 10px;
  }
  .right {
    width: 20px;
    margin-right: 35px;
    font-size: 18px;
  }
  .list-content {
    display: flex;
    font-size: 14px;
    text-align: center;
  }
  .goods-list {
    display: flex;
    flex: 6;
    flex-direction: column;
    text-align: start;
  }
  .list-content > div {
    flex: 1;
    border-left: 1px solid rgb(232, 232, 232);
  }
  .goods {
    display: flex;
    border-bottom: 1px solid rgb(232, 232, 232);
  }
  .goods:last-child {
    border-bottom: 0;
  }
  .goods-details {
    display: flex;
    flex: 4;
    height: 110px;
    padding: 15px;
    padding-right: 0;
  }
  .goods-price,
  .goods-number {
    flex: 1;
    text-align: center;
    padding-top: 15px;
  }
  .goods-img {
    width: 80px;
    height: 80px;
    margin-right: 15px;
    vertical-align: top;
    background-color: #bfa;
  }
  .goods-img img {
    width: 100%;
  }
  .goods-name {
    width: 360px;
    /* 长数字或英文不换行 */
    word-wrap: break-word;
  }
  .order-price div,
  .order-status div,
  .action div {
    margin-top: 15px;
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
