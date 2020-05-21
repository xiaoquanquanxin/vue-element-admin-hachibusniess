import {convertRouting} from "@/router/asyncRoutesMap";
import {constantRoutes,wildcardCharacterRoute} from "@/router/constantRoutes";

const state = {
    routes: [],
    addRoutes: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        state.routes = constantRoutes.concat(routes);
        return state.routes;
    }
};

const actions = {
    //  生成路由权限，从服务端动态拉取
    generateRoutes({commit}) {
        //  todo    test
        const str = '{"data":[{"icon":"icon","routerId":"77bab4355c1a43cf8b064868071022a0","id":"9","parentId":"0","name":"商家设置","haveChildren":false},{"icon":"icon","routerId":"05f15a29b74648479e99160676a5cbe4","id":"8","parentId":"0","name":"财务结算","haveChildren":false},{"icon":"icon","routerId":"7e09717be5e647fab92bcc70e15c3ced","id":"7","parentId":"0","name":"优惠/验券","haveChildren":false},{"icon":"icon","routerId":"c29a2b1a79914122b98e810d026e17f2","id":"6","parentId":"0","name":"订单管理","haveChildren":false},{"icon":"icon","routerId":"ce3405acd6f447ed995a3e53171c9ab0","id":"5","parentId":"0","name":"场地预约","haveChildren":false},{"icon":"icon","routerId":"3f5c553a09d44b6a8a07622be472fe41","id":"4","parentId":"0","name":"课程/培训","haveChildren":false},{"icon":"icon","routerId":"a1560d26d13b4af0a51329b8480599f3","id":"3","parentId":"0","name":"服务管理","haveChildren":false},{"icon":"icon","routerId":"831782ef588d4e438fc3b30d4b24c2d5","id":"2","parentId":"0","name":"商品管理","haveChildren":true,"children":[{"url":"/goodsInfo/listGoodsByPage","icon":"icon","routerId":"d84ee213f91540298100547d57f72786","id":"10","parentId":"2","name":"商品管理","haveChildren":false}]}]}';
        return new Promise(resolve => {
            resolve(JSON.parse(str));
        })
        // return getRoutes()
            .then(accessedRoutes => {
                //  todo    处理服务端路由，转为前端路由
                const routesList = convertRouting(accessedRoutes.data);
                routesList.push(wildcardCharacterRoute);
                commit('SET_ROUTES', routesList);
                return routesList;
            });
    },

    //  生成按钮权限
    generateButtons({commit}, id) {
        const str = '{"successful":true,"code":1000,"msg":"获取成功","data":[{"id":"879","name":"goodsInfo.down","menuBasePerms":"goodsInfo","url":"/goodsInfo/goodsDown","remark":"下架","sort":0,"offset":0,"max":0},{"id":"880","name":"goodsInfo.up","menuBasePerms":"goodsInfo","url":"/goodsInfo/goodsUp","remark":"上架","sort":0,"offset":0,"max":0}]}';
        return new Promise(resolve => {
            resolve(JSON.parse(str));
        })
        // return getButtons(id)
            .then(response => {
                // console.log(response.data);
                return response.data;
            });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
