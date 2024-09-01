<script setup>
import { Edit } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { nextTick, ref } from 'vue'
import { userListService } from '@/api/user.js'
import {
  customerListService,
  customerAddService,
  customerUpdateService,
  customerDeleteService
} from '@/api/customer.js'

//---------- 定義數據模型 ----------
//1.客戶列表數據模型
const customers = ref([])
//2.條件搜尋數據模型
const customerName = ref('')
const phoneNumber = ref('')
const coachId = ref()
const coachList = ref([])
// const customerNameList = ref([])

//----------------- 分頁及頁面呈現相關 -------------------
//1.分頁元件數據模型
const pageNum = ref(1) //當前頁碼
const total = ref(100) //當頁總條數
const pageSize = ref(100) //每頁條數

//2.當頁面總資料數改變時，更新頁面大小
const onSizeChange = async (size) => {
  pageSize.value = size
  loading.value = true
  await customerList()
}
//3.當前頁面改變時執行，更新當前頁面
const onCurrentChange = async (num) => {
  pageNum.value = num
  loading.value = true
  await customerList()
}
//------------ 篩選條件 -------------------
//教練(系統使用者user)列表
const getCoachList = async () => {
  let result = await userListService()
  coachList.value = result.data
}
getCoachList()

//清空篩選條件
const clearQueryCondition = () => {
  coachId.value = ''
  customerName.value = ''
  phoneNumber.value = ''
  customerList()
}

