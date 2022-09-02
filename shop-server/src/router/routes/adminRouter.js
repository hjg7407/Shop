const Router = require('koa-router')

const { auth, isAdmin } = require('../../middleware/authMiddleware')
const {
  loginValidator,
  verifyLogin
} = require('../../middleware/usersMiddleware')

const {
  addBanner,
  deleteBanner
} = require('../../controller/resourcesController')

const {
  addCategory,
  editCategory,
  deleteCategory
} = require('../../controller/categoryController')

const {
  searchGoods,
  addGoods,
  editGoods,
  deleteGoods
} = require('../../controller/goodsController')

const {
  searchOrder,
  modifyOrder,
  shippingOrder
} = require('../../controller/orderController')

const {
  adminLogin,
  searchUser,
  resetPassword,
  deleteUser
} = require('../../controller/usersController')

const admin = new Router({ prefix: '/admin' })

//登录接口
admin.post('/login', loginValidator, verifyLogin, adminLogin)

// 添加轮播图
admin.post('/addBanner', auth, isAdmin, addBanner)
// 删除轮播图
admin.post('/deleteBanner', auth, isAdmin, deleteBanner)

// 添加商品分类
admin.post('/addCategory', auth, isAdmin, addCategory)
// 编辑商品分类
admin.post('/editCategory', auth, isAdmin, editCategory)
// 删除商品分类
admin.post('/deleteCategory', auth, isAdmin, deleteCategory)

// 根据条件获取商品
admin.post('/searchGoods', auth, isAdmin, searchGoods)
// 添加商品
admin.post('/addGoods', auth, isAdmin, addGoods)
// 编辑商品
admin.post('/editGoods', auth, isAdmin, editGoods)
// 删除商品
admin.post('/deleteGoods', auth, isAdmin, deleteGoods)

/* //获取未发货订单数
admin.get('/awaitedOrder', auth, isAdmin, awaitedOrder) */
// 根据条件获取订单
admin.post('/searchOrder', auth, isAdmin, searchOrder)
// 修改金额
admin.post('/modifyOrder', auth, isAdmin, modifyOrder)
// 订单发货
admin.post('/shippingOrder', auth, isAdmin, shippingOrder)

// 根据条件获取用户信息
admin.post('/searchUser', auth, isAdmin, searchUser)
// 重置密码
admin.post('/resetPassword', auth, isAdmin, resetPassword)
// 注销用户
admin.post('/deleteUser', auth, isAdmin, deleteUser)

module.exports = admin
