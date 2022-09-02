const Router = require('koa-router')

const {
  getCategory,
  getGoodsList,
  getSearchList,
  getGoodsBanners,
  getGoodsDetails,
  searchGoods
} = require('../../controller/goodsController')
const { getCategoryId, getOrder } = require('../../middleware/goodsMiddleware')

const goods = new Router({ prefix: '/goods' })

//获取商品分类信息接口
goods.get('/category', getCategory)
//获取首页商品列表接口
goods.post('/goodsList', getCategoryId, getGoodsList)
//获取搜索页面商品列表接口
goods.post('/searchList', getOrder, getSearchList)
//获取商品轮播图
goods.post('/banners', getGoodsBanners)
//获取商品详情
goods.post('/details', getGoodsDetails)
// 后台查询商品
goods.post('/searchForm', searchGoods)
module.exports = goods
