<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { Chart, ArcElement, Tooltip, Legend, PieController } from 'chart.js'
import { customerListGenderService } from '@/api/customer.js'

// 註冊必要的 Chart.js 組件

Chart.register(ArcElement, Tooltip, Legend, PieController)

// 響應式引用
const chartRef = ref(null)
const genderList = ref([])
let chart = null

/**
 * 獲取客戶列表數據
 */
const customerList = async () => {
  try {
    const result = await customerListGenderService()
    if (result.data) {
      genderList.value = result.data
    } else {
      console.error('No customer data found')
    }
  } catch (error) {
    console.error('Error fetching customer data:', error)
  }
}

// 計算屬性: 圖表數據
const data = computed(() => ({
  labels: ['女', '男'],
  datasets: [
    {
      data: genderList.value,
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)']
    }
  ]
}))

// 圖表配置選項
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: '客戶性別分布統計圖'
    }
  }
}

onMounted(() => {
  // 使用 watchEffect 來創建和更新圖表
  watchEffect(() => {
    if (chartRef.value) {
      // 如果已存在圖表實例,先銷毀它
      if (chart) {
        chart.destroy()
      }
      // 創建新的圖表實例
      chart = new Chart(chartRef.value, {
        type: 'pie',
        data: data.value,
        options: options
      })
    }
  })
})

// 在設置完所有響應式邏輯後,開始獲取客戶數據
customerList()
</script>

<template>
  <div style="width: 80vw; height: 75vh">
    <canvas ref="chartRef"></canvas>
  </div>
</template>
