import { defineStore } from 'pinia'
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from '@/utils'
import { getMenuApi } from '@/api/modules/system'
export const useAuthStore = defineStore('ultimate-auth', {
    state: () => ({
        // 按钮权限列表
        authButtonList: {},
        // 菜单权限列表
        authMenuList: [] as any[], // 这里暂时用 any[]，或者您可以定义一个 Menu.MenuOptions 接口
        // 当前页面的 router name，用来做按钮权限筛选
        routeName: '',
    }),
    getters: {
        // 按钮权限列表
        authButtonListGet: (state) => state.authButtonList,
        // 菜单权限列表 ==> 这里的菜单没有经过任何处理
        authMenuListGet: (state) => state.authMenuList,
        // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
        showMenuListGet: (state) => getShowMenuList(state.authMenuList),
        // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
        flatMenuListGet: (state) => getFlatMenuList(state.authMenuList),
        // 递归处理后的所有面包屑导航列表
        breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList),
    },
    actions: {
        // Get AuthButtonList
        async getAuthButtonList() {
            const { data } = await getMenuApi()
            this.authButtonList = data
        },
        // Get AuthMenuList
        async getAuthMenuList() {
            const result = await getMenuApi()
            // console.log('data---', result)
            this.authMenuList = result.data
        },
        // Set RouteName
        async setRouteName(name: string) {
            this.routeName = name
        },
    },
})
