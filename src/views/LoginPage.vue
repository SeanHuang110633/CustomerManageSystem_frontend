<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useTokenStore } from '@/stores/index.js'
//控制顯示註冊或登入表單，默認為登入
const isRegister = ref(false)
const form = ref()

//-----註冊功能-----
//1.定義註冊數據模型
const registerData = ref({
  username: '',
  userPassword: '',
  rePassword: ''
})

//2.驗證密碼的函數
const checkRePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必須再次輸入密碼，請輸入'))
  } else if (value !== registerData.value.userPassword) {
    callback(new Error('兩次輸入密碼不同，請重新輸入'))
  } else {
    callback() // 無錯誤時的回調
  }
}

//3.定義註冊表單驗證規則
const rules = {
  username: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    { min: 2, max: 20, message: '長度應為2~20個字符之間', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 24, message: '長度應為6~24個字符之間', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+]{6,24}$/,
      message: '密碼必須包含英文字母和數字，允許特殊符號',
      trigger: 'blur'
    }
  ],
  rePassword: [
    { required: true, message: '請確認密碼', trigger: 'blur' },
    { validator: checkRePassword, trigger: 'blur' }
  ]
}

//4.調用服務端接口，完成註冊

const register = async () => {
  await form.value.validate()
  let result = await userRegisterService(registerData.value)
  ElMessage.success(result.message ? result.message : '註冊成功!')
  //轉跳登入頁
  isRegister.value = false
}

//------登入-------

//1.定義登入數據模型
const loginData = ref({
  username: '',
  userPassword: ''
})
//2.定義表單驗證規則(複用註冊rules)
//3.調用服務端接口，完成登入獲取token存到tokenStore,並跳轉到主頁
const tokenStore = useTokenStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  let result = await userLoginService(loginData.value)
  ElMessage.success(result.message ? result.message : '登入成功!')
  tokenStore.setToken(result.data)
  //跳轉到主頁
  router.push('/')
}
</script>

<template>
  <!-- 定義登入頁面的容器 -->
  <el-row class="login-page">
    <el-col :span="12" class="bg">
      <div class="bg-text1">1RM健護工作室</div>
      <div class="bg-text2">客戶管理系統</div>
    </el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 註冊表單 -->
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>用戶註冊</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="請輸入用戶名"
            v-model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            :prefix-icon="Lock"
            type="Password"
            placeholder="請輸入密碼"
            v-model="registerData.userPassword"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            placeholder="請再次輸入密碼"
            v-model="registerData.rePassword"
            @keyup.enter="register"
          ></el-input>
        </el-form-item>
        <!-- 註冊按鈕 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            註冊
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" underline="false" @click="isRegister = false"> 返回 </el-link>
        </el-form-item>
      </el-form>
      <!-- 登入表單 -->
      <el-form ref="form" size="large" autocomplete="off" v-else :model="loginData" :rules="rules">
        <el-form-item>
          <h1>登入系統</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="請輸入用戶名"
            v-model="loginData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            name="userPassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="請輸入密碼"
            v-model="loginData.userPassword"
            @keyup.enter="login"
          ></el-input>
        </el-form-item>

        <!-- 先保留 -->
        <!-- <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>記住我</el-checkbox>
            <el-link type="primary" underline="false">忘記密碼?</el-link>
          </div>
        </el-form-item> -->

        <!-- 登入按鈕 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">
            登入
          </el-button>
        </el-form-item>
        <!-- 暫時只需要一個用戶 -->
        <!-- <el-form-item class="flex">
          <el-link type="info" underline="false" @click="isRegister = true"> 註冊 </el-link>
        </el-form-item> -->
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;
}

.bg {
  background-color: rgb(115, 142, 205);
  display: flex;
  flex-direction: column;
  justify-content: center; // 垂直置中
  align-items: center; // 水平置中
  height: 100%;
  //url('@/assets/example.jpg') no-repeat 60% center / 300px auto;
  // url('@/assets/login_bg.jpg') no-repeat center / cover;
  border-radius: 0 30px 30px 0;
  .bg-text1,
  .bg-text2 {
    font-family: 'Arial', sans-serif; // 更換字體
    font-size: 66px; // 字體大小
    color: hsl(0, 18%, 97%); // 字體顏色
    padding: 10px; // 增加一些內邊距
    letter-spacing: 7px;
  }
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;

  .title {
    margin: 0 auto;
  }

  .button {
    width: 100%;
  }

  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
