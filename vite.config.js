import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        // 設定代理的匹配規則，這裡指所有以 '/api' 開頭的請求都會被代理
        target: 'http://localhost:8080', // 代理目標地址，即實際請求發送到的服務器地址
        changeOrigin: true, // 是否更改原始域，設為 true 可以避免跨域問題
        rewrite: (path) => path.replace(/^\/api/, '') // 重寫 URL 的函數，將 URL 中的 '/api' 去除
        // 例如，前端發起 /api/user 請求，經過 rewrite 處理後，代理會將請求轉發到 http://localhost:8080/user
      }
    }
  }
})
