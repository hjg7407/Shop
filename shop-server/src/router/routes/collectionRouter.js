const Router = require('koa-router')

const { auth } = require('../../middleware/authMiddleware')
const { validator } = require('../../middleware/collectionMiddleware')
const {
  addCollection,
  getCollectionList,
  deleteCollection
} = require('../../controller/collectionController')

const collection = new Router({ prefix: '/collection' })

// 添加收藏
collection.post(
  '/add',
  auth,
  validator({ goods_id: { type: 'number', required: true } }),
  addCollection
)
//获取收藏列表
collection.get('/collectionList', auth, getCollectionList)
//删除收藏
collection.post(
  '/delete',
  auth,
  validator({ goods_id: { type: 'number', required: true } }),
  deleteCollection
)

module.exports = collection
