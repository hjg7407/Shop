const Router = require('koa-router')

const { auth } = require('../../middleware/authMiddleware')
const { validator } = require('../../middleware/shoppingCarMiddleware')
const {
  addShoopingCar,
  getCarList,
  getCarNumber,
  updateGoodsNumber,
  deleteCarGoods
} = require('../../controller/shoppingCarController')

const shoppingCar = new Router({ prefix: '/shoppingCar' })

//添加购物车
shoppingCar.post(
  '/add',
  auth,
  validator({ goods_id: { type: 'number', required: true } }),
  addShoopingCar
)
//获取购物车列表
shoppingCar.get('/carList', auth, getCarList)
//获取购物车数量
shoppingCar.get('/carNumber', auth, getCarNumber)
// 更新购物车某商品数量
shoppingCar.post('/updateGoodsNumber', auth, updateGoodsNumber)
// 删除购物车商品
shoppingCar.post('/deleteCarGoods', auth, deleteCarGoods)

module.exports = shoppingCar
