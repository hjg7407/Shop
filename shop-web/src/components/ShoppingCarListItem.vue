<template>
  <div class="content">
    <div class="goods_choose">
      <el-checkbox
        :value="goodsObj.isChecked"
        @change="isCheckedChange(index, $event)"
      ></el-checkbox>
    </div>
    <div class="goods_images">
      <img :src="$baseURL + goodsObj.goods_picture" alt="" />
    </div>
    <div class="goods_name">
      <router-link
        :to="{
          path: '/details',
          query: {
            goodsId: goodsObj.goods_id
          }
        }"
        >{{ goodsObj.goods_name }}</router-link
      >
    </div>
    <div class="goods_price">￥{{ goodsObj.goods_price | numFilter }}</div>
    <div class="goods_number">
      <el-input-number
        size="small"
        :value="goodsObj.number"
        @change="numberChange($event)"
        :min="1"
        :max="goodsObj.maxNumber"
      ></el-input-number>
    </div>
    <div class="goods_total">￥{{ totalPrice | numFilter }}</div>
    <div class="goods_delete">
      <el-popover placement="right" v-model="visible">
        <p>确定删除吗？</p>
        <div style="text-align: right; margin: 10px 0 0">
          <el-button type="plain" size="mini" @click="visible = false">
            取消
          </el-button>
          <el-button type="primary" size="mini" @click="deleteGoods(index)">
            确定
          </el-button>
        </div>
        <i class="el-icon-error" slot="reference" style="font-size: 18px"></i>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  export default {
    name: 'ShoppingCarListItem',
    props: { goodsObj: Object, index: Number },
    data() {
      return {
        //控制删除提示框是否显示
        visible: false
      }
    },
    computed: {
      totalPrice() {
        return this.goodsObj.number * this.goodsObj.goods_price
      }
    },
    methods: {
      ...mapActions('shoppingCar', ['updateGoodsNumber', 'deleteCarGoods']),
      ...mapMutations('shoppingCar', ['UpdateisChecked']),
      //改变选中状态
      isCheckedChange(index, value) {
        this.UpdateisChecked({ index, value })
      },
      // 更改商品数量
      numberChange(value) {
        let {
          index,
          goodsObj: { goods_id }
        } = this
        this.updateGoodsNumber({ goods_id, index, number: value })
      },
      //删除购物车商品
      deleteGoods(index) {
        this.visible = false
        let { goods_id } = this.goodsObj
        this.deleteCarGoods({ index, goods_id })
      }
    }
  }
</script>

<style scoped>
  .content {
    display: flex;
    align-items: center;
    height: 85px;
    margin-top: 10px;
    border-radius: 5px;
    border: 1px solid rgb(232, 232, 232);
  }
  .content > div {
    height: 85px;
    line-height: 85px;
    font-size: 16px;
  }
  .goods_choose {
    padding: 0 20px;
  }
  .content .goods_images {
    display: flex;
    align-items: center;
    width: 110px;
  }
  .goods_images img {
    width: 80px;
    height: 80px;
  }
  .goods_name {
    /* 标题在一行显示 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 355px;
    font-weight: 500;
    padding-left: 10px;
  }
  .goods_price {
    width: 150px;
    text-align: center;
  }
  .goods_number {
    width: 150px;
    margin-left: 40px;
  }
  .goods_total {
    width: 150px;
    margin-left: 10px;
    text-align: center;
    color: orange;
  }
  .goods_delete {
    margin-left: 95px;
    width: 20px;
  }
</style>
