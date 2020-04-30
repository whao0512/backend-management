import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: '首页',
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index'),
  //     meta: {title: '首页', icon: 'dashboard', noCache: true}
  //   }]
  // },
  {
    path: '/',
    redirect: '/login',
  },

  {
    path: '/layout',
    component: Layout,
    id: 1,
    redirect: '/layout/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '首页', icon: 'dashboard', noCache: true}
    }]
  },

  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/decoration',
    meta: {
      title: '店铺',
      icon: 'lock'
    },
    id: 2,
    children: [
      {
        path: 'decoration',
        id: 21,
        component: () => import('@/views/shop/decoration'),
        name: 'decoration',
        meta: {title: '首页装修', icon: 'guide', noCache: true}
      },
      {
        path: 'banner',
        id: 22,
        component: () => import('@/views/shop/banner'),
        name: 'banner',
        meta: {title: '广告条管理', icon: 'guide', noCache: true}
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    id: 3,
    redirect: '/goods/management',
    meta: {title: '商品管理', icon: 'lock'},
    children: [
      {
        path: 'release',
        id: 31,
        component: () => import('@/views/goods/release'),
        name: 'release',
        meta: {title: '发布商品', icon: 'guide', noCache: true}
      },
      {
        path: 'preview',
        component: () => import('@/views/goods/preview/index'),
        name: 'preview',
        hidden: true,
        meta: { title: '预览详情', noCache: true}
      },
      {
        path: 'management',
        id: 32,
        component: () => import('@/views/goods/management/index'),
        name: 'management',
        meta: {title: '商品管理', icon: 'guide', noCache: true}
      },
      {
        path: 'warehousing/:id',
        component: () => import('@/views/goods/warehousing'),
        name: 'warehousing',
        meta: {title: '入库记录', icon: 'guide', noCache: true},
        hidden: true
      },
      {
        path: 'category',
        id: 33,
        component: () => import('@/views/goods/category/index'),
        name: 'category',
        meta: {title: '类目管理', icon: 'guide', noCache: true}
      },
      {
        path: 'property',
        id: 34,
        component: () => import('@/views/goods/property/index'),
        name: 'property',
        meta: {title: '规格与属性', icon: 'guide', noCache: true}
      },
      {
        path: 'brand',
        id: 35,
        component: () => import('@/views/goods/brand'),
        name: 'brand',
        meta: {title: '品牌管理', icon: 'guide', noCache: true}
      }
    ]
  },
  {
    path: '/order',
    id: 4,
    component: Layout,
    redirect: '/order/index',
    meta: {title: '订单管理', icon: 'lock'},
    children: [
      {
        path: 'index',
        id: 41,
        component: () => import('@/views/order/index'),
        name: 'index',
        meta: {title: '订单管理', icon: 'dashboard', noCache: true}
      },
      {
        path: 'detail',
        component: () => import('@/views/order/detail'),
        name: 'detail',
        meta: {title: '订单详情', icon: 'lock'},
        hidden: true,
      }
    ]
  },
  {
    path: '/finance',
    id: 5,
    component: Layout,
    redirect: 'finance',
    children: [
      {
        path: 'finance',
        component: () => import('@/views/finance/index'),
        name: 'finance',
        meta: {title: '财务管理', icon: 'dashboard', noCache: true}
      }
    ]
  },
  {
    path: '/member',
    id: 6,
    component: Layout,
    redirect: 'member',
    children: [
      {
        path: 'member',
        component: () => import('@/views/member/index'),
        name: 'member',
        meta: {title: '会员管理', icon: 'dashboard', noCache: true}
      }
    ]
  },
  {
    path: '/set-up',
    id:7,
    component: Layout,
    redirect: '/set-up/shop-info',
    meta: {
      title: '设置',
      icon: 'lock'
    },
    children: [
      {
        path: 'shop-info',
        id: 71,
        component: () => import('@/views/set-up/shop-info'),
        name: 'shop-info',
        meta: {title: '店铺信息', icon: 'dashboard', noCache: true}
      },
      {
        path: 'about',
        id: 72,
        component: () => import('@/views/set-up/about'),
        name: 'about',
        meta: {title: '关于我们', icon: 'dashboard', noCache: true}
      },
      {
        path: 'common-problem',
        id: 73,
        component: () => import('@/views/set-up/common-problem'),
        name: 'common-problem',
        meta: {title: '常见问题', icon: 'dashboard', noCache: true}
      },
      {
        path: 'operator',
        id: 74,
        component: () => import('@/views/set-up/operator'),
        name: 'operator',
        meta: {title: '系统操作员', icon: 'dashboard', noCache: true}
      },
      {
        path: 'administrator-add',
        component: () => import('@/views/set-up/administrator-add'),
        name: 'administrator-add',
        hidden: true,
        meta: {title: '添加操作员', icon: 'dashboard', noCache: true}
      }
    ]
  },

  {path: '*', redirect: '/404', hidden: true}
  // {path: '*', redirect: '/login', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
