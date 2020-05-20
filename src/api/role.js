import request from '@/utils/request';

//  去服务端拉去路由列表
export function getRoutes() {
    return request({
        url: '/menu/listMenu',
        method: 'get'
    });
}
