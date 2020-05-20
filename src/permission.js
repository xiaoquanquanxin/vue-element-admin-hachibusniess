import router, {constantRoutes, resetRouter} from './router';
import store from './store';
import {Message} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {getToken} from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({showSpinner: false}); // NProgress Configuration

const whiteList = ['/login', '/auth-redirect']; // no redirect whitelist
console.table(router.options.routes);
router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start();

    // set page title
    document.title = getPageTitle(to.meta.title);

    const hasToken = getToken();
    if (hasToken) {
        //  如果登录过了，就直接到首页
        if (to.path === '/login') {
            next({path: '/'});
            NProgress.done();
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            // const hasRoles = store.getters.roles && store.getters.roles.length > 0;
            // const hasRoles = store.getters.roles && store.getters.roles.length > 0;
            const routerLinkComplete = store.getters.permission_routes && store.getters.permission_routes.length > constantRoutes.length;
            console.log(`routerLinkComplete 是否拉取过服务端路由了`);
            if (routerLinkComplete) {
                next();
            } else {
                try {
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    //  fixme   这里强制修改了
                    // const { roles } = await store.dispatch('user/getInfo');

                    // generate accessible routes map based on roles
                    const accessRoutes = await store.dispatch('permission/generateRoutes');
                    console.log(accessRoutes);
                    // return;
                    // dynamically add accessible routes
                    router.addRoutes(accessRoutes);
                    // console.log(router.asyncRoutes);
                    // resetRouter(accessRoutes);
                    next({...to, replace: true});
                } catch (error) {
                    debugger;
                    console.error(error);
                    // remove token and go to login page to re-login
                    // await store.dispatch('user/resetToken');
                    Message.error(error || 'Has Error');
                    next(`/login?redirect=${to.path}`);
                    NProgress.done();
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next();
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach(() => {
    // finish progress bar
    NProgress.done();
});
