<script setup>
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { computed, ref, watch } from 'vue'
import { userListService } from '@/api/user.js'
import {
  customerListService,
  customerAddService,
  customerUpdateService,
  customerDeleteService,
  customerListApproachService
} from '@/api/customer.js'

//---------- 定義數據模型 ----------
//1.客戶列表數據模型
const customers = ref([])
//2.條件搜尋數據模型
const customerName = ref('')
const email = ref('')
const coachId = ref([])
const coachList = ref([])
const approach = ref('')
const approachList = ref([])

//----------------- 分頁及頁面呈現相關 -------------------
//1.分頁元件數據模型
const pageNum = ref(1) //當前頁碼
const total = ref(20) //總條數
const pageSize = ref(20) //每頁條數

//2.當頁面總資料數改變時，更新頁面大小
const onSizeChange = (size) => {
  pageSize.value = size
  customerList()
}
//3.當前頁面改變時執行，更新當前頁面
const onCurrentChange = (num) => {
  pageNum.value = num
  customerList()
}

//------------ 篩選條件 -------------------
//教練(系統使用者user)列表
const getCoachList = async () => {
  let result = await userListService()
  coachList.value = result.data
}
getCoachList()

const gatApproachList = async () => {
  let result = await customerListApproachService()

  // 展開數組
  const flattenedArray = Object.values(result.data).reduce((acc, val) => acc.concat(val), [])
  // 使用 Set 去重
  const approaches = Array.from(new Set(flattenedArray))

  approachList.value = approaches
}
gatApproachList()

//清空篩選條件
const clearQueryCondition = () => {
  coachId.value = ''
  approach.value = ''
  customerList()
}

//-------------- 獲取客戶列表 ---------------
const customerList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    customerName: customerName.value ? customerName.value : null,
    email: email.value ? email.value : null,
    approach: approach.value ? approach.value : null,
    coachId: coachId.value ? coachId.value : null
  }
  let result = await customerListService(params)

  //渲染視圖
  total.value = result.data.total
  customers.value = result.data.items

  //處理數據:
  for (let i in customers.value) {
    let customer = customers.value[i]
    for (let j in coachList.value) {
      if (customer.coachId === coachList.value[j].id) {
        customer.coachName = coachList.value[j].username
      }
    }
  }
}
customerList()

// 性別轉換為中文表示
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
  customerName: '',
  gender: '',
  birthYear: '',
  phoneNumber: '',
  email: '',
  frequency: '',
  approach: '',
  firstLesson: '',
  lastLesson: '',
  totalLessons: '',
  remainingLessons: '',
  coachId: '',
  medicalHistoryCategory: [],
  medicalHistoryBroken: '',
  medicalHistorySurgery: '',
  medicalHistoryOther: '',
  medication: '',
  symptoms: '',
  symptomCauses: '',
  transportationHabits: '',
  exerciseHabits: ''
})

//清空客戶資訊模型(清除前次編輯內容)
const resetCustomerModel = () => {
  customerModel.value.customerName = ''
  customerModel.value.gender = ''
  customerModel.value.birthYear = ''
  customerModel.value.phoneNumber = ''
  customerModel.value.email = ''
  customerModel.value.frequency = ''
  customerModel.value.approach = ''
  customerModel.value.firstLesson = ''
  customerModel.value.lastLesson = ''
  customerModel.value.totalLessons = ''
  customerModel.value.coachId = ''
  customerModel.value.remainingLessons = ''
  customerModel.value.medicalHistoryCategory = []
  customerModel.value.medicalHistoryBroken = ''
  customerModel.value.medicalHistorySurgery = ''
  customerModel.value.medicalHistoryOther = ''
  customerModel.value.medication = ''
  customerModel.value.symptoms = ''
  customerModel.value.symptomCauses = ''
  customerModel.value.transportationHabits = ''
  customerModel.value.exerciseHabits = ''
}

