import Layout from '@/layout/index.vue'
export const staticRoutes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
            title: 'home',
        },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: 'login',
        },
    },
    {
        path: '/layout',
        name: 'layout',
        redirect: '/home',
        component: Layout, // 容器布局-顶层路由
        // 二级路由-主要渲染页面
        children: [],
    },
    {
        path: '/:pathMatch(.*)*',
        component: () => import('@/views/404/index.vue'),
    },

    /**
     * 提示：写在这里的为全屏界面，不建议写在这里非全屏界面，请写在 layout.children 路由数组中
     *
     */
]
