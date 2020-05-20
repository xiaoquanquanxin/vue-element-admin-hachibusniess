import Layout from "@/layout/index";

const routerBasicMap = {
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
        component: () => import("@/views/permission/role"),
    },
    //  商家设置一级路由
    "77bab4355c1a43cf8b064868071022a0": {
        path: "/merchantSettings",
        component: Layout,
        alwaysShow: false,
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
    const item = routerBasicMap[routes.routerId];
    if (item === undefined) {
        throw new Error(`出现了位置的路由，不存在于前端路由map中: ${routes.routerId}`);
    }
    if (routes.haveChildren) {
        item.children = convertRouting(routes.children);
    }
    //  todo    做一些赋值操作
    item.meta = item.meta || {};
    const meta = item.meta;
    meta.icon = routes.icon;
    meta.title = routes.name;
    meta.id = routes.id;
    meta.roles = ["admin", "editor"];
    return item;
}
