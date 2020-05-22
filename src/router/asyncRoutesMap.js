import Layout from "@/layout/index";

//  用于映射服务端路由
const asyncRoutesMap = {
    //  商品管理一级路由
    "831782ef588d4e438fc3b30d4b24c2d5": {
        path: "/commodityBasic",
        component: Layout,
        redirect: "/commodityBasic/commodityManagement",
        alwaysShow: true,
    },
    //  商品管理二级路由
    "d84ee213f91540298100547d57f72786": {
        path: "commodityManagement",
        hasHistoryName: true,
        component: () => import("@/views/commodity/management.vue"),
    },
    //  商家设置一级路由
    "77bab4355c1a43cf8b064868071022a0": {
        path: "/merchantSettings",
        component: Layout,
        alwaysShow: false,
        //  todo    将来加上 redirect 字段，这些一级路由就不会被匹配了
    },
    //  财务结算一级路由
    "05f15a29b74648479e99160676a5cbe4": {
        path: "/financeBasic",
        component: Layout,
        alwaysShow: false,
    },
    //  优惠/验券一级路由
    "7e09717be5e647fab92bcc70e15c3ced": {
        path: "/discountsVoucher",
        component: Layout,
        alwaysShow: false,
    },
    //  场地预约一级路由
    "c29a2b1a79914122b98e810d026e17f2": {
        path: "/venueBooking",
        component: Layout,
        alwaysShow: false,
    },
    //  订单管理一级路由
    "ce3405acd6f447ed995a3e53171c9ab0": {
        path: "/orderManagement ",
        component: Layout,
        alwaysShow: false,
    },
    //  课程/培训一级路由
    "3f5c553a09d44b6a8a07622be472fe41": {
        path: "/trainingCourse ",
        component: Layout,
        alwaysShow: false,
    },
    //  服务管理一级路由
    "a1560d26d13b4af0a51329b8480599f3": {
        path: "/serveBasic",
        component: Layout,
        alwaysShow: false,
    },
};

//  把服务端的路由，根据 routerId 字段，转为前端路由，这里需要一个 map：routerBasicMap 作比对
export function convertRouting(routesList) {
    const arr = [];
    routesList.forEach(item => {
        const data = convertRoutingItem(item);
        arr.push(data);
    });
    return arr;
}

/**
 * @routes:{haveChildren:boolean}
 * */
function convertRoutingItem(routes) {
    const item = asyncRoutesMap[routes.routerId];
    // if ('d84ee213f91540298100547d57f72786' === routes.routerId) {
    //     debugger;
    // }
    if (item === undefined) {
        throw new Error(`出现了位置的路由，不存在于前端路由map中: ${routes.routerId}`);
    }
    if (routes.haveChildren) {
        item.children = convertRouting(routes.children);
    }
    //  前端map的字段，用于告诉 src\layout\components\TagsView\index.vue 组件，是否展示条形历史记录
    if (item.hasHistoryName) {
        item.name = routes.name;
    }

    //  todo    做一些赋值操作
    item.meta = item.meta || {};
    const meta = item.meta;
    meta.icon = routes.icon;
    meta.title = routes.name;
    meta.id = routes.id;
    // meta.roles = ["admin", "editor"];
    return item;
}
