<script setup>
import { Promotion, User, EditPen, SwitchButton, CaretBottom } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import avatar from '@/assets/avatar.png' //用
import { userInfoService } from '@/api/user.js'
import { useUserInfoStore, useTokenStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const router = useRouter()
//獲取用戶資訊
const getUserInfo = async () => {
  let result = await userInfoService()
  //獲得用戶資訊存到userInfoStore中
  userInfoStore.setInfo(result.data)
}
getUserInfo()

//
const handleCommand = (command) => {
  if (command === 'logout') {
    //確認用戶是否要登出
    ElMessageBox.confirm('確認要登出嗎 ?', 'Double Check', {
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        //確認登出
        //清空存在pinia的用戶資訊和token
        userInfoStore.removeInfo()
        tokenStore.removeToken()
        //跳轉回登入頁
        router.push('/login')
        ElMessage({
          type: 'success',
          message: '登出成功 !'
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消登出'
        })
      })
  } else {
    //路由
    router.push('/user/' + command)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="160px">
      <el-menu active-text-color="#ffd04b" background-color="#232323" text-color="#fff" router>
        <el-menu-item index="/customer/manage">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>客戶基資管理</span>
        </el-menu-item>

        <!-- 暫無需求先保留 -->
        <!-- <el-menu-item index="/course/record">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>客戶訓練紀錄</span>
        </el-menu-item>
        <el-menu-item index="/course/plan">
          <el-icon>
            <Promotion />
          </el-icon>
          <span>自訂訓練計畫</span>
        </el-menu-item> -->

        <!-- 暫無需求先保留 -->
        <!-- <el-menu-item index="/user/manage">
          <el-icon>
            <User />
          </el-icon>
          <span>系統用戶管理</span>
        </el-menu-item> -->

        <el-menu-item index="/user/info">
          <el-icon>
            <User />
          </el-icon>
          <span>個人資訊管理</span>
        </el-menu-item>
        <el-menu-item index="/user/resetPassword">
          <el-icon>
            <User />
          </el-icon>
          <span>變更用戶密碼</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右側版面 -->
    <el-container>
      <!-- 頂部區域 -->
      <el-header>
        <div>
          1RM健護工作室 - Coach: <strong>{{ userInfoStore.info.username }}</strong>
        </div>
        <!-- 下拉菜單 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown_box">
            <el-avatar :src="avatar" />
            <el-icon>
              <CaretBottom />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="info" :icon="User"> 我的資料 </el-dropdown-item>
              <el-dropdown-item command="resetPassword" :icon="EditPen">
                修改密碼
              </el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton"> 登出 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 首頁主體 el-main 調小padding-->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 頁腳區 -->
      <!-- <el-footer>ver.2024-05-12</el-footer> -->
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
// 設定最外層容器的全屏高度
.layout-container {
  height: 100vh; // 使用視窗的完整高度

  // 配置側邊欄的樣式
  .el-aside {
    background-color: #232323; // 深色背景顏色
  }

  // 主選單的樣式
  .el-menu {
    border-right: none; // 移除選單右邊的邊框
  }

  // 頭部欄位的樣式設定
  .el-header {
    height: 50px;
    // width: 1865px;
    background-color: #fff; // 白色背景
    display: flex; // 啟用彈性盒模型
    align-items: center; // 垂直居中
    justify-content: space-between; // 元素間隔均勻分布

    // 下拉框容器的樣式
    .el-dropdown_box {
      display: flex; // 彈性布局
      align-items: center; // 垂直居中對齊

      // 下拉框內的圖標樣式
      .el-icon {
        color: #999; // 圖標顏色
        margin-left: 10px; // 左側邊距
      }

      // 當下拉框獲取焦點或被點擊時的樣式
      &:active,
      &:focus {
        outline: none; // 移除焦點時的外框
      }
    }
  }

  .el-main {
    // max-height: 600px;
    // width: 1865px;
    // overflow: hidden;
    // overflow-y: auto;
    // overflow-x: auto;
    --el-main-padding: 12px;
  }
}
</style>
