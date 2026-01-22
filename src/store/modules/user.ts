import { defineStore } from 'pinia'
import piniaPersistConfig from '@/store/config/index'
export const useUserStore = defineStore('ultimate-user', {
    state: () => ({
        token: "",
        userInfo: { name: "Ultimate" }
    }),
    getters: {
        // Set Token
        setToken(token: string) {
            this.token = token;
        },
        // Set setUserInfo
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo;
        }
    },
    actions: {

    },
    persist: piniaPersistConfig("ultimate-user")
})
