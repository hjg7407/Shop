<template>
  <div class="collection">
    <div class="c_header">
      <div class="c_title">
        <i class="el-icon-collection-tag" style="color: #ff6700"></i>
        我的收藏
      </div>
    </div>
    <div class="content">
      <div v-if="goodsList.length > 0">
        <ul class="collection_list">
          <li v-for="(item, index) in goodsList" :key="item.goods_id">
            <goods-list-item
              :goodsObj="item"
              :index="index"
              :isDelete="true"
            ></goods-list-item>
          </li>
        </ul>
      </div>
      <!-- 收藏列表为空的时候显示的内容 -->
      <div v-else class="is_empty">
        <div>
          <h2>您的收藏还是空的！</h2>
          <p>快去购物吧！</p>
        </div>
      </div>
      <!--  收藏列表为空的时候显示的内容END -->
    </div>
  </div>
</template>

<script>
  import GoodsListItem from '../components/GoodsListItem'
  export default {
    name: 'CollectionItem',
    components: { GoodsListItem },
    data() {
      return {
        goodsList: ''
      }
    },
    activated() {
      //获取收藏列表
      this.getGoodsList()
      // console.log(this.goodsList)
    },
    mounted() {
      //绑定一个全局事件，用来更新删除收藏后的数据列表
      this.$bus.$on('refreshList', (index) => {
        this.goodsList.splice(index, 1)
      })
    },
    //组件将被销毁时解绑全局事件
    beforeDestroy() {
      this.$bus.$off('refreshList')
    },
    methods: {
      async getGoodsList() {
        let result = await this.$axios.get('/api/collection/collectionList')
        this.goodsList = result.data.goodsList
      }
    }
  }
</script>

<style scoped>
  .collection {
    width: 1200px;
    margin: 0 auto;
  }
  .c_header {
    height: 64px;
    background-color: #fff;
    border-bottom: 2px solid #ff6700;
  }
  .c_title {
    height: 64px;
    line-height: 58px;
    font-size: 28px;
  }
  .content {
    padding: 20px 0;
  }
  .collection_list {
    display: flex;
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
