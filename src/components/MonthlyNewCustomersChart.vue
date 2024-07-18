<template>
  <div>
    <!-- 下拉選單容器 -->
    <label for="year-select">請選擇年分：</label>
    <el-select
      v-model="selectedYear"
      id="year-select"
      placeholder="選擇年份"
      @change="updateChartData"
      class="small-select"
    >
      <el-option v-for="year in years" :key="year" :label="year" :value="year"></el-option>
    </el-select>

    <!-- 圖表容器 -->
    <div class="chart-container" v-loading="loading">
      <!-- 使用 vue-chartjs 的 Bar 組件來渲染柱狀圖 -->
      <Bar v-if="!loading" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import { customerListFirstLessosnService } from '@/api/customer.js'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { ElSelect, ElOption } from 'element-plus'

// 註冊 Element Plus 組件

// -------------- 處理客戶數據 ---------------
const customerData = ref({}) // 儲存客戶數據
const monthlyDataCount = ref(Array(12).fill(0)) // 儲存當前年份的每月新增客戶數據
const years = ref([]) // 儲存所有年份
const selectedYear = ref(null) // 儲存選中的年份
const loading = ref(true) // 加載狀態

/**
 * 從 API 獲取客戶數據
 * @async
 */
const fetchCustomerData = async () => {
  try {
    const response = await customerListFirstLessosnService()
    const data = response.data

    console.log('API 返回的數據:', data)

    if (data && typeof data === 'object') {
      customerData.value = data
      years.value = Object.keys(data).sort((a, b) => b - a)

      if (years.value.length > 0) {
        selectedYear.value = years.value[0]
        updateChartData()
      }
    } else {
      console.error('No customer data found or data is not an object')
    }
  } catch (error) {
    console.error('Error fetching customer data:', error)
  } finally {
    loading.value = false
  }
}

/**
 * 更新圖表數據根據選中的年份
 */
const updateChartData = () => {
  if (selectedYear.value && customerData.value[selectedYear.value]) {
    monthlyDataCount.value = customerData.value[selectedYear.value]
  } else {
    monthlyDataCount.value = Array(12).fill(0)
  }
}

/**
 * 初始化數據
 */
onMounted(() => {
  fetchCustomerData()
})

// -------------- 渲染圖表數據 --------------
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

/**
 * 圖表數據配置
 * @returns {Object} 包含圖表的標籤和數據
 */
const chartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: '新增客戶數',
      backgroundColor: '#f87979',
      data: monthlyDataCount.value
    }
  ]
}))

/**
 * 計算 Y 軸的最大值
 * @returns {number} Y 軸的最大值
 */
const calculateYAxisMax = computed(() => {
  const maxValue = Math.max(...monthlyDataCount.value)
  return Math.ceil(maxValue / 5) * 5 // 將最大值向上取整到最接近的 5 的倍數
})

/**
 * 圖表選項配置
 * @returns {Object} 圖表的配置選項
 */
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: calculateYAxisMax.value,
      ticks: {
        stepSize: 1 // 確保刻度是整數
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: '當月新增客戶統計表'
    }
  }
}))
</script>

<style scoped>
.chart-container {
  height: 400px;
  margin-top: 20px;
}

.small-select {
  height: 40px;
  width: 80px;
  margin-left: 10px;
}
</style>
