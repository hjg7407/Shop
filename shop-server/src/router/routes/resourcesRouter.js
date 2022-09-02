const Router = require('koa-router')

const {
  getBanners,
} = require('../../controller/resourcesController')
const { auth, isAdmin } = require('../../middleware/authMiddleware')
const resources = new Router({ prefix: '/resources' })
//获取首页轮播图
resources.get('/banners', getBanners)

module.exports = resources
