<script setup>
import { ref } from 'vue'
import MonthlyNewCustomersChart from '@/components/MonthlyNewCustomersChart.vue'
import CustomerGenderPieChart from '@/components/CustomerGenderPieChart.vue'
import CustomerSourcePieChart from '@/components/CustomerSourcePieChart.vue'

const activeChart = ref('newCustomers')

const switchChart = (chart) => {
  activeChart.value = chart
}
</script>

<template>
  <el-card class="page-container">
    <!-- header -->
    <template #header>
      <div class="header">
        <span>客戶資訊統計</span>
        <div class="chart-buttons">
          <el-button
            @click="switchChart('newCustomers')"
            :type="activeChart === 'newCustomers' ? 'primary' : ''"
          >
            每月新增客戶
          </el-button>
          <el-button
            @click="switchChart('customerGender')"
            :type="activeChart === 'customerGender' ? 'primary' : ''"
          >
            客戶性別比例
          </el-button>
          <el-button
            @click="switchChart('customerSource')"
            :type="activeChart === 'customerSource' ? 'primary' : ''"
          >
            客戶來源分布
          </el-button>
        </div>
      </div>
    </template>
    <MonthlyNewCustomersChart v-if="activeChart === 'newCustomers'" />
    <CustomerGenderPieChart v-if="activeChart === 'customerGender'" />
    <CustomerSourcePieChart v-if="activeChart === 'customerSource'" />
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
}

.header {
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.chart-buttons {
  display: flex;
  gap: 10px;
}
</style>
