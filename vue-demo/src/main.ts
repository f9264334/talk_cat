import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// 2. 引入 Element Plus 样式
import 'element-plus/dist/index.css'
// 3. 引入中文语言包（可选，默认英文）
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})
app.config.errorHandler = (err, vm, info) => {
  console.error('Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
}
app.mount('#app')
