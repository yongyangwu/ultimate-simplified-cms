import { defineStore } from 'pinia'
import piniaPersistConfig from '@/store/config/index'
export const useGlobalStore = defineStore('ultimate-global', {
    state: () => ({
        // 布局模式 (纵向：vertical | 经典：classic | 横向：transverse | 分栏：columns)
        layout: 'vertical',
        // element 组件大小
        assemblySize: 'default',
        // 当前系统语言
        language: null,
        // 折叠菜单
        isCollapse: false,
    }),
    getters: {},
    actions: {},
    persist: piniaPersistConfig('ultimate-global'),
})
