import request from '@/utils/request';

//  获取角色权限管理列表
export function getRoleListRoleByPage(query) {
    return request({
        url: '/role/listRoleByPage',
        method: 'get',
        params: query
    });
}

//  查询角色下勾选的的权限树
export function getRoleAuthorizedMenu(query) {
    return request({
        url: '/menu/getRoleAuthorizedMenu',
        method: 'get',
        params: query
    });
}

//  权限树右侧的全部复选框
export function getRoleAuthorizedPermission() {
    return request({
        url: '/permission/getRoleAuthorizedPermission',
        method: 'get',
    });
}

//  权限树右侧的被选中的复选框
export function getRoleCheckedPermission(query) {
    //  roleId=1&menuId=10
    return request({
        url: '/permission/getRoleAuthorizedPermission',
        method: 'get',
        params: query
    });
}

//  提交角色权限
export function setRoleAuthorized( data) {
    return request({
        url: '/role/roleAuthorized',
        method: 'post',
        data
    });
}
