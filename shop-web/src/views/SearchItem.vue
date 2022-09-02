<template>
  <div class="search">
    <div class="w">
      <div class="header">
        <ul>
          <li :class="{ active: isTrue[0] }" @click="changeOrder(1)">
            综合排序
          </li>
          <li :class="{ active: isTrue[1] }" @click="changeOrder(2)">
            销量
            <i
              v-if="isTrue[1] && order[1] === 'desc'"
              class="el-icon-sort-down"
            ></i>
            <i
              v-else-if="isTrue[1] && order[1] === 'asc'"
              class="el-icon-sort-up"
            ></i>
            <i v-else class="el-icon-sort"></i>
          </li>
          <li :class="{ active: isTrue[2] }" @click="changeOrder(3)">
            价格
            <i
              v-if="isTrue[2] && order[1] === 'desc'"
              class="el-icon-sort-down"
            ></i>
            <i
              v-else-if="isTrue[2] && order[1] === 'asc'"
              class="el-icon-sort-up"
            ></i>
            <i v-else class="el-icon-sort"></i>
          </li>
        </ul>
      </div>
      <div class="body">
        <ul>
          <li v-for="item in goodsList" :key="item.goods_id">
            <goods-list-item :goodsObj="item" />
          </li>
        </ul>
        <div class="is_null" v-show="isEmpty">没有找到相关的商品</div>
      </div>
      <!-- 回到顶部按钮 -->
      <el-backtop target=".search"></el-backtop>
    </div>
  </div>
</template>

<script>
  import GoodsListItem from '../components/GoodsListItem'
  export default {
    name: 'SearchItem',
    components: { GoodsListItem },
    data() {
      return {
        //控制点击排序的样式是否显示
        isTrue: [true, false, false],
        goodsList: [], //数据列表
        order: [1, 'asc'], //排序（默认综合：升序）
        keyword: '', //搜索条件
        category_name: '', //分类名
        isEmpty: false //判断请求数据是否为空，空则显示
      }
    },
    created() {
      //创建的时候从路由获取数据
      this.category_name = this.$route.query.category_name
      this.keyword = this.$route.query.keyword
      this.getGoodsList({
        keyword: this.keyword,
        category_name: this.category_name,
        order: this.order
      })
    },
    watch: {
      //监听路由
      $route(value) {
        if (value.path === '/search') {
          if (value.query.keyword != this.keyword) {
            this.keyword = value.query.keyword
            this.getGoodsList({
              keyword: this.keyword,
              category_name: this.category_name,
              order: this.order
            })
          }
        }
      }
    },
    methods: {
      //获取商品列表
      async getGoodsList(value) {
        let result = await this.$axios.post('/api/goods/searchList', value)
        this.goodsList = result.data.searchList
        this.isEmpty = false
        if (this.goodsList.length === 0) this.isEmpty = true
      },
      //改变商品排序方法
      changeOrder(flag) {
        // flag:用户每一次点击li标签的时候，用于区分是综合（1）还是销量（2）价格（3）

        // 获取order初始状态
        let originFlag = this.order[0]
        let originSort = this.order[1]

        //新的排序方式
        let newOrder = null
        //判断的是多次点击的是不是同一个按钮
        if (flag === originFlag) {
          originSort = originSort === 'asc' ? 'desc' : 'asc'
          newOrder = [flag, originSort]
        } else {
          //点击不是同一个按钮
          newOrder = [flag, 'asc']
        }
        //需要给order重新赋值
        this.order = newOrder
        //再次发请求
        this.getGoodsList({
          keyword: this.keyword,
          category_name: this.category_name,
          order: this.order
        })
        //改变li样式
        this.isTrue = this.isTrue.map((value) => (value = false))
        this.isTrue[flag - 1] = true
      }
    }
  }
</script>

<style scoped>
  .w {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
  }
  .header {
    height: 40px;
    font-size: 14px;
    background-color: rgb(245, 245, 245);
    margin: 10px 0 20px;
    border: 1px solid rgb(232, 232, 232);
  }
  .header ul {
    display: flex;
    align-items: center;
  }
  .header ul li {
    height: 38px;
    line-height: 38px;
    padding: 0 20px;
    margin-left: -1px;
    border: 1px solid transparent;
  }
  /*  .header ul li:first-child {
    margin-left: 0;
  } */
  .header .active,
  .header ul li:hover {
    color: orangered;
    background-color: rgb(255, 255, 255);
    border-color: transparent rgb(232, 232, 232);
  }
  .body ul {
    display: flex;
    flex-wrap: wrap;
    width: 1220px;
    margin-left: -20px;
  }
  .is_null {
    height: 560px;
    line-height: 560px;
    text-align: center;
    background-color: azure;
    color: rgb(189, 151, 102);
    font-size: 20px;
  }
</style>
