const db = require('../utils/db')

class ResourcesServer {
  async fineBanners() {
    let sql = 'select * from banner'
    return await db.query(sql, null)
  }
  // 添加轮播图
  async addBanner(imgPath) {
    let sql = 'insert into banner values(null, ?)'
    return await db.query(sql, [imgPath])
  }
  // 获取轮播图地址
  async getBannerImgPath(banner_id) {
    let sql = 'select imgPath from banner where banner_id = ?'
    return await db.query(sql, [banner_id])
  }
  // 删除轮播图
  async deleteBanner(banner_id) {
    let sql = 'delete from banner where banner_id = ?'
    return await db.query(sql, [banner_id])
  }
}
module.exports = new ResourcesServer()
