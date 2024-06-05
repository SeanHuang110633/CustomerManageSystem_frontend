<script setup>
import { ref } from 'vue'
import { userPwdUpdate } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/index.js'
import { useRouter } from 'vue-router'
//定義數據模型
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
//清空數據模型
const clearForm = () => {
  form.value.old_pwd = ''
  form.value.new_pwd = ''
  form.value.re_pwd = ''
}
//定義校驗規則
const rules = {
  old_pwd: [{ required: true, message: '請輸入舊密碼', trigger: 'blur' }],
  new_pwd: [
    { required: true, message: '請輸入新密碼', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value === form.value.old_pwd) {
          return new Error('新密碼不能與舊密碼相同')
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '請再次輸入新密碼', trigger: 'blur' },
    {
      validator: (rule, value) => {
        if (value !== form.value.new_pwd) {
          return new Error('兩次輸入的新密碼不一致')
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}
//發送給服務端
const router = useRouter()
const Submit = async () => {
  await userPwdUpdate(form.value)
  ElMessage.success('成功修改密碼，將跳轉登入頁')
  setTimeout(() => {
    router.push('/login')
  }, 1500)
  clearForm()
}
const tokenStore = useTokenStore()
console.log(tokenStore.token)
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>修改用戶密碼</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="form" :rules="rules">
          <el-form-item label="舊密碼" prop="old_pwd">
            <el-input v-model="form.old_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密碼" prop="new_pwd">
            <el-input v-model="form.new_pwd" type="password"></el-input>
          </el-form-item>
          <el-form-item label="確認新密碼" prop="re_pwd">
            <el-input v-model="form.re_pwd" type="password" @keyup.enter="Submit"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="Submit">提交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
}
.header {
  height: 15px;
}
</style>
