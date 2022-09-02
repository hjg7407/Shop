const Router = require('koa-router')

const { auth } = require('../../middleware/authMiddleware')
const { validator } = require('../../middleware/addressMiddleware')
const {
  getAddress,
  addAddress,
  deleteAddress,
  updateAddress,
  defaultAddress
} = require('../../controller/addressController')

const address = new Router({ prefix: '/address' })

// 获取地址
address.get('/getAddress', auth, getAddress)
// 添加地址
address.post('/addAddress', auth, addAddress)
// 删除地址
address.post('/deleteAddress', auth, deleteAddress)
// 修改地址
address.post('/updateAddress', auth, updateAddress)
// 设置默认地址
address.post('/defaultAddress', auth, defaultAddress)

module.exports = address
