const Router = require('koa-router')
const users = require('./routes/usersRouter')
const goods = require('./routes/goodsRouter')
const resources = require('./routes/resourcesRouter')
const shoppingCar = require('./routes/shoppingCarRouter')
const collection = require('./routes/collectionRouter')
const address = require('./routes/addressRouter')
const order = require('./routes/orderRouter')
const admin = require('./routes/adminRouter')

//创建router路由实例对象
const router = new Router()

router.use(users.routes(), users.allowedMethods())
router.use(goods.routes(), goods.allowedMethods())
router.use(resources.routes(), resources.allowedMethods())
router.use(shoppingCar.routes(), shoppingCar.allowedMethods())
router.use(collection.routes(), collection.allowedMethods())
router.use(address.routes(), address.allowedMethods())
router.use(order.routes(), order.allowedMethods())
router.use(admin.routes(), admin.allowedMethods())

module.exports = router
