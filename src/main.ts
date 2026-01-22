import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/index.scss'
import router from '@/router'
// element icons
import * as Icons from "@element-plus/icons-vue";
import 'element-plus/dist/index.css'
// pinia store
import pinia from '@/store'
const app = createApp(App)
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')
