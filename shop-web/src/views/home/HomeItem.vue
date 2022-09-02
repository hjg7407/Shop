<template>
  <div class="home">
    <!--轮播图-->
    <div class="block" v-show="banners">
      <el-carousel height="420px">
        <el-carousel-item v-for="item in banners" :key="item.banner_id">
          <img
            style="height: 420px; width: 1200px"
            :src="$baseURL + item.imgPath"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 商品分类列表 -->
    <div class="category" v-show="category">
      <goods-list
        v-for="item in category"
        :key="item.category_id"
        :categoryObj="item"
      />
    </div>
  </div>
</template>

<script>
  import GoodsList from './GoodsList.vue'
  export default {
    components: { GoodsList },
    name: 'HomeItem',
    data() {
      return {
        banners: '',
        category: ''
      }
    },
    created() {
      this.getBanners(), this.getCategory()
    },
    methods: {
      // 获取轮播图数据
      async getBanners() {
        let result = await this.$axios.get('/api/resources/banners')
        this.banners = result.data.banners
      },
      //获取商品分类数据
      async getCategory() {
        let result = await this.$axios.get('/api/goods/category')
        this.category = result.data.category
      }
    }
  }
</script>

<style scoped>
  .home {
    width: 1200px;
    min-width: 1200px;
    margin: 0 auto;
  }
  .block {
    margin-bottom: 20px;
  }
</style>
