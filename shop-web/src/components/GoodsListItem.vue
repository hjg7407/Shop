<template>
  <div class="item">
    <el-popover placement="top" v-model="visible">
      <p>确定删除吗？</p>
      <div style="text-align: right; margin: 10px 0 0">
        <el-button type="plain" size="mini" @click="visible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="deleteCollection()">
          确定
        </el-button>
      </div>
      <i
        class="el-icon-close delete_item"
        slot="reference"
        v-show="isDelete"
      ></i>
    </el-popover>
    <router-link
      :to="{
        path: '/details',
        query: {
          goodsId: goodsObj.goods_id
        }
      }"
    >
      <img :src="$baseURL + goodsObj.goods_picture" />
      <h2>{{ goodsObj.goods_name }}</h2>
      <h3>{{ goodsObj.goods_title }}</h3>
      <p>
        <span>{{ goodsObj.goods_selling_price | numFilter}}元</span>
        <span
          v-show="goodsObj.goods_price != goodsObj.goods_selling_price"
          class="delete"
          >{{ goodsObj.goods_price | numFilter }}元
        </span>
      </p>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'GoodsListItem',
    props: {
      goodsObj: Object,
      index: Number,
      isDelete: Boolean
    },
    data() {
      return {
        //控制删除提示框是否显示
        visible: false
      }
    },
    methods: {
      //删除收藏商品
      async deleteCollection() {
        this.visible = false
        let { goods_id } = this.goodsObj
        let result = await this.$axios.post('/api/collection/delete', {
          goods_id
        })
        if (result.data.code === '0') {
          // 删除成功,隐藏删除提示框
          this.visible = false
          // 删除列表中的该商品信息
          this.$bus.$emit('refreshList', this.index)
          // 提示删除成功信息
          this.$successedMessage(result.data.message)
        } else {
          // 提示删除失败信息
          this.$errorMessage(result.data.message)
        }
      }
    }
  }
</script>

<style scoped>
  .item {
    position: relative;
    z-index: 1;
    width: 224px;
    height: 280px;
    margin: 0 0 20px 20px;
    background-color: rgb(245, 245, 245);
    border: 1px solid transparent;
    transition: all 0.2s linear;
  }
  .item:hover {
    z-index: 2;
    border-color: orange;
  }
  /* 删除按钮 */
  .delete_item {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    display: none;
  }
  .item:hover .delete_item {
    display: block;
  }
  .delete_item:hover {
    color: #ff6700;
  }

  .item a {
    color: #000;
  }
  .item img {
    display: block;
    width: 160px;
    height: 160px;
    margin: 10px auto 0;
  }
  .item h2 {
    margin: 20px 10px 0;
    font-size: 16px;
    /* 字体粗细 */
    font-weight: 500;
    color: #000;
    text-align: center;
    /* 文本溢出时显示省略号 */
    text-overflow: ellipsis;
    /* 强制在同一行内显示所有文本，合并文本间的多余空白，直到文本结束或者遭遇br对象 */
    white-space: nowrap;
    overflow: hidden;
  }
  .item h3 {
    margin: 5px 10px;
    height: 18px;
    font-size: 13px;
    font-weight: 400;
    color: #b0b0b0;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .item p {
    margin: 10px 10px 10px;
    font-size: 14px;
    text-align: center;
    color: #ff6700;
  }
  .item .delete {
    margin-left: 0.5em;
    color: #b0b0b0;
    text-decoration: line-through;
  }
</style>
