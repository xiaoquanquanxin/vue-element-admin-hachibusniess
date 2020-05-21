import request from '@/utils/request';

//  去服务端拉去路由权限列表
export function getRoutes() {
    return request({
        url: '/menu/listMenu',
        method: 'get'
    });
}

//  去服务端拉去按钮权限列表
export function getButtons(id) {
    return request({
        url: `/permission/get?menuId=${id}`,
        method: 'get'
    });
}
