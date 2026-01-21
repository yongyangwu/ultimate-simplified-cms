import router from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'
import { getMenuApi } from '@/api/modules/system'
// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')
// 菜单项类型定义
interface MenuItem {
    path: string
    name: string
    component?: string
    redirect?: string
    meta: {
        icon?: string
        title: string
        isLink?: string
        isHide: boolean
        isFull: boolean
        isAffix: boolean
        isKeepAlive: boolean
        activeMenu?: string
    }
    children?: MenuItem[]
}
/**
 * @description 扁平化树形菜单数据
 * @param menuList 树形菜单数据
 * @returns 扁平化后的菜单数组
 */
const flattenMenuList = (menuList: MenuItem[]): MenuItem[] => {
    let newMenuList: MenuItem[] = JSON.parse(JSON.stringify(menuList))
    const result = newMenuList.flatMap((item) => [
        item,
        ...(item.children ? flattenMenuList(item.children) : []),
    ])
    return result
}
/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
    try {
        const menuList = await getMenuApi()
        // console.log('动态路由初始化完成，共添加路由:', menuList)
        // // 1. 扁平化树形菜单数据
        const flatMenuList = flattenMenuList(menuList.data as MenuItem[])
        console.log('flatMenuList--', flatMenuList)

        // 2. 遍历扁平化后的菜单数据，动态添加路由
        flatMenuList.forEach((item) => {
            // 创建路由配置对象
            const routeConfig: any = {
                path: item.path,
                name: item.name,
                meta: item.meta,
            }
            // 处理重定向
            if (item.redirect) {
                routeConfig.redirect = item.redirect
            }
            // 处理组件动态导入
            if (item.component && typeof item.component === 'string') {
                const componentPath = '/src/views' + item.component + '.vue'
                const componentLoader = modules[componentPath]
                if (componentLoader) {
                    routeConfig.component = componentLoader
                } else {
                    return // 跳过不存在的组件
                }
            }

            // 根据 isFull 标识决定路由添加方式
            if (item.meta?.isFull) {
                // 全屏页面，直接添加到根路由
                router.addRoute(routeConfig as RouteRecordRaw)
            } else {
                // 普通页面，添加到 layout 路由下
                router.addRoute('layout', routeConfig as RouteRecordRaw)
            }
        })
    } catch (error) {
        console.error('动态路由初始化失败:', error)
        // 可以在这里添加错误处理逻辑，比如跳转到错误页面
    }
}