//定義新增及編輯驗證規則
const rules = {
  customerName: [
    { required: true, message: '請輸入用戶名', trigger: 'blur' },
    { min: 2, max: 20, message: '長度應為2~20個字符之間', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '必須選擇', trigger: 'blur' }],
  //phoneNumber: [{ required: true, message: '必須輸入', trigger: 'blur' }],
  email: [{ type: 'email', message: '請輸入正確的電子郵件地址', trigger: ['blur', 'change'] }],
  firstLesson: [{ required: true, message: '必須輸入', trigger: 'blur' }],
  lastLesson: [{ required: true, message: '必須輸入', trigger: 'blur' }],
  coachId: [{ required: true, message: '必須輸入', trigger: 'blur' }]
}

//編輯病史：打勾時顯示對應輸入框
const showInputA = ref(false)
const showInputB = ref(false)
const showInputC = ref(false)

watch(
  () => customerModel.value.medicalHistoryCategory,
  (newVal) => {
    console.log('==== watch the change =========')
    console.log(newVal)
    if (newVal == null) {
      //新增medicalHistoryCategory字段初始為null，舊有的病史都放在medicalHistoryOther，所以特別處理這個部分
      customerModel.value.medicalHistoryCategory = [] //初始化
      if (customerModel.value.medicalHistoryOther !== '無') {
        //正式時改成null
        customerModel.value.medicalHistoryCategory.push('其他')
      }
    } else {
      showInputA.value = newVal.includes('扭傷/骨折')
      showInputB.value = newVal.includes('重大手術')
      showInputC.value = newVal.includes('其他')

      //編輯時，如果取消打勾，要清除對應input的資料
      if (!newVal.includes('扭傷/骨折')) {
        customerModel.value.medicalHistoryBroken = ''
      }
      if (!newVal.includes('重大手術')) {
        customerModel.value.medicalHistorySurgery = ''
      }
      if (!newVal.includes('其他')) {
        customerModel.value.medicalHistoryOther = ''
      }
    }
  },
  { immediate: true }
)

//1.新增客戶
//顯示彈窗,清除customerModel(可能有舊的數據)
const showAddDialog = () => {
  title.value = '新增客戶'
  resetCustomerModel()
  visibleDrawer.value = true
}
//調用api新增客戶內容
const addCustomer = async () => {
  let result = await customerAddService(customerModel.value)
  ElMessage.success(result.message ? result.message : '成功新增客戶')
  resetCustomerModel()
  visibleDrawer.value = false
  customerList()
}

//2.編輯客戶
//客戶資料回顯
const showEditDialog = (row) => {
  console.log('=============== 查看資料回顯 ================')
  console.log(row)
  title.value = '客戶詳細資訊 (可編輯 / 刪除)'
  //回顯數據
  customerModel.value.customerName = row.customerName
  customerModel.value.gender = row.gender
  customerModel.value.birthYear = row.birthYear
  customerModel.value.phoneNumber = row.phoneNumber
  customerModel.value.email = row.email
  customerModel.value.frequency = row.frequency
  customerModel.value.approach = row.approach
  customerModel.value.firstLesson = row.firstLesson
  customerModel.value.lastLesson = row.lastLesson
  customerModel.value.totalLessons = row.totalLessons
  customerModel.value.remainingLessons = row.remainingLessons
  customerModel.value.coachId = row.coachId
  customerModel.value.medicalHistoryCategory = row.medicalHistoryCategory
  customerModel.value.medicalHistoryBroken = row.medicalHistoryBroken
  customerModel.value.medicalHistorySurgery = row.medicalHistorySurgery
  customerModel.value.medicalHistoryOther = row.medicalHistoryOther
  customerModel.value.medication = row.medication
  customerModel.value.symptoms = row.symptoms
  customerModel.value.symptomCauses = row.symptomCauses
  customerModel.value.transportationHabits = row.transportationHabits
  customerModel.value.exerciseHabits = row.exerciseHabits
  customerModel.value.id = row.id //更新時必須傳id
  //顯示編輯彈窗(同新增)
  visibleDrawer.value = true
}
//調用api更新客戶內容
const updateCustomer = async () => {
  let result = await customerUpdateService(customerModel.value)
  ElMessage.success(result.message ? result.message : '成功編輯客戶資訊')
  //刷新頁面，清空數據，顯示編輯後客戶，隱藏彈窗
  customerList()
  resetCustomerModel()
  visibleDrawer.value = false
}

