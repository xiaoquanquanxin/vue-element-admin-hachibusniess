import request from '@/utils/request';

//  获取角色权限管理列表
export function getRoleListRoleByPage(query) {
    return request({
        url: '/role/listRoleByPage',
        method: 'get',
        params: query
    });
}

//  查询角色下的权限树
export function getRoleAuthorizedMenu(query) {
    return request({
        url: '/menu/getRoleAuthorizedMenu',
        method: 'get',
        params: query
    });
}

//  权限树右侧按钮接口
export function getRoleAuthorizedPermission(query) {
    //  roleId=1&menuId=10
    return request({
        url: '/permission/getRoleAuthorizedPermission',
        method: 'get',
        params: query,
    });
}
