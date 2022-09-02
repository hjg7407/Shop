const path = require('path')
const fs = require('fs')

const {
  addCategory,
  getCategoryImgPath,
  editCategory,
  deleteCategory
} = require('../service/categoryServer')

class CategoryController {
  // 添加商品分类
  async addCategory(ctx, next) {
    // console.log(ctx.request.files, ctx.request.body)
    let { file } = ctx.request.files
    let { category_name } = ctx.request.body
    if (file && category_name) {
      let category_img = '/upload/images/' + path.basename(file.path)
      // console.log(imgPath)
      try {
        let result = await addCategory(category_name, category_img)
        if (result.affectedRows === 1) {
          ctx.body = {
            code: '0',
            message: '添加商品分类成功'
          }
        }
      } catch (error) {
        console.error(error)
        return
      }
    } else {
      ctx.body = {
        code: '10901',
        message: '商品分类名或商品分类图不能为空'
      }
    }
  }
  // 编辑商品分类
  async editCategory(ctx, next) {
    // console.log(ctx.request.files, ctx.request.body)
    let { category_name, category_id } = ctx.request.body
    let category_img = ''
    let imgPath = ''
    if (ctx.request.files.file) {
      let { file } = ctx.request.files
      category_img = '/upload/images/' + path.basename(file.path)
    }
    // console.log(category_img, imgPath)
    try {
      if (category_img) {
        // 获取商品分类图地址
        try {
          let result = await getCategoryImgPath(category_id)
          imgPath = path.join(__dirname, `../public${result[0].category_img}`)
        } catch (error) {
          console.error(error)
          return
        }
      }
      let result = await editCategory(category_name, category_img, category_id)
      if (result.affectedRows === 1) {
        // 删除商品分类图
        if (imgPath) {
          fs.unlinkSync(imgPath)
        }
        ctx.body = {
          code: '0',
          message: '编辑商品分类成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 删除商品分类
  async deleteCategory(ctx, next) {
    let { category_id } = ctx.request.body
    // console.log(category_id)
    // 获取商品分类图地址
    try {
      let result = await getCategoryImgPath(category_id)
      if (result.length !== 0) {
        // console.log(result)
        let imgPath = path.join(__dirname, `../public${result[0].category_img}`)
        // console.log(imgPath)
        try {
          let result = await deleteCategory(category_id)
          if (result.affectedRows === 1) {
            // 删除商品分类图
            fs.unlinkSync(imgPath)
            ctx.body = {
              code: '0',
              message: '删除商品分类成功'
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
module.exports = new CategoryController()
