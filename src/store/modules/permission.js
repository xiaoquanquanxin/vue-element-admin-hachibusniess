import {asyncRoutes, constantRoutes} from '@/router';
import {getRoutes} from '@/api/role';

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role));
    } else {
        return true;
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = [];
    routes.forEach(route => {
        const tmp = {...route};
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles);
            }
            res.push(tmp);
        }
    });
    return res;
}

const state = {
    routes: [],
    addRoutes: []
};

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes;
        // state.routes = constantRoutes.concat(routes);
        state.routes = [].concat(routes);
        console.table(JSON.parse(JSON.stringify(state.routes)));
        console.table(JSON.parse(JSON.stringify(constantRoutes)));
    }
};

const actions = {
    // generateRoutes({ commit }, roles) {
    //     return new Promise(resolve => {
    //         let accessedRoutes;
    //         if (roles.includes('admin')) {
    //             accessedRoutes = asyncRoutes || [];
    //         } else {
    //             accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
    //         }
    //         commit('SET_ROUTES', accessedRoutes);
    //         resolve(accessedRoutes);
    //     });
    // }
    //  生成路由权限，从服务端动态拉取
    generateRoutes({commit}) {
        return getRoutes()
            .then(accessedRoutes => {
                commit('SET_ROUTES', accessedRoutes.data);
                return accessedRoutes.data;
            });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
