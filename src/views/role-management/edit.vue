<template>
    <div class="app-container">
        <el-row>
            <el-col :span="16">
                <div class="grid-content bg-purple">
                    <div class="custom-tree-container">
                        <div class="block">
                            <p>编辑角色</p>
                            <el-tree
                                ref="tree"
                                :loading="isLoading"
                                :data="treeData"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :default-checked-keys="roleAuthorizedMenu"
                                :check-on-click-node="true"
                                :expand-on-click-node="false"
                                @current-change="currentChange"
                            >
                                <span slot-scope="{ node }" class="custom-tree-node">
                                    <span>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple">
                    <el-checkbox v-for="(item,index) in permissionButtons"
                                 :key="index"
                                 :v-model="true"
                                 :label="item.remark"
                    />
                </div>
            </el-col>
        </el-row>
        <el-button type="primary" @click="getCheckedKeys">提交</el-button>
    </div>
</template>
<script>
    import {getRoleAuthorizedMenu, getRoleAuthorizedPermission} from "@/api/role/management";
    import {getRoutes} from "@/api/role";

    export default {
        name: 'MerchantSettingsEdit',
        data() {
            return {
                isLoading: true,
                //  树的数据
                treeData: [],
                //  默认展示哪些数据
                roleAuthorizedMenu: [],
                //  选中的树的node的permissionIds
                permissionIds: [],
                //  右侧按钮
                permissionButtons: [],
                //  当前角色的id，用于发送请求
                roleId: this.$store.getters.getSelectRoleManagementId,
            };
        },
        created() {
            //  检查roleId，不应该为空
            if (this.roleId === null) {
                //  如果没有roleId，去角色的首页
                this.$router.replace('/financeBasic');
                return false;
            }
            //  清空被选中的role数据的id
            this.$store.dispatch('roleManagement/clearSelectRoleId');
            console.log(this.roleId);
            this.getTreeData(this.roleId);
        },
        methods: {
            append(data) {
                const newChild = {id: this.id++, label: 'testtest', children: []};
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
            },
            remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
            },
            //  查询角色下的权限树，然后再获取被选中的节点
            getTreeData(roleId) {
                getRoutes()
                    .then(response => {
                        //  转换树的格式，因为服务端返回了name，而前端需要label
                        this.transformTreeData(response.data);
                        console.table(JSON.parse(JSON.stringify(response.data)));
                        //  赋值
                        this.treeData = response.data;
                        //  查询角色下的权限树
                        return getRoleAuthorizedMenu({
                            roleId,
                        });
                    })
                    .then(response => {
                        console.log(response.data.menuIds);
                        this.roleAuthorizedMenu = response.data.menuIds;
                    });
            },
            //  转换树的格式，因为服务端返回了name，而前端需要label
            transformTreeData(treeList) {
                treeList.forEach(item => {
                    item.label = item.name;
                    delete item.name;
                    //  如果服务端认为没有子，children数组为空
                    if (!item.haveChildren || !item.children || item.children.length === 0) {
                        return;
                    }
                    this.transformTreeData(item.children);
                });
            },
            //  提交，获取当前选中的所有节点
            getCheckedKeys() {
                const checkedKeys = this.$refs.tree.getCheckedKeys();
                console.log(checkedKeys);
            },
            //  选中某一个节点，获取权限树右侧按钮
            currentChange(data, nodeStatus, c) {
                // console.log(data, nodeStatus.checked, c);
                //  过滤选中状态
                if (nodeStatus.checked) {
                    this.permissionButtons = [];
                    return false;
                }
                //  过滤父节点，不请求
                if (data.haveChildren) {
                    return false;
                }
                const roleId = this.roleId;
                const menuId = data.id;
                getRoleAuthorizedPermission({
                    roleId,
                    menuId,
                })
                    .then(response => {
                        this.permissionButtons = response.data;
                        // console.table(JSON.parse(JSON.stringify(this.permissionButtons)));
                    });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .app-container {
        .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            padding-right: 8px;
        }
    }
</style>

