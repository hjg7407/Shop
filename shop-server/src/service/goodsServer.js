const db = require('../utils/db')

class GoodsServer {
  //查找商品分类名和商品分类图片
  async fineCategory() {
    let sql = 'select * from category'
    return await db.query(sql, null)
  }
  // 根据商品分类名称获取商品分类id
  async fineCategoryId(categoryName) {
    let sql = 'select category_id from category where category_name = ?'
    let category = await db.query(sql, [categoryName])
    return category[0].category_id
  }
  //根据商品分类id获取首页商品信息
  async fineGoodsList(categoryId) {
    let sql =
      'select * from goods where category_id = ? order by goods_sales desc limit 7'
    return await db.query(sql, [categoryId])
  }
  //根据商品分类id和排序方式获取所有商品信息
  async fineSearchsListByCategory(array) {
    let [categoryId, orderName, orderSort] = array
    let sql = `select * from goods where category_id = ? order by ${orderName} ${orderSort}`
    return await db.query(sql, categoryId)
  }
  //根据搜索关键字和排序方式获取所有商品信息
  async fineSearchsListByKeyword(array) {
    let [keyword, orderName, orderSort] = array
    let sql = `select * from goods where goods_name like '%${keyword}%' or goods_title like '%${keyword}%' order by ${orderName} ${orderSort}`
    return await db.query(sql, null)
  }
  //查找商品轮播图
  async fineGoodsBanners(goodsId) {
    let sql = 'select * from goods_banner where goods_id = ?'
    return await db.query(sql, [goodsId])
  }
  //查找商品详情
  async fineGoodsDetails(goodsId) {
    let sql = 'select * from goods where goods_id = ?'
    return await db.query(sql, [goodsId])
  }
  //查找商品库存
  async fineGoodsNumber(goodsId) {
    let sql = 'select goods_number from goods where goods_id = ?'
    let goods_number = await db.query(sql, [goodsId])
    return goods_number[0].goods_number
  }
  async fineSearchGoods(search, start = 0, end = 0) {
    let sql = 'select * from goods where 1 = 1'
    // console.log(start, end)
    if (search.code) {
      sql += ` and goods_code = '${search.code}'`
    }
    if (search.categoryId) {
      sql += ` and category_id = ${search.categoryId}`
    }
    if (search.keyword) {
      sql += ` and goods_name like '%${search.keyword}%' or goods_title like '%${search.keyword}%'`
    }
    if (end !== 0) {
      sql += ' limit ?,?'
    }
    return await db.query(sql, [start, end])
  }
  // 添加商品
  async addGoods(form) {
    let sql = 'insert into goods values(null, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)'
    return await db.query(sql, [
      form.category_id,
      form.goods_code,
      form.goods_name,
      form.goods_title,
      form.goods_info,
      form.goods_picture,
      Number(form.goods_price),
      Number(form.goods_selling_price),
      Number(form.goods_number)
    ])
  }
  // 获取商品id
  async getGoodsId(goods_code) {
    let sql = 'select goods_id from goods where goods_code = ?'
    return await db.query(sql, [goods_code])
  }
  // 添加商品轮播图
  async addGoodsBanner(goods_id, goods_banner_imgPath) {
    let sql = 'insert into goods_banner values(null, ?, ?)'
    return await db.query(sql, [goods_id, goods_banner_imgPath])
  }
  // 删除商品
  async deleteGoods(goods_id) {
    let sql = 'delete from goods where goods_id = ?'
    return await db.query(sql, [goods_id])
  }
  // 获取商品轮播图地址
  async getGoodsBannerPath(goods_id) {
    let sql = 'select goods_banner_imgPath from goods_banner where goods_id = ?'
    return await db.query(sql, [goods_id])
  }
  // 获取商品轮播图地址
  async getGoodsBanner(goods_banner_id) {
    let sql =
      'select goods_banner_imgPath from goods_banner where goods_banner_id = ?'
    return await db.query(sql, [goods_banner_id])
  }
  // 删除商品轮播图
  async deleteGoodsBanner(goods_banner_id) {
    let sql = 'delete from goods_banner where goods_banner_id = ?'
    return await db.query(sql, [goods_banner_id])
  }
  // 编辑商品
  async editGoods(form) {
    if (form.goods_picture) {
      let sql = `update goods set category_id = ?, goods_code = ?, goods_name = ?,
        goods_title = ?, goods_info = ?, goods_picture = ?, goods_price = ?,
        goods_selling_price = ?, goods_number = ? where goods_id = ?`
      return await db.query(sql, [
        form.category_id,
        form.goods_code,
        form.goods_name,
        form.goods_title,
        form.goods_info,
        form.goods_picture,
        Number(form.goods_price),
        Number(form.goods_selling_price),
        Number(form.goods_number),
        form.goods_id
      ])
    }
    let sql = `update goods set category_id = ?, goods_code = ?, goods_name = ?,
        goods_title = ?, goods_info = ?, goods_price = ?,
        goods_selling_price = ?, goods_number = ? where goods_id = ?`
    return await db.query(sql, [
      form.category_id,
      form.goods_code,
      form.goods_name,
      form.goods_title,
      form.goods_info,
      Number(form.goods_price),
      Number(form.goods_selling_price),
      Number(form.goods_number),
      form.goods_id
    ])
  }
  // 获取商品图片地址
  async getGoodsImgPath(goods_id) {
    let sql = 'select goods_picture from goods where goods_id = ?'
    return await db.query(sql, [goods_id])
  }
}

module.exports = new GoodsServer()
