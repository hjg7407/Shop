export default {
  namespaced: true,
  //准备actions对象——响应组件中用户的动作
  actions: {
    //获取购物车商品数量
    async setCarNumber(context, _) {
      let result = await this._vm.$axios.get('/api/shoppingCar/carNumber')
      let data = result.data.carNumber
      context.commit('SetCarNumber', data)
    },
    //获取购物车商品信息
    async getCarList(context, _) {
      let result = await this._vm.$axios.get('/api/shoppingCar/carList')
      let data = result.data.carList
      context.commit('GetCarList', data)
    },
    // 更新购物车某商品数量
    async updateGoodsNumber(context, data) {
      let { goods_id, index, number } = data
      let result = await this._vm.$axios.post(
        '/api/shoppingCar/updateGoodsNumber',
        { goods_id, number }
      )
      if (result.data.code === '0') {
        context.commit('UpdateGoodsNumber', { index, number })
      } else {
        //提示更改失败信息
        this._vm.$errorMessage(result.data.message)
        return
      }
    },
    // 删除购物车商品
    async deleteCarGoods(context, { index, goods_id }) {
      let result = await this._vm.$axios.post(
        '/api/shoppingCar/deleteCarGoods',
        { goods_id }
      )
      if (result.data.code === '0') {
        context.commit('DeleteCarGoods', index)
        //提示删除成功信息
        this._vm.$successedMessage(result.data.message)
      } else {
        //提示删除失败信息
        this._vm.$errorMessage(result.data.message)
      }
    }
  },
  //准备mutations对象——修改state中的数据
  mutations: {
    SetCarNumber(state, data) {
      state.number = data
    },
    GetCarList(state, data) {
      state.carList = [...data]
    },
    // 全选或全不选
    UpdateAllItemChecked(state, data) {
      state.carList.forEach((value) => {
        value.isChecked = data
      })
    },
    // 更改某件商品选中状态
    UpdateisChecked(state, { index, value }) {
      state.carList[index].isChecked = value
    },
    // 更新购物车某商品数量
    UpdateGoodsNumber(state, { index, number }) {
      state.carList[index].number = number
    },
    // 删除购物车商品
    DeleteCarGoods(state, index) {
      state.carList.splice(index, 1)
    },
    // 删除购物车商品
    DeleteShoppingCar(state, id) {
      // 根据购物车id删除购物车商品
      for (let key in state.carList) {
        if (state.carList[key].goods_id === id) {
          state.carList.splice(key, 1)
          // console.log(key)
        }
      }
    },
    // 添加购物车
    AddshoppingCar(state, data) {
      state.carList.push(data)
    },
    // 更新购物车该商品数量
    AddNumber(state, id) {
      for (let key in state.carList) {
        if (state.carList[key].goods_id === id) {
          state.carList[key].number += 1
        }
      }
    }
  },
  //准备state对象——保存具体的数据
  state: {
    //购物车数量
    number: 0,
    //购物车信息
    carList: ''
  },
  //准备getters——用于将state中的数据进行加工
  getters: {
    //已选择商品数量
    checkedNumber(state) {
      return state.carList.reduce(function (pre, cur) {
        return pre + cur.isChecked
      }, 0)
    },
    //已选择商品金额
    checkedPrice(state) {
      return state.carList.reduce(function (pre, cur) {
        if (cur.isChecked) {
          pre += cur.number * cur.goods_price
        }
        return pre
      }, 0)
    },
    // 获取选中的商品列表
    getCheckedGoods(state) {
      /* return state.carList.filter((value) => {
        value.isChecked === true
      }) */
      let goodsList = []
      for (let value of state.carList) {
        if (value.isChecked === true) {
          goodsList.push(value)
        }
      }
      return goodsList
    }
  }
}
