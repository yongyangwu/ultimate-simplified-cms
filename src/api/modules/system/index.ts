import request, { mockService } from "@/api";
import menuData from '@/api/menu.json'
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