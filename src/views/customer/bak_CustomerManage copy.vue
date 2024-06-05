<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref } from 'vue'
import { userListService } from '@/api/user.js'
import {
  customerListService,
  customerNameListService,
  customerEmailListService,
  customerAddService,
  customerUpdateService,
  customerDeleteService
} from '@/api/customer.js'

//---------- 定義數據模型 ----------
//1.客戶列表數據模型
const customers = ref([])
//2.條件搜尋數據模型
const nameList = ref([])
const name = ref('')
const emailList = ref([])
const email = ref('')
const coachList = ref([])
const coachId = ref([])
const gender = ref('')

//----------------- 分頁及頁面呈現相關 -------------------
//1.分頁元件數據模型
const pageNum = ref(1) //當前頁碼
const total = ref(10) //總條數
const pageSize = ref(5) //每頁條數
//2.當頁面大小改變時執行，更新頁面大小
const onSizeChange = (size) => {
  pageSize.value = size
  customerList()
}
//3.當前頁面改變時執行，更新當前頁面
const onCurrentChange = (num) => {
  pageNum.value = num
  customerList()
}

//------------ 篩選條件下拉列表-------------------
//1.客戶名稱列表
const customerNameList = async () => {
  let result = await customerNameListService()
  nameList.value = result.data
}
customerNameList()
//2.客戶信箱列表
const customerEmailList = async () => {
  let result = await customerEmailListService()
  emailList.value = result.data
}
customerEmailList()
//3.教練(系統使用者user)列表
const userList = async () => {
  let result = await userListService()
  coachList.value = result.data
}
userList()

//4.清空篩選條件
const clearQueryCondition = () => {
  name.value = ''
  email.value = ''
  coachId.value = ''
  gender.value = ''
  customerList()
}

//-------------- 獲取客戶列表 ---------------
const customerList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    name: name.value ? name.value : null,
    email: email.value ? email.value : null,
    gender: gender.value ? gender.value : null,
    coachId: coachId.value ? coachId.value : null
  }
  let result = await customerListService(params)

  //渲染視圖
  total.value = result.data.total
  customers.value = result.data.items

  //處理數據:
  for (let i in customers.value) {
    let customer = customers.value[i]
    console.log(customer)
    for (let j in coachList.value) {
      if (customer.coachId === coachList.value[j].id) {
        customer.coachName = coachList.value[j].username
      }
    }
  }
}
customerList()
const translateGender = (genderCode) => {
  return genderCode === 'M' ? '男' : genderCode === 'F' ? '女' : genderCode
}

//------------ 新增、修改、刪除客戶 -------------

//控制編輯窗顯示
const visibleDrawer = ref(false)
//控制彈窗名稱(預設為新增客戶,點擊edit->編輯客戶)
const title = ref('')
//客戶資訊模型
const customerModel = ref({
  name: '',
  gender: '',
  birthday: '',
  phoneNumber: '',
  email: '',
  firstLesson: '',
  lastLesson: '',
  totalLessons: '',
  remainingLessons: '',
  coachId: '',
  medicalHistory: '',
  medication: '',
  symptoms: '',
  symptomCauses: '',
  transportationHabits: '',
  exerciseHabits: ''
})
//清空客戶資訊模型(清除前次編輯內容)
const resetCustomerModel = () => {
  customerModel.value.name = ''
  customerModel.value.gender = ''
  customerModel.value.birthday = ''
  customerModel.value.phoneNumber = ''
  customerModel.value.email = ''
  customerModel.value.firstLesson = ''
  customerModel.value.lastLesson = ''
  customerModel.value.totalLessons = ''
  customerModel.value.coachId = ''
  customerModel.value.remainingLessons = ''
  customerModel.value.medicalHistory = ''
  customerModel.value.medication = ''
  customerModel.value.symptoms = ''
  customerModel.value.symptomCauses = ''
  customerModel.value.transportationHabits = ''
  customerModel.value.exerciseHabits = ''
}

//1.新增文章
//顯示彈窗,清除customerModel(可能有舊的數據)
const showAddDialog = () => {
  title.value = '新增客戶'
  resetCustomerModel()
  visibleDrawer.value = true
}
//2.
const addCustomer = async () => {
  let result = await customerAddService(customerModel.value)
  ElMessage.success(result.message ? result.message : '成功新增文章')
  resetCustomerModel()
  visibleDrawer.value = false
  customerList()
}

