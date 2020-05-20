import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export function getToken(){
    return Cookies.get(TokenKey);
}

export function setToken(token){
    console.log('设置token：', TokenKey, token);
    return Cookies.set(TokenKey, token);
}

export function removeToken(){
    // console.log(removeToken);
    // return;
    return Cookies.remove(TokenKey);
}
