import request from "@/api";
// 获取菜单数据
export const getMenuApi = () => {
    return request({
        url: "/menu/list",
        method: "get"
    });
};