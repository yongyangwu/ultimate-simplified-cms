import request, { mockService } from '@/api'
import menuData from '@/api/menu.json'
import usersData from './users.json'
import rolesData from './roles.json'


// 获取菜单数据
export const getMenuApi = () => {
    // return new Promise((resolve) => {
    //     setTimeout(() => {
    //         resolve(menuData)
    //     }, 500)
    // })
    return request({
        url: "/menu/list",
        method: "get"
    });
}
// 新增菜单
export const addMenuApi = (data: any) => {
    return request({
        url: "/menu/add",
        method: "post",
        data
    });
}
export const getRolesApi = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(rolesData)
        }, 500)
    })
}
export const getMenuApiMock = () => {
    return mockService({
        url: '/menu/list',
        method: 'get',
    })
}

// 获取用户列表数据（模拟异步请求，延迟1秒）
export const getUserListApi = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(usersData)
        }, 1000)
    })
}

// 保存菜单数据（模拟）
export const saveMenuApi = (data: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('保存菜单数据:', data)
            resolve({
                code: 200,
                message: '保存成功',
                data: null
            })
        }, 1000)
    })
}
