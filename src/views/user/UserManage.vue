<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import { userListService, userRoleUpdateService, userDeleteService } from '@/api/user.js'

//定義用戶數據模型
const users = ref([])
//定義編輯用戶數據模型
const userModel = ref({
  username: '',
  email: '',
  userRole: ''
})

//獲得所有用戶
const userList = async () => {
  let result = await userListService()
  users.value = result.data
}
userList()

// 控制對話框顯示
const dialogVisible = ref(false)

//-------------- 變更用戶權限 ---------------
//1.顯示編輯窗，資料回顯
const showEditDialog = (row) => {
  dialogVisible.value = true
  //資料回顯
  userModel.value.username = row.username
  userModel.value.userRole = row.userRole
  //更新權限需要傳id
  userModel.value.id = row.id
}

//2.調用api變更用戶權限
const updateRole = async () => {
  console.log('sjhshskdjglkajf:' + userModel.value.id, userModel.value.role)
  console.log(typeof userModel.value.id)
  let result = await userRoleUpdateService(userModel.value.id, userModel.value.userRole)
  ElMessage.success(result.message ? result.message : '成功變更使用戶權限')
  dialogVisible.value = false
  userList()
}

//--------------- 刪除用戶 ---------------
const deleteCategory = (row) => {
  //確認用戶是否要刪除
  ElMessageBox.confirm('真的要刪除這個用戶(教練)嗎', 'Double Check', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await userDeleteService(row.id)
      userList()
      ElMessage({
        type: 'success',
        message: '成功刪除'
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消刪除'
      })
    })
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>系統用戶(教練)管理</span>
      </div>
    </template>

    <el-table :data="users" style="width: 100%">
      <el-table-column label="序號" width="100" type="index"></el-table-column>
      <el-table-column label="用戶名" prop="username"></el-table-column>
      <el-table-column label="電子信箱" prop="email"></el-table-column>
      <el-table-column label="系統權限" prop="userRole"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showEditDialog(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="deleteCategory(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="沒有數據"></el-empty>
      </template>
    </el-table>

    <!-- 編輯窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="變更用戶權限"
      width="30%"
      :style="{ paddingRight: '30px' }"
    >
      <el-form :model="userModel" label-width="100px">
        <el-form-item label="用戶名稱" prop="username">
          <el-input v-model="userModel.username" minlength="1" maxlength="10" disabled></el-input>
        </el-form-item>
        <el-form-item label="用戶權限" prop="userRole">
          <el-input v-model="userModel.userRole" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateRole"> 確認 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
