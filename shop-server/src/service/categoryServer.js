const db = require('../utils/db')

class CategoryServer {
  // 添加商品分类
  async addCategory(category_name, category_img) {
    let sql = 'insert into category values(null, ?, ?)'
    return await db.query(sql, [category_name, category_img])
  }
  // 编辑商品分类
  async editCategory(category_name, category_img, category_id) {
    if (category_img) {
      let sql =
        'update category set category_name = ? , category_img = ? where category_id = ?'
      return await db.query(sql, [category_name, category_img, category_id])
    }
    let sql = 'update category set category_name = ? where category_id = ?'
    return await db.query(sql, [category_name, category_id])
  }
  // 删除商品分类
  async deleteCategory(category_id) {
    let sql = 'delete from category where category_id = ?'
    return await db.query(sql, [category_id])
  }
  // 获取商品分类图地址
  async getCategoryImgPath(category_id) {
    let sql = 'select category_img from category where category_id = ?'
    return await db.query(sql, [category_id])
  }
}

module.exports = new CategoryServer()
