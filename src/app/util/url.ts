const host = '/api';

export const Urls = {
    startupApp: host + '/info', // 启动应用获取应用信息、用户信息接口

    login: host + '/authenticate', // 用户登录接口

    menuTreeList: host + '/menuTreeList', // 获取菜单列表树形数据接口
    menuTree: host + '/menuTree', // 获取菜单树结构接口
    menuSearch: host + '/menuSearch', // 搜索菜单接口
    menus: host + '/menus', // 菜单操作接口(增加、修改、删除)

    orgList: host + '/orgList', // 获取组织机构列表接口
    orgTree: host + '/orgTree', // 获取组织机构树结构接口
    orgDict: host + '/dictOrg', // 获取组织机构类型字典接口
    orgSearch: host + '/orgSearch', // 搜索组织机构接口
    orgs: host + '/orgs', // 组织机构操作接口(增加、修改、删除)

    dictList: host + '/dictList', // 获取字典列表接口
    dictSearch: host + '/dictSearch', // 搜索字典接口
    dicts: host + '/dicts', // 字典操作接口(增加、修改、删除)

    dictTypes: host + '/dict-types', // 字典类型操作接口(增加、修改、删除)

    aclMenuTree: host + '/aclMenuTree', // 获取权限树结构接口
    buttons: host + '/buttons', // 权限按钮操作接口(增加、修改、删除)

};
