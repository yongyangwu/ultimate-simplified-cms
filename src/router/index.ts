import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from '@/router/modules/staticRoutes'
import { initDynamicRouter } from '@/router/modules/dynamicRoutes'
/**
 * @description 📚 路由参数配置简介
 * @param path ==> 路由菜单访问路径
 * @param name ==> 路由 name (对应页面组件 name, 可用作 KeepAlive 缓存标识 && 按钮权限筛选)
 * @param redirect ==> 路由重定向地址
 * @param component ==> 视图文件路径
 * @param meta ==> 路由菜单元信息
 * @param meta.icon ==> 菜单和面包屑对应的图标
 * @param meta.title ==> 路由标题 (用作 document.title || 菜单的名称)
 * @param meta.activeMenu ==> 当前路由为详情页时，需要高亮的菜单
 * @param meta.isLink ==> 路由外链时填写的访问地址
 * @param meta.isHide ==> 是否在菜单中隐藏 (通常列表详情页需要隐藏)
 * @param meta.isFull ==> 菜单是否全屏 (示例：数据大屏页面)
 * @param meta.isAffix ==> 菜单是否固定在标签页中 (首页通常是固定项)
 * @param meta.isKeepAlive ==> 当前路由是否缓存
 * */
const router = createRouter({
    history: createWebHashHistory(),
    routes: [...staticRoutes],
    strict: false,
    scrollBehavior: () => ({ left: 0, top: 0 }),
})
import { useGlobalStore } from '@/store/modules/global'

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, _from, next) => {
    // const globalStore = useGlobalStore()
    // console.log('globalStore', globalStore.isRoutesLoaded)

    // 1. Check if routes are already added to avoid infinite loop
    // if (!globalStore.isRoutesLoaded) {
    // await initDynamicRouter()
    // globalStore.setRoutesLoaded(true) // Mark routes as loaded
    return next({ ...to, replace: true }) // Re-trigger navigation with new routes
})
router.onError((error) => {
    //   NProgress.done();
    console.warn('路由错误', error.message)
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
    //   NProgress.done();
})

export default router
