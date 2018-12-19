const host = '/api';

export const Urls = {
    startupApp: host + '/info', // 启动应用获取应用信息、用户信息接口

    login: host + '/authenticate', // 用户登录接口

    menuTreeList: host + '/menuTreeList', // 获取菜单列表树形数据接口
    menuTree: host + '/menuTree', // 获取菜单树结构接口
    menuSearch: host + '/menuSearch', // 搜索菜单接口
    menus: host + '/menus', // 菜单操作接口(增加、修改、删除)
};
