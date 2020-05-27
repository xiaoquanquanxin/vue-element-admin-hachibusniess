<template>
    <div class="app-container">
        <p>编辑角色</p>
        <el-row>
            <el-col :span="16">
                <div class="grid-content bg-purple">
                    <div class="custom-tree-container">
                        <div class="block">
                            <p>角色权限</p>
                            <el-tree
                                ref="tree"
                                class="tree-checked"
                                :loading="isLoading"
                                :data="treeData"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :default-checked-keys="roleAuthorizedMenu"
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
                <p>功能权限 - {{ permissionName }}</p>
                <div v-for="(item,index) in checkedRouterPermission"
                     :key="index"
                     class="grid-content bg-purple">
                    <el-checkbox
                        :v-model="true"
                        :checked="item.isChecked"
                        :label="item.remark"
                        @change="permissionCheckboxChange($event,item.permissionId)"
                    />
                </div>
            </el-col>
        </el-row>
        <br>
        <el-button type="primary" @click="getCheckedKeys">提交</el-button>
    </div>
</template>
<script>
    import {getRoleAuthorizedMenu, getRoleAuthorizedPermission, setRoleAuthorized} from "@/api/role/management";
    import {getRoutes} from "@/api/role";
    import {JSONParse} from "@/utils";

    export default {
        name: 'MerchantSettingsEdit',
        data() {
            return {
                isLoading: true,
                //  树的数据
                treeData: [],
                //  一维数组的树
                // linearArrayTreeData: null,
                //  默认展示哪些数据
                roleAuthorizedMenu: [],
                //  全部的复选框
                permissionIds: [],
                //  右侧复选框
                permissionButtons: [],
                //  右侧复选框选择的结果
                permissionButtonsForChecked: [],
                //  右侧面板名称
                permissionName: '',
                //  维护右侧复选框的一维数组
                permissionButtonsForPost: [],

                //  复选框变化了
                checkboxChange: false,

                //  当前角色的id，用于发送请求
                roleId: this.$store.getters.getSelectRoleManagementId,
                //  当前选中的node的复选框的数据
                checkedRouterPermission: null,
            };
        },
        created() {
            //  检查roleId，不应该为空
            if (this.roleId === null) {
                //  如果没有roleId，去角色的首页
                this.$router.replace('/systemManagement');
                return false;
            }
            //  清空被选中的role数据的id
            this.$store.dispatch('roleManagement/clearSelectRoleId');
            this.getTreeData()
                .then(this.getCheckedTree)
                .then(this.getRoleAuthorizedPermission);
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
            getTreeData() {
                return getRoutes()
                    .then(response => {
                        //  转换树的格式，因为服务端返回了name，而前端需要label
                        this.transformTreeData(response.data);
                        //  赋值
                        this.treeData = response.data;
                        // this.linearArrayTreeData = this.getLinearTreeArray(response.data);
                        // console.log(JSONParse(this.linearArrayTreeData));
                    });
            },
            //  获取勾选的权限树
            getCheckedTree() {
                const roleId = this.roleId;
                //  查询角色下勾选的的权限树
                return getRoleAuthorizedMenu({
                    roleId,
                })
                    .then(response => {
                        // console.log(response.data.menuIds);
                        this.roleAuthorizedMenu = response.data.menuIds;
                    });
            },
            //  获取权限树右侧复选框
            getRoleAuthorizedPermission() {
                const roleId = this.roleId;
                getRoleAuthorizedPermission({
                    roleId,
                })
                    .then(response => {
                        //  将全部的复选框碾为一维数组，抽出其中的复选框id
                        Reflect.ownKeys(response.data).forEach(key => {
                            const itemList = response.data[key];
                            itemList.forEach(item => {
                                item.isChecked = true;
                                this.permissionButtonsForPost.push(item.permissionId);
                            });
                        });
                        this.permissionButtons = response.data;
                        console.log(JSON.parse(JSON.stringify(this.permissionButtonsForPost)));
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
            // //  将树碾平为一维数组
            // getLinearTreeArray(treeList) {
            //     let list = [];
            //     treeList.forEach(item => {
            //         list.push(item);
            //         if (item.haveChildren) {
            //             list = list.concat(this.getLinearTreeArray(item.children));
            //         }
            //     });
            //     return list;
            // },

            //  选中树的某一个节点
            currentChange(data) {
                //  如果没变化过
                if (!this.checkboxChange) {
                    console.log(data.haveChildren);
                    //  过滤父节点，不请求
                    if (data.haveChildren) {
                        this.checkedRouterPermission = null;
                        return;
                    }
                    this.checkedRouterPermission = this.permissionButtons[data.routerId];
                    this.permissionName = data.label;
                    this.checkedRouterPermission && console.log(JSONParse(this.checkedRouterPermission));
                    return;
                }
                this.$message({
                    type: 'error',
                    message: '请先提交',
                });
            },

            //  选中某一个复选框
            permissionCheckboxChange($event, permissionId) {
                // console.log($event, permissionId);
                const index = this.permissionButtonsForPost.indexOf(permissionId);
                //  如果取消勾选
                if (!$event) {
                    //  找到那一个
                    if (index === -1) {
                        throw new Error(`逻辑或数据有问题`);
                    }
                    //  删掉这一个
                    this.permissionButtonsForPost.splice(index, 1);
                } else {
                    //  如果选中
                    if (index !== -1) {
                        throw new Error(`逻辑或数据有问题`);
                    }
                    this.permissionButtonsForPost.push(permissionId);
                }
                //  复选框改变了
                this.checkboxChange = true;
                console.log('提交的按钮', JSONParse(this.permissionButtonsForPost));
            },
            //  提交，获取当前选中的所有节点
            getCheckedKeys() {
                const roleId = this.roleId;
                const menuIds = this.$refs.tree.getCheckedKeys().join(',');
                const permissionIds = this.permissionButtonsForPost.join(',');
                console.log(roleId);
                console.log(menuIds);
                console.log(permissionIds);
                setRoleAuthorized({
                    roleId,
                    menuIds,
                    permissionIds,
                })
                    .then(response => {
                        console.log(response);
                    });
            },
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

        .tree-checked > div {
            background-color: lightblue;
        }
    }
</style>

