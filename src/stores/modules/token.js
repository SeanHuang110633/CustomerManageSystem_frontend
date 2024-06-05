//定義store
import { defineStore } from 'pinia'
import { ref } from 'vue'

/*
參數1:名字，唯一值
參數2:函數，內部定義狀態的所有內容
返回值:函數
*/
export const useTokenStore = defineStore(
  'token',
  () => {
    //定義響應式數據
    const token = ref('')
    const tokenSetTime = ref(null)

    //修改token值的函數
    const setToken = (newToken) => {
      token.value = newToken
      tokenSetTime.value = new Date().getTime()
      localStorage.setItem('tokenSetTime', tokenSetTime.value)
    }

    //移除token值的函數
    const removeToken = () => {
      token.value = ''
      localStorage.removeItem('tokenSetTime')
    }

    // 初始化token，檢查是否過期
    const init = () => {
      tokenSetTime.value = localStorage.getItem('tokenSetTime')
      if (!token.value) {
        return false
      } else if (new Date().getTime() - tokenSetTime.value > 12 * 60 * 60 * 1000) {
        console.log('current time:' + new Date().getTime())
        console.log('set time:' + tokenSetTime.value)
        console.log('gap: ' + new Date().getTime() - tokenSetTime.value)
        return false
      }
      return true
    }
    return {
      token,
      setToken,
      removeToken,
      init
    }
  },
  { persist: true }
)
