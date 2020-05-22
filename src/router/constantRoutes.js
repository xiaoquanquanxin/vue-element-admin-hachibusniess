/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为真，项目将不会显示在侧边栏(默认为假)
 * alwaysShow: true               如果设置为真，将始终显示根菜单
 *                                如果不设置alwaysShow，当item有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect将不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>(必须设置!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

import Layout from "@/layout/index";

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path(.*)',
                component: () => import('@/views/redirect/index')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/401',
        component: () => import('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/merchantSettings',
        // redirect: '/dashboard',
        // children: [
        //     {
        //         path: 'dashboard',
        //         component: () => import('@/views/dashboard/index'),
        //         name: 'Dashboard',
        //         meta: {title: 'Dashboard', icon: 'dashboard', affix: true}
        //     }
        // ]
    },
];

//  通配符的路由
export const wildcardCharacterRoute = {path: '*', redirect: '/404', hidden: true};
