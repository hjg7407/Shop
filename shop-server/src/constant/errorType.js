module.exports = {
  userNameIsNullError: {
    code: '10001',
    message: '用户名不能为空'
  },
  userNameLengthError: {
    code: '10002',
    message: '用户名长度不能大于10'
  },
  userNameError: {
    code: '10003',
    message: '用户名不能包含_以外的特殊字符'
  },
  phoneError: {
    code: '10004',
    message: '手机号错误'
  },
  passwordIsNullError: {
    code: '10005',
    message: '密码不能为空'
  },
  passwordLengthError: {
    code: '10006',
    message: '密码长度不在6-20位以内'
  },
  userExistedError: {
    code: '10007',
    message: '用户名或手机号已被注册'
  },
  registerError: {
    code: '10008',
    message: '用户注册出错'
  },
  userInfoError: {
    code: '10009',
    message: '用户名或密码不能为空'
  },
  loginInfoError: {
    code: '10010',
    message: '用户名或密码错误'
  },
  loginError: {
    code: '10011',
    message: '用户登录出错'
  },
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期'
  },
  invalidTokenError: {
    code: '10102',
    message: '无效的token'
  },
  tokenError: {
    code: '10103',
    message: 'token出错'
  },
  isNotAdminError: {
    code: '10104',
    message: '该用户没有管理员的权限'
  },
  fineCategoryError: {
    code: '10201',
    message: '查找商品分类信息出错'
  },
  fineCategoryIdError: {
    code: '10202',
    message: '查找商品分类Id出错'
  },
  fineGoodsListError: {
    code: '10203',
    message: '查找首页商品信息出错'
  },
  fineSearchListError: {
    code: '10204',
    message: '查找搜索商品信息出错'
  },
  fineGoodsBannersError: {
    code: '10205',
    message: '查找商品轮播图出错'
  },
  fineGoodsDetailsError: {
    code: '10206',
    message: '查找商品详情出错'
  },
  fineGoodsNumberError: {
    code: '10207',
    message: '查找商品库存出错'
  },
  fineSearchFormError: {
    code: '10208',
    message: '后台查找商品出错'
  },
  fineBannersError: {
    code: '10301',
    message: '查找轮播图信息出错'
  },
  shoppingCarFormatError: {
    code: '10401',
    message: '购物车数据格式错误'
  },
  fineShoppingCarError: {
    code: '10402',
    message: '查找购物车错误'
  },
  OverInventoryError: {
    code: '10403',
    message: '添加失败，超出库存或限购限制！'
  },
  updateShoppingCarError: {
    code: '10404',
    message: '更新购物车库存错误'
  },
  addShoppingCarError: {
    code: '10405',
    message: '添加购物车失败'
  },
  deleteCarGoodsError: {
    code: '10405',
    message: '删除购物车失败'
  },
  collectionFormatError: {
    code: '10501',
    message: '添加收藏数据格式错误'
  },
  findCollectionError: {
    code: '10502',
    message: '查找收藏数据错误'
  },
  collectionExistedError: {
    code: '10503',
    message: '该商品已添加收藏，请到我的收藏查看'
  },
  addCollectionError: {
    code: '10504',
    message: '添加收藏数据错误'
  },
  deleteCollectionError: {
    code: '10505',
    message: '删除收藏数据错误'
  },
  addressFormatError: {
    code: '10601',
    message: '地址格式错误'
  },
  getAddressError: {
    code: '10602',
    message: '获取地址信息错误'
  },
  countAddressError: {
    code: '10603',
    message: '获取地址数目错误'
  },
  addAddressError: {
    code: '10604',
    message: '地址添加错误'
  },
  countOverError: {
    code: '10605',
    message: '添加失败，每位用户最多添加5条地址'
  },
  deleteAddressError: {
    code: '10606',
    message: '地址删除错误'
  },
  updateAddressError: {
    code: '10607',
    message: '更新地址错误'
  },
  setDefaultAddressError: {
    code: '10608',
    message: '设置默认地址错误'
  },
  getOrderError: {
    code: '10701',
    message: '获取订单出错'
  },
  getOrderDetailsError: {
    code: '10702',
    message: '获取订单详情出错'
  },
  orderStatusError: {
    code: '10703',
    message: '订单未完成交易，不能删除!'
  },
  deleteOrderError: {
    code: '10704',
    message: '订单删除错误'
  },
  payOrderError: {
    code: '10705',
    message: '订单付款错误'
  }
}
