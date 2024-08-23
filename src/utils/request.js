import axios from 'axios'
import { useTokenStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = '/api'

const instance = axios.create({
  //設定1.baseURL 2.超時時間
  baseURL,
  timeout: 10000
})
// 設置請求攔截器
instance.interceptors.request.use(
  (config) => {
    console.log('----送發請求的API: ', config)

    const tokenStore = useTokenStore()

    if (tokenStore.token) {
      // 如果 token 存在，則將其添加到請求頭中
      config.headers.Authorization = tokenStore.token
    }
    return config
  },
  (err) => {
    console.log('----請求失敗: ', err)
    return Promise.reject(err)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  (result) => {
    console.log('----接收請求: ', result.data)

    //判斷返回狀態碼
    if (result.data.code === 20010) {
      return result.data
    }

    //操作失敗
    ElMessage.error(result.data.message ? result.data.message : '登入失敗')

    return Promise.reject(result.data)
  },
  (err) => {
    if (err.response.status === 401) {
      ElMessage.error('請先登入')
      router.push('/login')
    } else {
      console.log('----響應有問題: ', err)
      ElMessage.error(err.response.data.message)
    }

    return Promise.reject(err)
  }
)

export default instance
