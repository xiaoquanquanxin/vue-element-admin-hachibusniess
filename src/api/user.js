import request from '@/utils/request';

//  登录接口
export function login(data){
    return request({
        url: '/user/login',
        method: 'post',
        data
    });
}

// //  保持token鲜活的
// export function getInfo(token){
//     return request({
//         url: '/user/info',
//         method: 'get',
//         params: { token }
//     });
// }

export function logout(){
    return request({
        url: '/user/logout',
        method: 'post'
    });
}

//  图片验证码
export const verifyCode = `${process.env.VUE_APP_BASE_API}/user/verifyCode?clientKey=`;