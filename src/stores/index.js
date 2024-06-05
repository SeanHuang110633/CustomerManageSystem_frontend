//統一管理Pinia,把main.js中有關pinia的東西都抽離到這裡
//統一導出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)

export default pinia

// import { useUserStore } from './modules/user'
// export { useUserStore }
// import { useCount } from './modules/count'
// export { useCount }

//可以直接取代上面的導入+導出
export * from './modules/token'
export * from './modules/userInfo'
