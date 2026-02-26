import router from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { useAuthStore } from '@/store/modules/auth'
import { ElNotification } from 'element-plus'
// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob('@/views/**/*.vue')
/**
 * @description 初始化动态路由
 */
export const initDynamicRouter = async () => {
    const userStore = useUserStore()
    const authStore = useAuthStore()
    try {
        // 1.获取菜单列表 && 按钮权限列表
        await authStore.getAuthFlatMenuList()
        // alert(22)
        // await authStore.getAuthButtonList();
        // 判断当前用户有没有菜单权限
        if (!authStore.authFlatMenuList.length) {
            ElNotification({
                title: '无权限访问',
                message: '当前账号无任何菜单权限，请联系系统管理员！',
                type: 'warning',
                duration: 3000,
            })
            userStore.setToken('')
            router.replace('/')
            return Promise.reject('No permission')
        }
        // 添加动态路由
        authStore.authFlatMenuList.forEach((item) => {
            //剔除按钮类型的菜单
            if (item.menuType === 3) {
                return
            }
            item.meta = {
                icon: item.icon,
                title: item.menuNameZh || item.title || '',
                isKeepAlive: item.isKeepAlive,
                isAffix: item.isAffix,
                isHide: item.isHide,
                isFull: item.isFull,
            }
            if (item.component && typeof item.component == 'string') {
                item.component = modules['/src/views' + item.component + '.vue']
            }
            if (item.meta.isFull) {
                router.addRoute(item as unknown as RouteRecordRaw)
            } else {
                router.addRoute('layout', item as unknown as RouteRecordRaw)
            }
        })
    } catch (error) {
        console.error('动态路由初始化失败:', error)
        // 可以在这里添加错误处理逻辑，比如跳转到错误页面
    }
}
