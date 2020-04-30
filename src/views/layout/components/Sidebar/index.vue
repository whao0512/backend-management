<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      {{router}}
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Layout from '@/views/layout/Layout'
export default {
  data() {
    return {

      router: [
        {path: '/login', component: () => import('@/views/login/index'), hidden: true},
        {path: '/404', component: () => import('@/views/404'), hidden: true},

        {
          path: '/',
          redirect: '/login',
        },

        {
          path: '/layout',
          component: Layout,
          id: 1,
          hidden: sessionStorage.getItem('baseInfo').match('1') == null ? true : false,
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
          hidden: sessionStorage.getItem('baseInfo').match('2') == null ? true : false,
          children: [
            {
              path: 'decoration',
              id: 21,
              hidden: sessionStorage.getItem('baseInfo').match('21') == null ? true : false,
              component: () => import('@/views/shop/decoration'),
              name: 'decoration',
              meta: {title: '首页装修', icon: 'guide', noCache: true}
            },
            {
              path: 'banner',
              id: 22,
              hidden: sessionStorage.getItem('baseInfo').match('22') == null ? true : false,
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
          hidden: sessionStorage.getItem('baseInfo').match('3') == null ? true : false,
          redirect: '/goods/management',
          meta: {title: '商品管理', icon: 'lock'},
          children: [
            {
              path: 'release',
              id: 31,
              hidden: sessionStorage.getItem('baseInfo').match('31') == null ? true : false,
              component: () => import('@/views/goods/release'),
              name: 'release',
              meta: {title: '发布商品', icon: 'guide', noCache: true}
            },
            {
              path: 'preview',
              // component: () => import('@/views/goods/preview'),
              name: 'preview',
              hidden: true,
              meta: { title: '预览详情', noCache: true}
            },
            {
              path: 'management',
              id: 32,
              hidden: sessionStorage.getItem('baseInfo').match('32') == null ? true : false,
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
              hidden: sessionStorage.getItem('baseInfo').match('33') == null ? true : false,
              component: () => import('@/views/goods/category'),
              name: 'category',
              meta: {title: '类目管理', icon: 'guide', noCache: true}
            },
            {
              path: 'property',
              id: 34,
              hidden: sessionStorage.getItem('baseInfo').match('34') == null ? true : false,
              component: () => import('@/views/goods/property/index'),
              name: 'property',
              meta: {title: '规格与属性', icon: 'guide', noCache: true}
            },
            {
              path: 'brand',
              id: 35,
              hidden: sessionStorage.getItem('baseInfo').match('35') == null ? true : false,
              component: () => import('@/views/goods/brand'),
              name: 'brand',
              meta: {title: '品牌管理', icon: 'guide', noCache: true}
            }
          ]
        },
        {
          path: '/order',
          id: 4,
          hidden: sessionStorage.getItem('baseInfo').match('4') == null ? true : false,
          component: Layout,
          redirect: '/order/index',
          meta: {title: '订单管理', icon: 'lock'},
          children: [
            {
              path: 'index',
              id: 41,
              hidden: sessionStorage.getItem('baseInfo').match('41') == null ? true : false,
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
          hidden: sessionStorage.getItem('baseInfo').match('5') == null ? true : false,
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
          hidden: sessionStorage.getItem('baseInfo').match('6') == null ? true : false,
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
          hidden: sessionStorage.getItem('baseInfo').match('7') == null ? true : false,
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
              hidden: sessionStorage.getItem('baseInfo').match('71') == null ? true : false,
              component: () => import('@/views/set-up/shop-info'),
              name: 'shop-info',
              meta: {title: '店铺信息', icon: 'dashboard', noCache: true}
            },
            {
              path: 'about',
              id: 72,
              hidden: sessionStorage.getItem('baseInfo').match('72') == null ? true : false,
              component: () => import('@/views/set-up/about'),
              name: 'about',
              meta: {title: '关于我们', icon: 'dashboard', noCache: true}
            },
            {
              path: 'common-problem',
              id: 73,
              hidden: sessionStorage.getItem('baseInfo').match('73') == null ? true : false,
              component: () => import('@/views/set-up/common-problem'),
              name: 'common-problem',
              meta: {title: '常见问题', icon: 'dashboard', noCache: true}
            },
            {
              path: 'operator',
              id: 74,
              hidden: sessionStorage.getItem('baseInfo').match('74') == null ? true : false,
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
      ]
    }
  },
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.router
      // return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
