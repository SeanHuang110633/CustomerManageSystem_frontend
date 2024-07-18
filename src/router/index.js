import { createRouter, createWebHistory } from 'vue-router'

//導入組件
import LoginPage from '@/views/LoginPage.vue'
import LayoutPage from '@/views/LayoutPage.vue'
import CustomerManage from '@/views/customer/CustomerManage.vue'
import CustomerStatistics from '@/views/customer/CustomerStatistics.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'

import { useTokenStore } from '@/stores'
//定義路由關係
const routes = [
  { path: '/login', component: LoginPage },
  {
    path: '/',
    component: LayoutPage,
    redirect: '/customer/manage',
    children: [
      { path: '/customer/manage', component: CustomerManage },
      { path: '/customer/statistics', component: CustomerStatistics },
      { path: '/user/info', component: UserInfo },
      { path: '/user/resetPassword', component: UserResetPassword }
    ]
  }
]

//創建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

//訪問攔截
router.beforeEach((to) => {
  const tokenStore = useTokenStore()

  if (!tokenStore.init() && to.path !== '/login') {
    return '/login'
  }
})

//導出路由
export default router
