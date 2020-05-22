import router from './router';
import store from './store';
import {Message} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {getToken} from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';
import {constantRoutes} from "@/router/constantRoutes";

NProgress.configure({showSpinner: false}); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist
// console.table(router.options.routes);
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);
    // console.log(JSON.parse(JSON.stringify(to)));
    const hasToken = getToken();
    //  如果登录了
    if (hasToken) {
        //  如果登录过了，并且想要去登录页，不让他登录，直接去首页
        if (to.path === '/login') {
            next({path: '/'});
            NProgress.done();
        }
        //  先判断有没有问服务端要过路由
        const routerLinkComplete = store.getters.permission_routes && store.getters.permission_routes.length > constantRoutes.length;
        //  如果没有要过路由
        if (!routerLinkComplete) {
            console.log(`没有拉取过服务端路由 routerLinkComplete ，这除了第一次刷新页面，不应该出现 ： ${routerLinkComplete}`);
            try {
                // const { roles } = await store.dispatch('user/getInfo');
                const accessRoutes = await store.dispatch('permission/generateRoutes');
                router.addRoutes(accessRoutes);
                //  todo    这里好像不需要那个异步验证
                // console.log('异步路由', JSON.parse(JSON.stringify(to)));
                next({...to, replace: true});
            } catch (error) {
                debugger;
                console.error(error);
                // remove token and go to login page to re-login
                await store.dispatch('user/removeToken');
                Message.error(error || 'Has Error');
                next(`/login?redirect=${to.path}`);
            }
            NProgress.done();
            return;
        }
        if (to.meta.id) {
            //  todo    确定用户是否通过getInfo获得了他的权限角色
            const buttonPermissionMap = await store.dispatch('permission/generateButtons', to.meta.id);
            console.log(`当前路由获取的按钮`, buttonPermissionMap);
            //  给当前路由下的按钮设置权限
            to.meta.buttonPermissionMap = buttonPermissionMap;
        }
        console.table(JSON.parse(JSON.stringify(store.getters.permission_routes)));
        console.log('普通next的meta信息', JSON.parse(JSON.stringify(to.meta)));
        next();
    } else {
        //  是不需要登录权限的白名单
        if (whiteList.indexOf(to.path) !== -1) {
            console.log('是不需要登录权限的白名单');
            // in the free login whitelist, go directly
            next();
        } else {
            //  没有访问权限的其他页面被重定向到登录页面。
            console.log('没有访问权限的其他页面被重定向到登录页面');
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});


router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
