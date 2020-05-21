//  商品管理页面按钮列表
export const ManagementButtonList = ["goodsInfo.up", "goodsInfo.down"];

//  前端本地按钮对照表
export const asyncButtonsMap = {};
[].concat(ManagementButtonList).forEach(item => {
    asyncButtonsMap[item] = true;
});
