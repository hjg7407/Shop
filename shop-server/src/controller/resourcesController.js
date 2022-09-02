const path = require('path')
const fs = require('fs')
const {
  fineBanners,
  addBanner,
  getBannerImgPath,
  deleteBanner
} = require('../service/resourcesServer')
const { fineBannersError } = require('../constant/errorType')

class ResourcesController {
  // 获取轮播图
  async getBanners(ctx, next) {
    try {
      let banners = await fineBanners()
      ctx.body = {
        code: '0',
        banners
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineBannersError, ctx)
    }
  }
  // 添加轮播图
  async addBanner(ctx, next) {
    // console.log(ctx.request.files.file)
    let { file } = ctx.request.files
    if (file) {
      let imgPath = '/upload/images/' + path.basename(file.path)
      // console.log(imgPath)
      try {
        let result = await addBanner(imgPath)
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '0',
            message: '添加轮播图成功'
          }
        }
      } catch (error) {
        console.error(error)
        return
      }
    } else {
      ctx.body = {
        code: '10302',
        message: '轮播图上传失败'
      }
    }
  }
  // 删除轮播图
  async deleteBanner(ctx, next) {
    let { banner_id } = ctx.request.body
    // console.log(banner_id)
    // 获取轮播图地址
    try {
      let result = await getBannerImgPath(banner_id)
      if (result.length !== 0) {
        // console.log(result)
        let imgPath = path.join(__dirname, `../public${result[0].imgPath}`)
        // console.log(imgPath)
        try {
          let result = await deleteBanner(banner_id)
          if (result.affectedRows === 1) {
            // 删除图片
            fs.unlinkSync(imgPath)
            ctx.body = {
              code: '0',
              message: '删除轮播图成功'
            }
          }
        } catch (error) {
          console.error(error)
          return
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
}
module.exports = new ResourcesController()
