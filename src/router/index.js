import { createRouter, createWebHistory } from 'vue-router'

//導入組件
import LoginPage from '@/views/LoginPage.vue'
import LayoutPage from '@/views/LayoutPage.vue'
import CustomerManage from '@/views/customer/CustomerManage.vue'
// import UserManage from '@/views/user/UserManage.vue'
import UserInfo from '@/views/user/UserInfo.vue'
import UserResetPassword from '@/views/user/UserResetPassword.vue'
// import CourseRecord from '@/views/course/CourseRecord.vue'
// import CoursePlan from '@/views/course/CoursePlan.vue'

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
      // { path: '/user/manage', component: UserManage },
      { path: '/user/info', component: UserInfo },
      { path: '/user/resetPassword', component: UserResetPassword }
      // { path: '/course/record', component: CourseRecord },
      // { path: '/course/plan', component: CoursePlan }
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
    console.log('路由返回')
    return '/login'
  }
})

//導出路由
export default router
