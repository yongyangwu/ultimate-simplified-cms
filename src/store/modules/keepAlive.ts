import { defineStore } from 'pinia'
import piniaPersistConfig from '@/store/config/index'
import { type KeepAliveState } from './interface'
export const useKeepAliveStore = defineStore('ultimate-keepalive', {
    state: (): KeepAliveState => ({
        keepAliveName: [],
    }),
    getters: {},
    actions: {
        // Add KeepAliveName
        async addKeepAliveName(name: string) {
            !this.keepAliveName.includes(name) && this.keepAliveName.push(name)
        },
        // Remove KeepAliveName
        async removeKeepAliveName(name: string) {
            this.keepAliveName = this.keepAliveName.filter((item) => item !== name)
        },
        // Set KeepAliveName
        async setKeepAliveName(keepAliveName: string[] = []) {
            this.keepAliveName = keepAliveName
        },
    },
    persist: piniaPersistConfig('ultimate-keepalive'),
})
