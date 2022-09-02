const {
  fineShoppingCarError,
  OverInventoryError,
  fineGoodsNumberError,
  updateShoppingCarError,
  addShoppingCarError,
  fineGoodsDetailsError,
  deleteCarGoodsError
} = require('../constant/errorType')
const {
  fineShoppingCar,
  updateShoppingCar,
  addShoppingCar,
  fineAllList,
  deleteShoppingCar
} = require('../service/shoppingCarServer')
const { fineGoodsNumber, fineGoodsDetails } = require('../service/goodsServer')

let methods = {
  //生成购物车详细列表
  async generateCarList(ctx,data) {
    let carList = []
    for (let value of data) {
      try {
        let goodsDetail = await fineGoodsDetails(value.goods_id)
        //购物车数量大于库存，更改购物车数量
        if (value.number > goodsDetail[0].goods_number) {
          try {
            await updateShoppingCar({
              number: goodsDetail[0].goods_number,
              user_id,
              goods_id: value.goods_id
            })
          } catch (error) {
            console.error(error)
            return ctx.app.emit('error', updateShoppingCarError, ctx)
          }
        }
        let goodsTemp = {
          id: value.sc_id,
          goods_id: value.goods_id,
          goods_name: goodsDetail[0].goods_name,
          goods_picture: goodsDetail[0].goods_picture,
          goods_price: goodsDetail[0].goods_selling_price,
          number: value.number,
          maxNumber: goodsDetail[0].goods_number,
          isChecked: false
        }
        carList.push(goodsTemp)
      } catch (error) {
        console.error(error)
        return ctx.app.emit('error', fineGoodsDetailsError, ctx)
      }
    }
    return carList
  }
}

class ShoppingCarController {
  // 添加购物车
  async addShoopingCar(ctx, next) {
    let { user_id } = ctx.state.user
    let { goods_id } = ctx.request.body
    //判断该用户的购物车是否存在该商品
    try {
      let temp = await fineShoppingCar(user_id, goods_id)
      //如果存在则把数量+1
      if (temp.length > 0) {
        let tempNumber = temp[0].number + 1
        //查找商品库存数量
        try {
          let goodsNumber = await fineGoodsNumber(goods_id)
          //判断数量是否超过库存数量
          if (tempNumber > goodsNumber) {
            console.log(addShoppingCarError.message)
            return ctx.app.emit('error', OverInventoryError, ctx)
          }
        } catch (error) {
          console.error(error)
          return ctx.app.emit('error', fineGoodsNumberError, ctx)
        }
        // 更新购物车信息,把数量+1
        try {
          let result = await updateShoppingCar({
            number: tempNumber,
            user_id,
            goods_id
          })
          if (result.affectedRows === 1) {
            ctx.body = {
              code: '0',
              message: '添加购物车成功'
            }
          }
        } catch (error) {
          console.log(updateShoppingCarError.message)
          return ctx.app.emit('error', updateShoppingCarError, ctx)
        }
      } else {
        //不存在则添加
        try {
          // 插入购物车
          let result = await addShoppingCar(user_id, goods_id)
          // 判断是否插入成功
          if (result.affectedRows === 1) {
            try {
              let data = await fineShoppingCar(user_id, goods_id)
              // console.log(data)
              let carList = await methods.generateCarList(ctx,data)
              // console.log(carList)
              ctx.body = {
                code: '0',
                message: '添加购物车成功',
                carList
              }
            } catch (error) {
              console.log(fineShoppingCarError.message)
              return ctx.app.emit('error', fineShoppingCarError, ctx)
            }
          }
        } catch (error) {
          console.log(addShoppingCarError.message)
          return ctx.app.emit('error', addShoppingCarError, ctx)
        }
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineShoppingCarError, ctx)
    }
  }
  // 获取购物车列表
  async getCarList(ctx, next) {
    let { user_id } = ctx.state.user
    try {
      let list = await fineAllList(user_id)
      // console.log(list)
      let carList = await methods.generateCarList(ctx,list)
      // console.log(carList)
      ctx.body = {
        code: '0',
        carList
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineShoppingCarError, ctx)
    }
  }
  // 获取购物车数量
  async getCarNumber(ctx, next) {
    let { user_id } = ctx.state.user
    try {
      let carList = await fineAllList(user_id)
      let carNumber = carList.length
      ctx.body = {
        code: '0',
        carNumber
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineShoppingCarError, ctx)
    }
  }
  // 更新购物车某商品数量
  async updateGoodsNumber(ctx, next) {
    let { user_id } = ctx.state.user
    let { goods_id, number } = ctx.request.body
    try {
      let result = await updateShoppingCar({ number, user_id, goods_id })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '购物车数量更新成功'
        }
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', updateShoppingCarError, ctx)
    }
  }
  //删除购物车商品
  async deleteCarGoods(ctx, next) {
    let { user_id } = ctx.state.user
    let { goods_id } = ctx.request.body
    try {
      let result = await deleteShoppingCar({ user_id, goods_id })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '购物车商品删除成功'
        }
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', deleteCarGoodsError, ctx)
    }
  }
}
module.exports = new ShoppingCarController()
