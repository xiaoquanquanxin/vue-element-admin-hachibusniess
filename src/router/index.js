/**
 * 路由主要
 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import {constantRoutes} from "@/router/constantRoutes";
const createRouter = (routesList) => new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: routesList.concat(constantRoutes)
});
const router = createRouter([]);
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter(routesList) {
    if (router.options.routes.length > constantRoutes.length) {
        return;
    }
    const newRouter = createRouter(routesList);
    router.matcher = newRouter.matcher;
}
export default router;
