import request, { mockService } from "@/api";
// 获取菜单数据
export const getMenuApi = () => {
    return request({
        url: "/menu/list",
        method: "get"
    });
};
export const getMenuApiMock = () => {
    return mockService({
        url: "/menu/list",
        method: "get"
    });
};