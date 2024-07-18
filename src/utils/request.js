import axios from 'axios'
import { useTokenStore } from '@/stores'
import { ElMessage, ElLoading } from 'element-plus'
import router from '@/router'
import { nextTick } from 'vue'

const baseURL = '/api'

const instance = axios.create({
  //設定1.baseURL 2.超時時間
  baseURL,
  timeout: 10000
})
let loadingInstance = null
// 設置請求攔截器
instance.interceptors.request.use(
  (config) => {
    loadingInstance = ElLoading.service({ fullscreen: true })
    // 使用 tokenStore 獲取 token
    const tokenStore = useTokenStore()

    if (tokenStore.token) {
      // 如果 token 存在，則將其添加到請求頭中
      config.headers.Authorization = tokenStore.token
    }
    return config
  },
  (err) => {
    if (loadingInstance) {
      nextTick(() => {
        loadingInstance.close()
      })
    }
    // 在請求錯誤時返回一個 rejected promise
    return Promise.reject(err)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  (result) => {
    if (loadingInstance) {
      nextTick(() => {
        loadingInstance.close()
      })
    }

    //判斷返回狀態碼
    if (result.data.code === 20010) {
      return result.data
    }

    //操作失敗
    ElMessage.error(result.data.message ? result.data.message : '登入失敗')

    return Promise.reject(result.data)
  },
  (err) => {
    console.log('http code 不是 200 ')

    if (loadingInstance) {
      nextTick(() => {
        loadingInstance.close()
      })
    }

    if (err.response.status === 401) {
      ElMessage.error('請先登入')
      router.push('/login')
    } else {
      ElMessage.error(err.response.data.message)
    }

    return Promise.reject(err)
  }
)

export default instance
