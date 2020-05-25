//  侧边栏的状态，1是打开，0是合住，这个放到localstorage里面
const SideBarStatus = 'sidebarStatus';
const FontSize = 'fontsize';

const state = {
    sidebar: {
        // opened: Cookies.get(SideBarStatus) ? !!+Cookies.get(SideBarStatus) : true,
        opened: true,
        withoutAnimation: false
    },
    device: 'desktop',
    fontSize: localStorage.getItem(FontSize) || 'default',
};

const mutations = {
    TOGGLE_SIDEBAR: state => {
        // state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.opened = true;
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.opened) {
            localStorage.setItem(SideBarStatus, '1');
        } else {
            // todo 应该是 localStorage.setItem(SideBarStatus, '0');
            localStorage.setItem(SideBarStatus, '1');
        }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
        // todo 应该是 localStorage.setItem(SideBarStatus, '0');
        localStorage.setItem(SideBarStatus, '1');
        //  todo    应该是 state.sidebar.opened = false;
        state.sidebar.opened = true;
        state.sidebar.withoutAnimation = withoutAnimation;
    },
    TOGGLE_DEVICE: (state, device) => {
        state.device = device;
    },
    SET_SIZE: (state, fontSize) => {
        state.fontSize = fontSize;
        localStorage.setItem(FontSize, fontSize);
    }
};

const actions = {
    toggleSideBar({commit}) {
        commit('TOGGLE_SIDEBAR');
    },
    closeSideBar({commit}, {withoutAnimation}) {
        commit('CLOSE_SIDEBAR', withoutAnimation);
    },
    toggleDevice({commit}, device) {
        commit('TOGGLE_DEVICE', device);
    },
    setSize({commit}, fontSize) {
        commit('SET_SIZE', fontSize);
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
