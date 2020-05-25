const getters = {
    sidebar: state => state.app.sidebar,
    //  文字大小
    fontSize: state => state.app.fontSize,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    //  角色权限管理被选中的数据
    getSelectRoleManagementId: state => state.roleManagement.selectRoleId,
};
export default getters;
