<template>
  <div class="details">
    <div class="d_header">
      <div class="main">
        <div class="title">{{ name }}</div>
        <div class="list">
          <ul>
            <li><router-link to="">商品详情</router-link></li>
            <li><router-link to="">参数</router-link></li>
            <li><router-link to="">用户评价</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="banner">
        <!--轮播图-->
        <div class="block">
          <el-carousel height="530px">
            <el-carousel-item
              v-for="item in goodsBanners"
              :key="item.goods_banner_id"
            >
              <img
                style="height: 530px"
                :src="$baseURL + item.goods_banner_imgPath"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 内容区 -->
      <div class="content">
        <h1>
          <p>{{ name }}</p>
          <p>{{ title }}</p>
        </h1>
        <p>{{ info }}</p>
        <div class="price">
          <span>{{ selling_price }}元</span>
          <span v-show="price != selling_price" class="delete">
            {{ price }}元
          </span>
        </div>
        <!-- 总计 -->
        <div class="total_list">
          <span class="total_name">{{ name }}</span>
          <span class="total_price">
            <span>{{ selling_price }}元</span>
            <span v-show="price != selling_price" class="total_delete">
              {{ price }}元
            </span>
          </span>
          <p class="total_sum">总计 : {{ selling_price }}元</p>
        </div>
        <!-- 购物车与收藏按钮 -->
        <div class="button">
          <el-button class="shopcar" :disabled="isTrue" @click="addShoppingCar">
            加入购物车
          </el-button>
          <el-button class="collect" @click="addCollect">收藏</el-button>
        </div>
        <!-- 底部Tips -->
        <div class="d_footer">
          <li><i class="el-icon-circle-check"></i> 7天无理由退换货</li>
          <li><i class="el-icon-circle-check"></i> 7天价格保护</li>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: 'GoodsDetailsItem',
    data() {
      return {
        isTrue: false, //控制购物车按钮能否使用
        goodsBanners: '', //商品轮播图
        goodsObj: '', //商品信息
        goodsId: '' //商品id
      }
    },
    activated() {
      //数据创建好之后从路由获取参数
      this.goodsId = Number(this.$route.query.goodsId)
    },
    computed: {
      ...mapState('shoppingCar', ['number']),
      name() {
        return this.goodsObj.goods_name
      },
      price() {
        return this.goodsObj.goods_price
      },
      selling_price() {
        return this.goodsObj.goods_selling_price
      },
      title() {
        return this.goodsObj.goods_title
      },
      info() {
        return this.goodsObj.goods_info
      }
    },
    watch: {
      // 监听商品id的变化，请求后端获取商品数据
      goodsId: function (value) {
        this.getbanner(value)
        this.getdetails(value)
      }
    },
    methods: {
      ...mapMutations('shoppingCar', [
        'SetCarNumber',
        'AddshoppingCar',
        'AddNumber'
      ]),
      //判断是否登录
      islogin() {
        let token = localStorage.getItem('Token')
        if (!token) {
          this.$router.push({
            path: '/login',
            query: {
              redirect: this.$router.currentRoute.fullPath
            }
          })
          return
        }
      },
      //获取商品轮播图
      async getbanner(value) {
        let result = await this.$axios.post('/api/goods/banners', {
          goodsId: Number(value)
        })
        this.goodsBanners = result.data.goodsBanners
      },
      //获取商品信息
      async getdetails(value) {
        let result = await this.$axios.post('/api/goods/details', {
          //将goodsId强制转为Number类型，防止出错
          goodsId: Number(value)
        })
        this.goodsObj = result.data.goodsDetails[0]
      },
      //加入购物车
      async addShoppingCar() {
        this.islogin()
        let { goodsId } = this
        let result = await this.$axios.post('/api/shoppingCar/add', {
          goods_id: goodsId
        })
        if (result.data.code === '0') {
          //返回0代表添加成功，显示成功提示信息
          this.$successedMessage(result.data.message)
          //如果购物车没有该商品，则修改购物车数量
          if (result.data.carList) {
            //更改购物车数量
            let number = this.number + 1
            this.SetCarNumber(number)
            //更新购物车列表
            this.AddshoppingCar(result.data.carList[0])
          } else {
            // 更新购物车该商品数量
            this.AddNumber(goodsId)
          }
        } else {
          //否则显示失败提示信息
          this.$errorMessage(result.data.message)
        }
      },
      //加入收藏
      async addCollect() {
        this.islogin()
        let { goodsId } = this
        let result = await this.$axios.post('/api/collection/add', {
          goods_id: goodsId
        })
        if (result.data.code === '0') {
          //返回0代表添加成功，显示成功提示信息
          this.$successedMessage(result.data.message)
        } else {
          //否则显示失败提示信息
          this.$errorMessage(result.data.message)
        }
      }
    }
  }
</script>

<style scoped>
  .d_header {
    z-index: 4;
    height: 65px;
    background: #fff;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.07);
  }
  .main {
    display: flex;
    justify-content: space-between;
    width: 1200px;
    height: 65px;
    line-height: 65px;
    border-top: 1px solid orange;
    margin: 0 auto;
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #212121;
  }
  .list ul {
    display: flex;
    width: 200px;
    font-size: 14px;
    color: #616161;
    justify-content: space-between;
  }
  .body {
    display: flex;
    width: 1200px;
    height: 560px;
    padding-top: 30px;
    margin: 0 auto 30px;
    justify-content: space-between;
  }
  .banner {
    width: 530px;
    height: 530px;
  }
  .content {
    width: 670px;
    height: 530px;
    padding-left: 20px;
  }
  .content h1 {
    display: flex;
    align-items: center;
  }
  .content h1 p:first-child {
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    /* 默认值400 */
    font-weight: normal;
    color: #212121;
  }
  .content h1 p:last-child {
    height: 24px;
    margin-left: 10px;
    line-height: 24px;
    font-size: 20px;
    font-weight: normal;
    color: #212121;
  }
  .content > p {
    font-size: 14px;
    color: #b0b0b0;
    padding-top: 10px;
  }
  .price {
    padding: 25px 0;
    border-bottom: 1px solid #e0e0e0;
    font-size: 16px;
    color: #ff6700;
  }
  .delete {
    margin-left: 0.5em;
    color: #b0b0b0;
    text-decoration: line-through;
  }
  .total_list {
    background: #f9f9fa;
    padding: 30px 60px;
    margin: 50px 0;
  }
  .total_list span {
    line-height: 30px;
    font-size: 16px;
    color: #616161;
  }
  .total_price {
    float: right;
  }
  .total_delete {
    margin-left: 10px;
    text-decoration: line-through;
    color: #b0b0b0;
  }
  .total_sum {
    color: #ff6700;
    font-size: 24px;
    padding-top: 20px;
  }
  .button {
    display: flex;
    justify-content: space-between;
    height: 55px;
    margin: 10px 0 20px;
  }
  .button .el-button {
    height: 55px;
    border: none;
    font-size: 16px;
    color: #fff;
    text-align: center;
    padding: 20px 12px;
  }
  .shopcar {
    width: 340px;
    background-color: #ff6700;
  }
  .shopcar:hover {
    background-color: #f25807;
  }
  .collect {
    width: 260px;
    margin-right: 0;
    background-color: #b0b0b0;
  }
  .collect:hover {
    background-color: #757575;
  }
  .d_footer {
    display: flex;
    color: #b0b0b0;
  }
  .d_footer li {
    font-size: 16px;
    margin-right: 20px;
  }
</style>
