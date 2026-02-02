import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// 创建
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 屏蔽 pinia store installed 打印
// @ts-ignore
if (import.meta.env.DEV) {
    const originalConsoleLog = console.log
    const originalConsoleGroupCollapsed = console.groupCollapsed

    console.log = (...args) => {
        if (
            args.length > 0 &&
            typeof args[0] === 'string' &&
            args[0].includes('store installed')
        ) {
            return
        }
        originalConsoleLog(...args)
    }

    console.groupCollapsed = (...args) => {
        if (
            args.length > 0 &&
            typeof args[0] === 'string' &&
            args[0].includes('store installed')
        ) {
            return {
                groupEnd: () => { }
            }
        }
        originalConsoleGroupCollapsed(...args)
    }
}


// 导出
export default pinia
