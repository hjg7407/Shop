const {
  getAddress,
  countAddress,
  addAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress
} = require('../service/addressServer')
const {
  getAddressError,
  countAddressError,
  countOverError,
  addAddressError,
  deleteAddressError,
  updateAddressError,
  setDefaultAddressError
} = require('../constant/errorType')

class AddressController {
  // 获取地址
  async getAddress(ctx, next) {
    let { user_id } = ctx.state.user
    try {
      let addressList = await getAddress('user_id', user_id)
      ctx.body = {
        code: '0',
        message: '获取地址成功',
        addressList
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', getAddressError, ctx)
    }
  }
  // 添加地址
  async addAddress(ctx, next) {
    let { user_id } = ctx.state.user
    let { address_name, address_phone, address_details } = ctx.request.body
    let address_default = 0
    //获取地址数量
    try {
      let result = await countAddress(user_id)
      // 设置初始地址为默认地址
      if (result[0]['count(*)'] === 0) {
        address_default = 1
        // 判断地址数目是否超过5
      } else if (result[0]['count(*)'] >= 5) {
        console.error('添加失败，每位用户最多保存5条地址')
        return ctx.app.emit('error', countOverError, ctx)
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', countAddressError, ctx)
    }
    try {
      let result = await addAddress({
        user_id,
        address_name,
        address_phone,
        address_details,
        address_default
      })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '地址添加成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', addAddressError, ctx)
    }
  }
  // 删除地址
  async deleteAddress(ctx, next) {
    let { user_id } = ctx.state.user
    let { address_id } = ctx.request.body
    try {
      let result = await deleteAddress({
        user_id,
        address_id
      })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '地址删除成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', deleteAddressError, ctx)
    }
  }
  // 修改地址
  async updateAddress(ctx, next) {
    try {
      let { user_id } = ctx.state.user
      let { address_id, address_name, address_phone, address_details } =
        ctx.request.body
      let result = await updateAddress({
        user_id,
        address_name,
        address_phone,
        address_details,
        address_id
      })
      if (result.affectedRows === 1) {
        ctx.body = {
          code: '0',
          message: '地址修改成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', updateAddressError, ctx)
    }
  }
  // 设置默认地址
  async defaultAddress(ctx, next) {
    try {
      let { user_id } = ctx.state.user
      let { address_id } = ctx.request.body
      let result = await setDefaultAddress({
        user_id,
        address_id
      })
      if (result.length === 2) {
        ctx.body = {
          code: '0',
          message: '设置默认地址成功'
        }
      }
    } catch (error) {
      console.error(error)
      ctx.app.emit('error', setDefaultAddressError, ctx)
    }
  }
}

module.exports = new AddressController()
