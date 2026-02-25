const mode = import.meta.env.VITE_ROUTER_MODE
/**
 * @description 使用递归扁平化菜单，方便添加动态路由
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 */
export function getFlatMenuList(
    menuList: Menu.MenuOptions[]
): Menu.MenuOptions[] {
    let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.flatMap((item) => [
        item,
        ...(item.children ? getFlatMenuList(item.children) : []),
    ])
}

/**
 * @description 使用递归过滤出需要渲染在左侧菜单的列表 (需剔除 isHide == true 的菜单)
 * @param {Array} menuList 菜单列表
 * @returns {Array}
 * */
export function getShowMenuList(menuList: Menu.MenuOptions[]) {
    let newMenuList: Menu.MenuOptions[] = JSON.parse(JSON.stringify(menuList))
    return newMenuList.filter((item) => {
        item.children?.length && (item.children = getShowMenuList(item.children))
        return !item.meta?.isHide
    })
}
export function transferFlatMenuListToMenuTree(menuList: any) {
    // const menuList = [
    //     {
    //         "id": 3,
    //         "menuType": 2,
    //         "parentId": 1,
    //         "parentName": "系统管理",
    //         "menuNameZh": "账号管理",
    //         "menuNameEn": "账号管理",
    //         "component": "/system/accountManage/index",
    //         "path": "/system/accountManage",
    //         "isHide": false,
    //         "isFull": false,
    //         "isKeepAlive": false
    //     },
    //     {
    //         "id": 4,
    //         "menuType": 2,
    //         "parentId": 1,
    //         "parentName": "系统管理",
    //         "menuNameZh": "角色管理",
    //         "menuNameEn": "角色管理",
    //         "component": "/system/roleManage/index",
    //         "path": "/system/roleManage",
    //         "isHide": false,
    //         "isFull": false,
    //         "isKeepAlive": false
    //     },
    //     {
    //         "id": 5,
    //         "menuType": 2,
    //         "parentId": 1,
    //         "parentName": "系统管理",
    //         "menuNameZh": "菜单管理",
    //         "menuNameEn": "菜单管理",
    //         "component": "/system/menuManage/index",
    //         "path": "/system/roleManage",
    //         "isHide": false,
    //         "isFull": false,
    //         "isKeepAlive": false
    //     },
    //     {
    //         "id": 6,
    //         "menuType": 2,
    //         "parentId": 1,
    //         "parentName": "系统管理",
    //         "menuNameZh": "字典管理",
    //         "menuNameEn": "字典管理",
    //         "component": "/system/dictManage/index",
    //         "path": "/system/dictManage",
    //         "isHide": false,
    //         "isFull": false,
    //         "isKeepAlive": false
    //     },
    //     {
    //         "id": 2,
    //         "menuType": 1,
    //         "parentId": 0,
    //         "parentName": "",
    //         "menuNameZh": "系统管理",
    //         "menuNameEn": "系统管理",
    //         "component": "/system/accountManage/index",
    //         "path": "/system",
    //         "isHide": false,
    //         "isFull": false,
    //         "isKeepAlive": false
    //     },
    //     {
    //         "id": 1,
    //         "menuType": 1,
    //         "parentId": 0,
    //         "parentName": "",
    //         "menuNameZh": "主页",
    //         "menuNameEn": "主页",
    //         "component": "/home/index",
    //         "path": "/home",
    //         "isHide": true,
    //         "isFull": true,
    //         "isKeepAlive": false
    //     }
    // ]
    const menuTree: any[] = handleMenuTree(menuList)
    return menuTree
}
export const getAllBreadcrumbList = (
    menuList: Menu.MenuOptions[],
    parent = [],
    result: { [key: string]: any } = {}
) => {
    for (const item of menuList) {
        result[item.path] = [...parent, item]
        if (item.children)
            getAllBreadcrumbList(item.children, result[item.path], result)
    }
    return result
}
/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
    const url: { [key: string]: string } = {
        hash: location.hash.substring(1),
        history: location.pathname + location.search,
    }
    return url[mode]
}

/**
 * @description 使用递归处理菜单，将一维数组转换为树状结构
 * @param {Array} menuList 菜单列表
 * @param {String|Number} parentId 父级ID
 * @returns {Array}
 */
export function handleMenuTree(menuList: any[], parentId: string | number = 0): any[] {
    // console.log(8888999, menuList)
    // 第一次调用时，深拷贝原始数据，避免直接操作 Proxy 且防止修改原数据
    const list = JSON.parse(JSON.stringify(menuList))
    const buildTree = (data: any[], pid: string | number) => {
        const tree: any[] = []
        for (const item of data) {
            if (String(item.parentId) === String(pid)) {
                // 将指定的字段提取到 meta 对象中
                const metaFields = ['icon', 'isKeepAlive', 'isAffix', 'isHide', 'isFull']
                item.meta = item.meta || {}

                // 处理标题，优先使用 menuNameZh
                item.meta.title = item.menuNameZh || item.title || ''

                metaFields.forEach(field => {
                    if (Object.prototype.hasOwnProperty.call(item, field)) {
                        item.meta[field] = item[field]
                        delete item[field] // 从顶层删除
                    }
                })

                const children = buildTree(data, item.id)
                if (children.length > 0) {
                    item.children = children
                }
                tree.push(item)
            }
        }
        return tree
    }
    return buildTree(list, parentId)
}
