const path = require('path')
const fs = require('fs')

const {
  fineCategory,
  fineGoodsList,
  fineSearchsListByCategory,
  fineSearchsListByKeyword,
  fineGoodsBanners,
  fineGoodsDetails,
  fineSearchGoods,
  addGoods,
  getGoodsId,
  addGoodsBanner,
  getGoodsBannerPath,
  deleteGoods,
  editGoods,
  getGoodsImgPath,
  getGoodsBanner,
  deleteGoodsBanner
} = require('../service/goodsServer')
const {
  fineCategoryError,
  fineGoodsListError,
  fineSearchListError,
  fineGoodsBannersError,
  fineGoodsDetailsError,
  fineSearchFormError
} = require('../constant/errorType')
const { getCategoryId } = require('../middleware/goodsMiddleware')

class GoodsController {
  // 获取商品分类信息接口
  async getCategory(ctx, next) {
    try {
      let category = await fineCategory()
      ctx.body = {
        code: '0',
        category
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineCategoryError, ctx)
    }
  }
  // 获取首页商品列表接口
  async getGoodsList(ctx, next) {
    try {
      let { categoryId } = ctx.request.body
      let goodsList = await fineGoodsList(categoryId)
      ctx.body = {
        code: '0',
        goodsList
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineGoodsListError, ctx)
    }
  }
  // 获取搜索页面商品列表接口
  async getSearchList(ctx, next) {
    let { keyword, orderName, orderSort } = ctx.request.body
    if (keyword != undefined) {
      try {
        let searchList = await fineSearchsListByKeyword([
          keyword,
          orderName,
          orderSort
        ])
        ctx.body = {
          code: '0',
          searchList
        }
      } catch (error) {
        console.error(error)
        return ctx.app.emit('error', fineSearchListError, ctx)
      }
    } else {
      try {
        await getCategoryId(ctx, next)
        let { categoryId } = ctx.request.body
        // console.log(categoryId)
        let searchList = await fineSearchsListByCategory([
          categoryId,
          orderName,
          orderSort
        ])
        ctx.body = {
          code: '0',
          searchList
        }
      } catch (error) {
        console.error(error)
        return ctx.app.emit('error', fineSearchListError, ctx)
      }
    }
  }
  // 获取商品轮播图
  async getGoodsBanners(ctx, next) {
    let { goodsId } = ctx.request.body
    try {
      let goodsBanners = await fineGoodsBanners(goodsId)
      ctx.body = {
        code: '0',
        goodsBanners
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineGoodsBannersError, ctx)
    }
  }
  // 获取商品详情
  async getGoodsDetails(ctx, next) {
    let { goodsId } = ctx.request.body
    try {
      let goodsDetails = await fineGoodsDetails(goodsId)
      ctx.body = {
        code: '0',
        goodsDetails
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineGoodsDetailsError, ctx)
    }
  }
  // 后台查询商品
  async searchGoods(ctx, next) {
    let { search, currentPage, pageSize } = ctx.request.body
    // console.log(search)
    // 计算开始索引
    const start = (currentPage - 1) * pageSize
    try {
      // console.log(start, pageSize)
      let searchForm = await fineSearchGoods(search, start, pageSize)
      let total = (await fineSearchGoods(search)).length
      ctx.body = {
        code: '0',
        message: '查找商品成功',
        goodsList: searchForm,
        total
      }
    } catch (error) {
      console.error(error)
      return ctx.app.emit('error', fineSearchFormError, ctx)
    }
  }
  // 添加商品
  async addGoods(ctx, next) {
    let { file, ...goods_banner } = ctx.request.files
    let { form } = ctx.request.body
    form = JSON.parse(form)
    // console.log(file, goods_banner, form)
    form.goods_picture = '/upload/images/' + path.basename(file.path)
    try {
      let result = await addGoods(form)
      if (result.affectedRows === 1) {
        try {
          let goods_id = (await getGoodsId(form.goods_code))[0].goods_id
          for (let key in goods_banner) {
            try {
              let goods_banner_imgPath =
                '/upload/images/' + path.basename(goods_banner[key].path)
              addGoodsBanner(goods_id, goods_banner_imgPath)
            } catch (error) {
              console.error(error)
              return
            }
          }
          ctx.body = {
            code: '0',
            message: '添加商品成功'
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
  // 编辑商品(优化：判断货号)
  async editGoods(ctx, next) {
    // console.log(ctx.request.files, ctx.request.body)
    let { form, goods_id } = ctx.request.body
    let { file, ...goods_banner } = ctx.request.files
    // console.log(file, goods_banner)
    form = JSON.parse(form)
    let imgPath = ''
    form.goods_id = goods_id
    if (file) {
      form.goods_picture = '/upload/images/' + path.basename(file.path)
    }
    try {
      if (form.goods_picture) {
        // 获取商品图片地址
        try {
          let result = await getGoodsImgPath(form.goods_id)
          imgPath = path.join(__dirname, `../public${result[0].goods_picture}`)
        } catch (error) {
          console.error(error)
          return
        }
      }
      let result = await editGoods(form)
      if (result.affectedRows === 1) {
        // 删除商品图片
        if (imgPath) {
          fs.unlinkSync(imgPath)
        }
        // 删除轮播图
        let { deleteBanner } = ctx.request.body
        deleteBanner = JSON.parse(deleteBanner)
        // console.log(deleteBanner)
        /* let reg = /http:\/\/localhost:3000(\S*)/
        for (let value of deleteBanner) {
          let result = value.match(reg)
          let imgPath = path.join(__dirname, `../public${result[1]}`)
          // console.log(imgPath)
          // 删除轮播图
          fs.unlinkSync(imgPath)
        } */
        for (let value of deleteBanner) {
          try {
            let imgPath = (await getGoodsBanner(value))[0].goods_banner_imgPath
            if (imgPath) {
              try {
                let result = await deleteGoodsBanner(value)
                if (result.affectedRows === 1) {
                  // 删除商品轮播图
                  let banner_img = path.join(__dirname, `../public${imgPath}`)
                  fs.unlinkSync(banner_img)
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
        // 添加商品轮播图
        for (let key in goods_banner) {
          try {
            let goods_banner_imgPath =
              '/upload/images/' + path.basename(goods_banner[key].path)
            addGoodsBanner(form.goods_id, goods_banner_imgPath)
          } catch (error) {
            console.error(error)
            return
          }
        }
        ctx.body = {
          code: '0',
          message: '编辑商品成功'
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }
  // 删除商品
  async deleteGoods(ctx, next) {
    let { goods_id } = ctx.request.body
    // console.log(goods_id)
    // 获取商品轮播图地址
    try {
      let imgPath = await getGoodsBannerPath(goods_id)
      if (imgPath.length !== 0) {
        try {
          let result = await deleteGoods(goods_id)
          if (result.affectedRows === 1) {
            // 删除商品轮播图
            for (let value of imgPath) {
              let banner_img = path.join(
                __dirname,
                `../public${value.goods_banner_imgPath}`
              )
              fs.unlinkSync(banner_img)
            }
            ctx.body = {
              code: '0',
              message: '删除商品成功'
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
module.exports = new GoodsController()