//3.刪除客戶
const deleteCustomer1 = async (id) => {
  console.log(id)
  //確認用戶是否要刪除
  ElMessageBox.confirm('真的要刪除這個客戶嗎', 'Double Check', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      await customerDeleteService(id)
      visibleDrawer.value = false
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

//--------------- 篩選功能 ---------------------
const searchByName = ref('')
const searchByEmail = ref('')
const searchByPhoneNumber = ref('')

const filterTableData = computed(() =>
  customers.value.filter(
    (customer) =>
      (customer.customerName.includes(searchByName.value) &&
        !searchByPhoneNumber.value &&
        !searchByEmail.value) ||
      (!searchByName.value &&
        !searchByPhoneNumber.value &&
        customer.email.includes(searchByEmail.value)) ||
      (!searchByName.value &&
        customer.phoneNumber.includes(searchByPhoneNumber.value) &&
        !searchByEmail.value)
  )
)
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
      <el-form-item label="客戶來源: ">
        <el-select class="approach-selector" placeholder="請選擇" v-model="approach">
          <el-option
            v-for="approach in approachList"
            :key="approach"
            :label="approach"
            :value="approach"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="customerList">搜尋</el-button>
        <el-button @click="clearQueryCondition">清空條件</el-button>
      </el-form-item>
      <!-- 分頁元件 -->
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[1, 50, 100, 150]"
        layout="jumper,total,sizes,pager,next"
        background
        :total="total"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        style="justify-content: flex-end"
      />
    </el-form>
    <!-- <el-divider /> -->
    <hr style="border: none; height: 1.5px; background-color: rgba(128, 128, 128, 0.2)" />

    <!-- 客戶列表 -->
    <el-table
      :data="filterTableData"
      class="test-container"
      :default-sort="{ prop: 'lastLesson', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column label="詳細資訊" width="˙50">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="showEditDialog(row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="90" prop="customerName">
        <template #header>
          <el-input v-model="searchByName" size="small" placeholder="姓名搜尋" />
        </template>
      </el-table-column>
      <el-table-column label="性別" width="70" prop="gender">
        <template #default="{ row }">
          {{ translateGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="出生年" width="80" prop="birthYear"></el-table-column>
      <el-table-column label="聯絡方式" width="100" prop="phoneNumber"></el-table-column>
      <el-table-column label="聯絡方式" width="100" prop="phoneNumber">
        <template #header>
          <el-input v-model="searchByPhoneNumber" size="small" placeholder="手機搜尋" />
        </template>
      </el-table-column>
      <el-table-column label="信箱" width="150" prop="email">
        <template #header>
          <el-input v-model="searchByEmail" size="small" placeholder="信箱搜尋" />
        </template>
      </el-table-column>
      <el-table-column label="頻率" width="50" prop="frequency"></el-table-column>
      <el-table-column label="來源" width="50" prop="approach"></el-table-column>
      <el-table-column label="初次來店" width="120" prop="firstLesson" sortable></el-table-column>
      <el-table-column label="末次來店" width="120" prop="lastLesson" sortable></el-table-column>
      <el-table-column label="總次數" width="90" prop="totalLessons" sortable></el-table-column>
      <el-table-column label="剩餘次數" width="80" prop="remainingLessons"></el-table-column>
      <el-table-column label="所屬教練" width="100" prop="coachName"></el-table-column>

      <!-- 如果沒有客戶數據顯示"暫無數據" -->
      <template #empty>
        <el-empty description="暫無數據" />
      </template>
    </el-table>

    <!-- 編輯視窗 -->
    <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="60%">
      <el-form :model="customerModel" label-width="100px" :rules="rules">
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="customerModel.customerName" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          <el-select placeholder="請選擇" v-model="customerModel.gender">
            <el-option label="男" value="M"></el-option>
            <el-option label="女" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年">
          <el-input v-model="customerModel.birthYear" placeholder="請輸入西元年"></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="phoneNumber">
          <el-input v-model="customerModel.phoneNumber" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="信箱" prop="email">
          <el-input
            v-model="customerModel.email"
            placeholder="如未輸入,系統預設為 default@gmail.com"
          ></el-input>
        </el-form-item>
        <el-form-item label="頻率">
          <el-input v-model="customerModel.frequency" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="來源">
          <el-input v-model="customerModel.approach" placeholder="請輸入"></el-input>
        </el-form-item>
        <el-form-item label="初次來店" prop="firstLesson">
          <el-date-picker
            v-model="customerModel.firstLesson"
            type="date"
            placeholder="請選擇"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="末次來店" prop="lastLesson">
          <el-date-picker
            v-model="customerModel.lastLesson"
            type="date"
            placeholder="請選擇"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="總次數">
          <el-input-number
            v-model="customerModel.totalLessons"
            :min="0"
            :max="10000"
            controls-position="right"
            size="small"
          />
        </el-form-item>
        <el-form-item label="剩餘次數">
          <el-input-number
            v-model="customerModel.remainingLessons"
            :min="0"
            :max="10000"
            controls-position="right"
            size="small"
          />
        </el-form-item>
        <el-form-item label="所屬教練" prop="coachId">
          <el-select class="coach-selector" placeholder="請選擇" v-model="customerModel.coachId">
            <el-option
              v-for="c in coachList"
              :key="c.id"
              :label="c.username"
              :value="c.id"
            ></el-option>
          </el-select>
          <el-button type="info" disabled link style="margin-left: 20px"
            >未指定的都給Robin</el-button
          >
        </el-form-item>

        <el-form-item label="過往病史">
          <el-checkbox-group v-model="customerModel.medicalHistoryCategory">
            <div class="medical-history-item">
              <el-checkbox label="扭傷/骨折" name="category" value="扭傷/骨折" />
              <el-input
                v-if="showInputA"
                v-model="customerModel.medicalHistoryBroken"
                autosize
                type="textarea"
                placeholder="請輸入具體狀況"
              />
            </div>
            <div class="medical-history-item">
              <el-checkbox label="重大手術" name="category" value="重大手術" />
              <el-input
                v-if="showInputB"
                v-model="customerModel.medicalHistorySurgery"
                autosize
                type="textarea"
                placeholder="請輸入具體狀況"
              />
            </div>
            <div class="medical-history-item">
              <el-checkbox label="其他" name="category" value="其他" />
              <el-input
                v-if="showInputC"
                v-model="customerModel.medicalHistoryOther"
                autosize
                type="textarea"
                placeholder="請輸入具體狀況"
              />
            </div>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用藥情形">
          <el-input
            v-model="customerModel.medication"
            :placeholder="
              title === '客戶詳細資訊 (可編輯 / 刪除)'
                ? '如無相關情形請輸入「無」'
                : '無相關情形可不輸入(預設值為「無」)'
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="不適症狀">
          <el-input
            type="textarea"
            v-model="customerModel.symptoms"
            :placeholder="
              title === '客戶詳細資訊 (可編輯 / 刪除)'
                ? '如無相關情形請輸入「無」'
                : '無相關情形可不輸入(預設值為「無」)'
            "
            rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="症狀肇因">
          <el-input
            type="textarea"
            v-model="customerModel.symptomCauses"
            :placeholder="
              title === '客戶詳細資訊 (可編輯 / 刪除)'
                ? '如無相關情形請輸入「無」'
                : '無相關情形可不輸入(預設值為「無」)'
            "
            rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="交通習慣">
          <el-input
            v-model="customerModel.transportationHabits"
            :placeholder="
              title === '客戶詳細資訊 (可編輯 / 刪除)'
                ? '如無交通習慣請輸入「無」'
                : '無交通習慣可不輸入(預設值為「無」)'
            "
          ></el-input>
        </el-form-item>
        <el-form-item label="運動習慣">
          <el-input
            v-model="customerModel.exerciseHabits"
            :placeholder="
              title === '客戶詳細資訊 (可編輯 / 刪除)'
                ? '如無運動習慣請輸入「無」'
                : '無運動習慣可不輸入(預設值為「無」)'
            "
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="title === '新增客戶' ? addCustomer() : updateCustomer()"
          >
            確認提交
          </el-button>
          <el-button
            v-if="title !== '新增客戶'"
            type="danger"
            @click="deleteCustomer1(customerModel.id)"
            >刪除客戶</el-button
          >
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
  height: 15px;
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
</style>