//-------------- 獲取客戶列表 ---------------
const loading = ref(false) // 控制加載效果
const customerList = async () => {
  loading.value = true
  console.log('-----開始loading')
  let customerQueryReqeust = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    customerName: customerName.value ? customerName.value : null,
    phoneNumber: phoneNumber.value ? phoneNumber.value : null,
    coachId: coachId.value ? coachId.value : null
  }

  try {
    let result = await customerListService(customerQueryReqeust)

    //渲染視圖
    total.value = result.data.total //修改當頁總條數
    customers.value = result.data.items

    //處理數據:將coachId轉為coachName
    const coachMap = new Map()
    for (let coach of coachList.value) {
      coachMap.set(coach.id, coach.username)
    }

    for (let customer of customers.value) {
      if (coachMap.has(customer.coachId)) {
        customer.coachName = coachMap.get(customer.coachId)
      }
    }

    await nextTick() // 确保 DOM 完全更新
  } catch (error) {
    console.log('error masseage: ', error)
  } finally {
    console.log('-----loading完畢')
    loading.value = false
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
  regularExercises: [],
  otherExercises: '',
  approaches: [],
  otherApproaches: '',
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
  transportationCategory: [],
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
  customerModel.value.regularExercises = []
  customerModel.value.otherExercises = ''
  customerModel.value.approaches = []
  customerModel.value.otherApproaches = ''
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
  customerModel.value.transportationCategory = []
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

//1.新增客戶
//顯示彈窗,清除customerModel(可能有舊的數據)
const showAddDialog = () => {
  title.value = '新增客戶'
  // 初始化所有欄位
  otherExercisesInput.value = false
  otherApproachesInput.value = false
  brokenInput.value = false
  surgeryInput.value = false
  otherInput.value = false
  oldApproaches.value = ''
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

// 2.編輯客戶
// 顯示手動輸入框
const otherExercisesInput = ref(false)
const otherApproachesInput = ref(false)
const brokenInput = ref(false)
const surgeryInput = ref(false)
const otherInput = ref(false)

// 顯示原本的得知管道
const oldApproaches = ref('')

// 控制輸入框顯示&取消勾選時清空輸入框(沒送出更新就不會真的清空數據)
const showOtherExercisesInput = () => {
  if (otherExercisesInput.value) {
    otherExercisesInput.value = false
    customerModel.value.otherExercises = ''
  } else {
    otherExercisesInput.value = true
  }
}

const showOtherApproachesInput = () => {
  if (otherApproachesInput.value) {
    otherApproachesInput.value = false
    customerModel.value.otherApproaches = ''
  } else {
    otherApproachesInput.value = true
  }
}

const showBrokenInput = () => {
  if (brokenInput.value) {
    brokenInput.value = false
    customerModel.value.medicalHistoryBroken = ''
  } else {
    brokenInput.value = true
  }
}

const showSurgeryInput = () => {
  if (surgeryInput.value) {
    surgeryInput.value = false
    customerModel.value.medicalHistorySurgery = ''
  } else {
    surgeryInput.value = true
  }
}

const showOtherInput = () => {
  if (otherInput.value) {
    otherInput.value = false
    customerModel.value.medicalHistoryOther = ''
  } else {
    otherInput.value = true
  }
}
//客戶資料回顯
const showEditDialog = (row) => {
  console.log('=============== 查看資料回顯 ================')
  console.log(row)
  title.value = '編輯/刪除客戶 '
  //回顯數據
  customerModel.value.customerName = row.customerName
  customerModel.value.gender = row.gender
  customerModel.value.birthYear = row.birthYear
  customerModel.value.phoneNumber = row.phoneNumber
  customerModel.value.email = row.email
  customerModel.value.frequency = row.frequency
  customerModel.value.regularExercises = row.regularExercises
  customerModel.value.otherExercises = row.otherExercises
  customerModel.value.approaches = row.approaches
  customerModel.value.otherApproaches = row.otherApproaches
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
  customerModel.value.transportationCategory = row.transportationCategory
  customerModel.value.transportationHabits = row.transportationHabits
  customerModel.value.exerciseHabits = row.exerciseHabits
  customerModel.value.id = row.id //更新時必須傳id

  // 回顯原本的得知管道
  oldApproaches.value = row.oldApproaches

  /** 如果手動輸入的欄位(其他、骨折等等)有值，要顯示input
   * 沒值，要隱藏input */
  if (!isEmpty(row.otherExercises)) {
    otherExercisesInput.value = true
  } else {
    otherExercisesInput.value = false
  }
  if (!isEmpty(row.otherApproaches)) {
    otherApproachesInput.value = true
  } else {
    otherApproachesInput.value = false
  }
  if (!isEmpty(row.medicalHistoryBroken)) {
    brokenInput.value = true
  } else {
    brokenInput.value = false
  }
  if (!isEmpty(row.medicalHistorySurgery)) {
    surgeryInput.value = true
  } else {
    surgeryInput.value = false
  }
  if (!isEmpty(row.medicalHistoryOther)) {
    otherInput.value = true
  } else {
    otherInput.value = false
  }

  //資料都準備好後，顯示編輯彈窗(同新增)
  visibleDrawer.value = true
}
//調用api更新客戶內容
const updateCustomer = async () => {
  let result = await customerUpdateService(customerModel.value)
  ElMessage.success(result.message ? result.message : '成功編輯客戶資訊')
  //刷新頁面，清空編輯數據，顯示編輯後客戶，隱藏彈窗
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

//字符串判空的函數
const isEmpty = (str) => {
  if (str === null || str === '') {
    return true
  } else {
    return false
  }
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
      <el-form-item label="所屬教練: " style="color: aquamarine">
        <el-select class="coach-selector" placeholder="請選擇" v-model="coachId">
          <el-option
            v-for="c in coachList"
            :key="c.id"
            :label="c.username"
            :value="c.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="姓名搜尋: ">
        <el-input
          v-model="customerName"
          style="width: 150px"
          placeholder="輸入要查詢的客戶名"
          :prefix-icon="Search"
          @keyup.enter="customerList"
          clearable
        />
      </el-form-item>

      <el-form-item label="手機搜尋: ">
        <el-input
          v-model="phoneNumber"
          style="width: 180px"
          placeholder="輸入要查詢的客戶手機"
          :prefix-icon="Search"
          @keyup.enter="customerList"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-popover
          placement="top-start"
          :width="100"
          trigger="hover"
          content="輸入完按enter就好,不用點我"
        >
          <template #reference>
            <el-button type="primary" @click="customerList">搜尋</el-button>
          </template>
        </el-popover>

        <el-button type="primary" @click="clearQueryCondition">清空條件</el-button>
      </el-form-item>

      <!-- 分頁元件 -->
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[100, 300, 5000, 1000]"
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
      v-loading.fullscreen.lock="loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
      :data="customers"
      style="width: 100%"
      :header-cell-style="{ backgroundColor: '#64748b', color: '#fff', fontWeight: 'bold' }"
      :row-style="{ backgroundColor: '#fafaf9', fontWeight: 'bold' }"
    >
      <el-table-column label="詳細資訊" width="˙100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row)" />
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="150" prop="customerName"> </el-table-column>
      <el-table-column label="性別" width="100" prop="gender">
        <template #default="{ row }">
          {{ translateGender(row.gender) }}
        </template>
      </el-table-column>
      <el-table-column label="出生年" width="120" prop="birthYear"></el-table-column>
      <el-table-column label="聯絡方式" width="200" prop="phoneNumber"> </el-table-column>
      <el-table-column label="信箱" width="250" prop="email"> </el-table-column>
      <el-table-column label="來源" width="200" prop="approaches"></el-table-column>
      <el-table-column label="末次來店" width="200" prop="lastLesson" sortable></el-table-column>
      <el-table-column label="總次數" width="100" prop="totalLessons" sortable></el-table-column>
      <el-table-column label="剩餘次數" width="100" prop="remainingLessons"></el-table-column>
      <el-table-column label="所屬教練" width="150" prop="coachName"></el-table-column>

      <template #empty>
        <el-empty description="暫無數據" />
      </template>
    </el-table>

    <!-- 編輯視窗 -->
    <el-drawer
      v-if="visibleDrawer"
      v-model="visibleDrawer"
      direction="rtl"
      size="60%"
      madal="true"
      show-close="false"
    >
      <template #header="{ titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">{{ title }}</h4>
        <el-button
          size="large"
          type="primary"
          round
          @click="title === '新增客戶' ? addCustomer() : updateCustomer()"
        >
          確認提交
        </el-button>
        <el-button
          v-if="title !== '新增客戶'"
          size="large"
          type="danger"
          round
          @click="deleteCustomer1(customerModel.id)"
        >
          刪除客戶
        </el-button>
      </template>
      <!-- 分隔線 -->
      <hr style="border: none; height: 1.5px; background-color: rgba(128, 128, 128, 0.2)" />
      <el-form :model="customerModel" label-width="100px" :rules="rules">
        <el-form-item label="姓名" prop="customerName">
          <el-input
            v-model="customerModel.customerName"
            style="width: 240px"
            placeholder="請輸入"
          ></el-input>
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          <el-select placeholder="請選擇" v-model="customerModel.gender">
            <el-option label="男" value="M"></el-option>
            <el-option label="女" value="F"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年">
          <el-input
            v-model="customerModel.birthYear"
            style="width: 150px"
            placeholder="請輸入西元年"
          ></el-input>
        </el-form-item>
        <el-form-item label="手機" prop="phoneNumber">
          <el-input
            v-model="customerModel.phoneNumber"
            style="width: 200px"
            placeholder="請輸入"
          ></el-input>
        </el-form-item>
        <el-form-item label="信箱" prop="email">
          <el-input
            v-model="customerModel.email"
            style="width: 420px"
            placeholder="如未輸入,系統預設為 default@gmail.com"
          ></el-input>
        </el-form-item>
        <el-form-item label="交通習慣">
          <el-checkbox-group v-model="customerModel.transportationCategory">
            <el-checkbox label="步行" name="transportationCategory" value="步行" />
            <el-checkbox label="機車" name="transportationCategory" value="機車" />
            <el-checkbox label="汽車" name="transportationCategory" value="汽車" />
            <el-checkbox label="大眾運輸" name="transportationCategory" value="大眾運輸" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="運動頻率(每周次數)">
          <el-input
            v-model="customerModel.frequency"
            placeholder="請輸入常規體能活動頻率(每周)"
            style="width: 250px; padding-left: 5px"
          />
          <el-checkbox-group v-model="customerModel.regularExercises">
            <el-checkbox label="健身" name="regularExercises" value="健身" />
            <el-checkbox label="籃球" name="regularExercises" value="籃球" />
            <el-checkbox label="排球" name="regularExercises" value="排球" />
            <el-checkbox label="慢跑" name="regularExercises" value="慢跑" />
            <el-checkbox label="瑜珈" name="regularExercises" value="瑜珈" />
            <el-checkbox label="羽球" name="regularExercises" value="羽球" />
            <el-checkbox label="棒球" name="regularExercises" value="棒球" />
            <el-checkbox label="游泳" name="regularExercises" value="游泳" />
            <el-checkbox label="飛輪" name="regularExercises" value="飛輪" />
            <el-checkbox label="舞蹈類" name="regularExercises" value="舞蹈類" />
            <el-checkbox label="有氧拳擊" name="regularExercises" value="有氧拳擊" />
            <el-checkbox
              label="其他"
              name="regularExercises"
              value="其他"
              @change="showOtherExercisesInput"
            />
            <el-input
              v-if="otherExercisesInput"
              v-model="customerModel.otherExercises"
              placeholder="請輸入其他運動"
              size="small"
              style="display: inline; padding-left: 5px"
            ></el-input>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="得知管道">
          <div style="margin-right: 15px">
            <el-tag
              v-if="!isEmpty(oldApproaches) && isEmpty(customerModel.otherApproaches)"
              type="success"
              >{{ oldApproaches }}</el-tag
            >
          </div>
          <div>
            <el-checkbox-group v-model="customerModel.approaches">
              <el-checkbox label="親友介紹" name="approach" value="親友介紹" />
              <el-checkbox label="網路社群" name="approach" value="網路社群" />
              <el-checkbox
                label="其他"
                name="approach"
                value="其他"
                @change="showOtherApproachesInput"
              />
              <el-input
                v-if="otherApproachesInput"
                v-model="customerModel.otherApproaches"
                placeholder="請輸入其他得知管道"
                size="small"
                style="display: inline; padding-left: 5px"
              ></el-input>
            </el-checkbox-group>
          </div>
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
            >未指定的預設給Robin</el-button
          >
        </el-form-item>

        <el-form-item label="傷病史">
          <el-checkbox-group v-model="customerModel.medicalHistoryCategory">
            <el-checkbox label="高血壓" name="medicalHistoryCategory" value="高血壓" />
            <el-checkbox label="心血管疾病" name="medicalHistoryCategory" value="心血管疾病" />
            <el-checkbox label="中風" name="medicalHistoryCategory" value="中風" />
            <el-checkbox label="糖尿病" name="medicalHistoryCategory" value="糖尿病" />
            <el-checkbox label="痛風" name="medicalHistoryCategory" value="痛風" />
            <el-checkbox label="氣喘" name="medicalHistoryCategory" value="氣喘" />
            <el-checkbox label="癲癇" name="medicalHistoryCategory" value="癲癇" />
            <el-checkbox label="頭暈" name="medicalHistoryCategory" value="頭暈" />
            <el-checkbox label="癌症" name="medicalHistoryCategory" value="癌症" />
            <el-checkbox label="骨質疏鬆" name="medicalHistoryCategory" value="骨質疏鬆" />
            <el-checkbox label="懷孕" name="medicalHistoryCategory" value="懷孕" />
            <el-checkbox label="脊椎側彎" name="medicalHistoryCategory" value="脊椎側彎" />
            <el-checkbox label="常感壓力" name="medicalHistoryCategory" value="常感壓力" />
            <!-- 扭傷/骨折 -->
            <el-checkbox
              label="扭傷/骨折"
              name="medicalHistoryCategor"
              value="扭傷/骨折"
              @change="showBrokenInput"
            />
            <!-- 重大手術 -->
            <el-checkbox
              label="重大手術"
              name="medicalHistoryCategory"
              value="重大手術"
              @change="showSurgeryInput"
            />
            <!-- 其他 -->
            <el-checkbox
              label="其他"
              name="medicalHistoryCategory"
              value="其他"
              @change="showOtherInput"
            />
            <div>
              <!-- 扭傷/骨折 -->
              <el-input
                v-if="brokenInput"
                v-model="customerModel.medicalHistoryBroken"
                placeholder="請輸入扭傷/骨折部位"
                size="small"
                style="display: inline; padding-left: 5px"
              ></el-input>
              <!-- 重大手術 -->
              <el-input
                v-if="surgeryInput"
                v-model="customerModel.medicalHistorySurgery"
                placeholder="請輸入重大手術情形"
                size="small"
                style="display: inline; padding-left: 5px"
              ></el-input>
              <!-- 其他 -->
              <el-input
                v-if="otherInput"
                v-model="customerModel.medicalHistoryOther"
                placeholder="請輸入其他情形"
                size="small"
                style="display: inline; padding-left: 5px"
              ></el-input>
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
      </el-form>
    </el-drawer>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  background-color: #e2e8f0;
  font-family: 'Noto Sans TC', sans-serif;
}

.header {
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  color: #1e293b;

  // 新增客戶的按鈕
  .el-button {
    background-color: #94a3b8;
    border: #94a3b8;

    &:hover {
      background-color: #64748b;
      border-color: #64748b;
    }
  }
}

// 表單頂部搜尋欄位的按鈕
.el-form {
  .el-button {
    background-color: #94a3b8;
    border: #94a3b8;

    &:hover {
      background-color: #64748b;
      border-color: #64748b;
    }
  }
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

.el-drawer__header {
  background-color: #f3ead9;

  .el-button--primary {
    background-color: rgba(64, 158, 255, 0.3);
    border-color: rgba(64, 158, 255, 0.5);

    &:hover {
      background-color: #334155;
      border-color: #334155;
      color: white;
    }
  }

  /* Specific styles for danger buttons */
  .el-button--danger {
    background-color: rgba(245, 108, 108, 0.3);
    border-color: rgba(245, 108, 108, 0.5);

    &:hover {
      background-color: #b91c1c;
      border-color: #b91c1c;
      color: white;
    }
  }

  /* Button hover effect for all buttons */
  .el-button:hover {
    opacity: 1;
  }
}

// 調整編輯表單組件內的間距
:deep .el-drawer__close-btn {
  margin-left: 30px;
}

:deep .el-drawer__header {
  margin: 0px;
}

:deep .el-drawer__body {
  padding-top: 5px;
}
</style>
