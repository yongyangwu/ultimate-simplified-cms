import { mockService } from "@/api";
import menuData from '@/api/menu.json'
import usersData from './users.json'

// 获取菜单数据
export const getMenuApi = () => {
    return menuData
    // return request({
    //     url: "/menu/list",
    //     method: "get"
    // });
};
export const getMenuApiMock = () => {
    return mockService({
        url: "/menu/list",
        method: "get"
    });
};

// 获取用户列表数据（模拟异步请求，延迟1秒）
export const getUserListApi = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(usersData)
        }, 1000)
    })
};
