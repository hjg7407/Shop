<template>
  <div class="goods">
    <div class="header">
      <h1>{{ categoryObj.category_name }}</h1>
    </div>
    <div class="body">
      <div class="category" v-if="categoryObj.category_img">
        <img :src="$baseURL + categoryObj.category_img" />
      </div>
      <!-- 列表区 -->
      <div class="list">
        <ul>
          <li v-for="item in goodsList" :goodsObj="item" :key="item.goods_id">
            <goods-list-item :goodsObj="item" />
          </li>
          <li class="more">
            <router-link
              :to="{
                path: '/search',
                query: {
                  category_name: categoryObj.category_name
                }
              }"
            >
              浏览更多
              <i class="el-icon-d-arrow-right"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import GoodsListItem from '../../components/GoodsListItem'
  export default {
    name: 'GoodList',
    components: { GoodsListItem },
    props: {
      categoryObj: Object
    },
    data() {
      return {
        goodsList: ''
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      //获取首页商品列表信息
      async getGoodsList() {
        let { category_name } = this.categoryObj
        let result = await this.$axios.post('/api/goods/goodsList', {
          category_name
        })
        this.goodsList = result.data.goodsList
      }
    }
  }
</script>

<style scoped>
  .goods {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
  }
  .header {
    height: 58px;
  }
  .header h1 {
    float: left;
    font-size: 22px;
    font-weight: 200;
    line-height: 58px;
    color: #333;
  }
  .body {
    display: flex;
    height: 580px;
    margin-bottom: 20px;
  }
  .category {
    width: 224px;
    height: 580px;
  }
  .list {
    width: 976px;
    height: 580px;
  }
  .list ul {
    display: flex;
    /* 自动换行 */
    flex-wrap: wrap;
  }
  .more {
    z-index: 1;
    width: 224px;
    height: 280px;
    margin: 0 0 20px 20px;
    border: 1px solid transparent;
    background-color: rgb(245, 245, 245);
    font-size: 20px;
    line-height: 280px;
    text-align: center;
    transition: all 0.2 linear;
  }
  .more:hover {
    z-index: 2;
    border-color: orange;
  }
</style>
