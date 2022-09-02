//该文件用于创建整个应用的路由器
import VueRouter from 'vue-router'

//引入组件
import AboutItem from '../views/AboutItem'
import HomeItem from '../views/home/HomeItem'
import LoginItem from '../views/login/LoginItem'
import GoodsDetailsItem from '../views/GoodsDetailsItem'
import RegisterItem from '../views/register/RegisterItem'
import SearchItem from '../views/SearchItem'
import ShoppingCarItem from '../views/ShoppingCarItem'
import AddressItem from '../views/AddressItem'
import OrderItem from '../views/OrderItem'
import MyOrderItem from '../views/MyOrderItem'
import CollectionItem from '../views/CollectionItem'
//重写push方法，解决路由重复跳转时控制台报错
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
  return routerPush.call(this, to).catch((error) => error)
}
//创建并暴露一个路由器
const router = new VueRouter({
  // 配置路由规则
  routes: [
    //路由重定向
    {
      path: '/',
      redirect: '/home'
    },
    {
      name: 'about',
      path: '/about',
      component: AboutItem,
      meta: {
        title: '关于我们'
      }
    },
    {
      name: 'home',
      path: '/home',
      component: HomeItem,
      meta: {
        title: '好而多网-首页'
      }
    },
    {
      name: 'login',
      path: '/login',
      component: LoginItem,
      meta: {
        title: '好而多网-欢迎登录'
      }
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterItem,
      meta: {
        title: '个人注册'
      }
    },
    {
      name: 'details',
      path: '/details',
      component: GoodsDetailsItem,
      meta: {
        title: '详情'
      }
    },
    {
      name: 'search',
      path: '/search/',
      component: SearchItem,
      meta: {
        title: '搜索'
      }
    },
    {
      name: 'shoppingCar',
      path: '/shoppingCar',
      component: ShoppingCarItem,
      meta: {
        isAuth: true,
        title: '我的购物车'
      }
    },
    {
      name: 'address',
      path: '/address',
      component: AddressItem,
      meta: {
        isAuth: true,
        title: '收货地址'
      }
    },
    {
      name: 'order',
      path: '/order',
      component: OrderItem,
      meta: {
        isAuth: true,
        title: '确认订单'
      }
    },
    {
      name: 'myOrder',
      path: '/myOrder',
      component: MyOrderItem,
      meta: {
        isAuth: true,
        title: '我的订单'
      }
    },
    {
      name: 'collection',
      path: '/collection',
      component: CollectionItem,
      meta: {
        isAuth: true,
        title: '我的收藏'
      }
    }
  ]
})
//全局前置路由守卫
router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('Token')
  //判断是否需要鉴权
  if (to.meta.isAuth) {
    //token存在,放行
    if (token) {
      next()
    } else {
      //跳转到登录界面
      router.push({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    }
  } else {
    next()
  }
})
//全局后置路由守卫————初始化的时候被调用、每次路由切换之后被调用
router.afterEach((to, from) => {
  document.title = to.meta.title
  // 页面跳转成功，把滚动条重置到顶部
  window.scrollTo(0, 0)
})

export default router
