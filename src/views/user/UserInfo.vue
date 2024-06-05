<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/index.js'
import { userInfoUpdateService } from '@/api/user.js'
const userInfoStore = useUserInfoStore()
// 定義用戶資訊模型
const userInfo = ref({ ...userInfoStore.info })
// 定義表單驗證規則
const rules = {
  username: [
    { required: true, message: '用戶名稱不能為空', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9!@#$%^&*()_+]{2,20}$/,
      message: '用戶名稱必須是2-10位的字母或數字或特殊符號',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '郵箱不能為空', trigger: 'blur' },
    { type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
  ]
}

const updtaeUesrInfo = async () => {
  let result = await userInfoUpdateService(userInfo.value)
  ElMessage.success(result.message ? result.message : '成功更新個人資訊')
  //更新後的資料存入useUserInfoStore
  userInfoStore.setInfo(userInfo.value)
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本資料</span>
      </div>
    </template>

    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="150px" size="large">
          <el-form-item label="用戶名稱(帳號)" prop="username">
            <el-input v-model="userInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="電子信箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updtaeUesrInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
