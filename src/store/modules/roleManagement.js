//  角色权限管理
const state = {
    //  被选中的那条权限的id
    selectRoleId: null,
};

const mutations = {
    selectRoleId: (state, roleId) => {
        state.selectRoleId = roleId;
    }
};

const actions = {
    //  选中某一个数据
    selectRoleId({commit}, roleId) {
        commit('selectRoleId', roleId);
    },
    //  清空选中的数据
    clearSelectRoleId({commit}) {
        commit('selectRoleId', null);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