//2.編輯客戶
//客戶資料回顯
const showEditDialog = (row) => {
  title.value = '編輯客戶資訊'
  //顯示編輯彈窗(同新增)
  visibleDrawer.value = true
  //回顯數據
  customerModel.value.name = row.name
  customerModel.value.gender = row.gender
  customerModel.value.birthday = row.birthday
  customerModel.value.phoneNumber = row.phoneNumber
  customerModel.value.email = row.email
  customerModel.value.firstLesson = row.firstLesson
  customerModel.value.lastLesson = row.lastLesson
  customerModel.value.totalLessons = row.totalLessons
  customerModel.value.remainingLessons = row.remainingLessons
  customerModel.value.coachId = row.coachId
  customerModel.value.medicalHistory = row.medicalHistory
  customerModel.value.medication = row.medication
  customerModel.value.symptoms = row.symptoms
  customerModel.value.symptomCauses = row.symptomCauses
  customerModel.value.transportationHabits = row.transportationHabits
  customerModel.value.exerciseHabits = row.exerciseHabits
  //更新api必須傳id
  customerModel.value.id = row.id
}
//調用api更新客戶內容
const updateArticle = async () => {
  let result = await customerUpdateService(customerModel.value)
  ElMessage.success(result.message ? result.message : '成功編輯客戶資訊')
  //刷新頁面，清空數據，顯示編輯後客戶，隱藏彈窗
  customerList()
  resetCustomerModel()
  visibleDrawer.value = false
}
//3.刪除客戶
const deleteCustomer = async (row) => {
  //確認用戶是否要刪除
  ElMessageBox.confirm('真的要刪除這個客戶嗎', 'Double Check', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await customerDeleteService(row.id)
      customerList()
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
    <!-- header -->
    <template #header>
      <div class="header">
        <span>客戶基本資料管理</span>
        <div class="extra">
          <el-button type="primary" @click="showAddDialog"> 新增客戶 </el-button>
        </div>
      </div>
    </template>

    <!-- 篩選表單 -->
    <el-form inline>
      <el-form-item label="姓名: ">
        <el-select class="name-selector" placeholder="請選擇" v-model="name" filterable>
          <el-option v-for="name in nameList" :key="name" :label="name" :value="name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信箱: ">
        <el-select class="email-selector" placeholder="請選擇" v-model="email" filterable>
          <el-option
            v-for="email in emailList"
            :key="email"
            :label="email"
            :value="email"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所屬教練: ">
        <el-select class="coach-selector" placeholder="請選擇" v-model="coachId">
          <el-option
            v-for="c in coachList"
            :key="c.id"
            :label="c.username"
            :value="c.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性別: ">
        <el-select class="gender-selector" placeholder="請選擇" v-model="gender">
          <el-option label="男" value="M"></el-option>
          <el-option label="女" value="F"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="customerList">搜尋</el-button>
        <el-button @click="clearQueryCondition">清空條件</el-button>
      </el-form-item>
    </el-form>

    <!-- 文章列表 -->
    <el-table :data="customers" style="width: 100%">
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
            @click="deleteCustomer(row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="70" prop="name"> </el-table-column>
      <el-table-column label="性別" width="70" prop="gender">
        <template #default="{ row }">
          {{ translateGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="90" prop="birthday"></el-table-column>
      <el-table-column label="手機" width="100" prop="phoneNumber"></el-table-column>
      <el-table-column label="信箱" width="100" prop="email"></el-table-column>
      <el-table-column label="初次來店" width="100" prop="firstLesson"></el-table-column>
      <el-table-column label="末次來店" width="100" prop="lastLesson"></el-table-column>
      <el-table-column label="來店總數" width="90" prop="totalLessons"></el-table-column>
      <el-table-column label="所屬教練" width="90" prop="coachName"></el-table-column>
      <el-table-column label="剩餘次數" width="90" prop="remainingLessons"></el-table-column>
      <el-table-column label="過往病史" width="100" prop="medicalHistory"></el-table-column>
      <el-table-column label="用藥情形" width="100" prop="medication"></el-table-column>
      <el-table-column label="不適症狀" width="200" prop="symptoms"></el-table-column>
      <el-table-column label="症狀肇因" width="200" prop="symptomCauses"></el-table-column>
      <el-table-column label="交通習慣" width="90" prop="transportationHabits"></el-table-column>
      <el-table-column label="運動習慣" width="90" prop="exerciseHabits"></el-table-column>

      <!-- 如果沒有客戶數據顯示"暫無數據" -->
      <template #empty>
        <el-empty description="暫無數據" />
      </template>
    </el-table>

    <!-- 分頁元件 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      layout="jumper,total,sizes,pager,next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- 新增文章滑動彈窗 -->
    <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="60%">
      <el-form :model="customorModel" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="customerModel.name" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="性別">
          <el-select placeholder="請選擇" v-model="customerModel.gender">
            <el-option label="男" value="M"></el-option>
            <el-option label="女" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="customerModel.birthday" placeholder="日期格式為2024-01-01"></el-input>
        </el-form-item>
        <el-form-item label="手機">
          <el-input v-model="customerModel.phoneNumber" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="信箱">
          <el-input v-model="customerModel.email" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="初次來店">
          <el-input
            v-model="customerModel.firstLesson"
            placeholder="日期格式為2024-01-01"
          ></el-input>
        </el-form-item>
        <el-form-item label="末次來店">
          <el-input
            v-model="customerModel.lastLesson"
            placeholder="日期格式為2024-01-01"
          ></el-input>
        </el-form-item>
        <el-form-item label="來店總數">
          <el-input v-model="customerModel.totalLessons" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="剩餘次數">
          <el-input v-model="customerModel.remainingLessons" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="所屬教練">
          <el-select class="coach-selector" placeholder="請選擇" v-model="customerModel.coachId">
            <el-option
              v-for="c in coachList"
              :key="c.id"
              :label="c.username"
              :value="c.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="過往病史">
          <el-input
            type="textarea"
            v-model="customerModel.medicalHistory"
            placeholder="請輸入"
            rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="用藥情形">
          <el-input v-model="customerModel.medication" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="不適症狀">
          <el-input v-model="customerModel.symptoms" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="症狀肇因">
          <el-input v-model="customerModel.symptomCauses" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="交通習慣">
          <el-input v-model="customerModel.transportationHabits" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="運動習慣">
          <el-input v-model="customerModel.exerciseHabits" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="title == '新增客戶' ? addCustomer() : updateArticle()"
            >確認</el-button
          >
          <el-button type="info" @click="resetCustomerModel">清空</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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

.el-select {
  --el-select-width: 100px;
}

.editer {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 100px;
  }
}

.table-container {
  max-height: 500px; /* 或設定一個適合的固定高度 */
  overflow-x: auto; /* 使得橫向滾動條出現在表格內容超出容器寬度時 */
  width: 100%; /* 可以根據需要調整 */
}
</style>
