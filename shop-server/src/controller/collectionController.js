const {
  findCollection,
  addCollection,
  fineAllCollection,
  deleteCollection
} = require('../service/collectionServer')
const { fineGoodsDetails } = require('../service/goodsServer')
const {
  findCollectionError,
  collectionExistedError,
  addCollectionError,
  deleteCollectionError
} = require('../constant/errorType')

class CollectionController {
  //添加收藏
  async addCollection(ctx, next) {
    let { user_id } = ctx.state.user
    let { goods_id } = ctx.request.body
    try {
      // 判断该用户的收藏列表是否存在该商品
      let temp = await findCollection(user_id, goods_id)
      if (temp.length > 0) {
        console.error('收藏列表已存在该商品')
        return ctx.app.emit('error', collectionExistedError, ctx)
      }
      // 获取当前时间戳
      let timeTemp = new Date().getTime()
      try {
        // 把收藏商品信息插入数据库
        let result = await addCollection({ user_id, goods_id, timeTemp })
        // 插入成功
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '0',
            message: '添加收藏成功'
          }
        }
      } catch (error) {
        console.error(error)
        return ctx.app.emit('error', addCollectionError, ctx)
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', findCollectionError, ctx)
    }
  }
  //获取收藏列表
  async getCollectionList(ctx, next) {
    let { user_id } = ctx.state.user
    try {
      let collectionList = await fineAllCollection(user_id)
      //根据收藏列表获取对应商品列表
      let goodsList = []
      for (let value of collectionList) {
        try {
          let goodsDetails = await fineGoodsDetails(value.goods_id)
          goodsList.push(goodsDetails[0])
        } catch (error) {
          console.error(error)
          return ctx.app.emit('error', fineGoodsDetailsError, ctx)
        }
      }
      ctx.body = {
        code: '0',
        goodsList
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', findCollectionError, ctx)
    }
  }
  //删除收藏
  async deleteCollection(ctx, next) {
    let { user_id } = ctx.state.user
    let { goods_id } = ctx.request.body
    try {
      // 判断该用户的收藏列表是否存在该商品
      let temp = await findCollection(user_id, goods_id)
      if (temp.length > 0) {
        try {
          let result = await deleteCollection(user_id, goods_id)
          // 判断是否删除成功
          if (result.affectedRows === 1) {
            ctx.body = {
              code: '0',
              message: '删除收藏商品成功'
            }
          }
        } catch (error) {
          console.error(error)
          return ctx.app.emit('error', deleteCollectionError, ctx)
        }
      } else {
        ctx.body = {
          code: '0',
          message: '该商品不在收藏列表'
        }
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', findCollectionError, ctx)
    }
  }
}
module.exports = new CollectionController()
