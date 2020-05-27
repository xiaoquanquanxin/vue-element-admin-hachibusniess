<template>
    <div class="app-container">
        <el-table
            v-loading="isLoading" border
            style="width: 100%"
            :data="tableData"
            @row-click="chooseRoleItem"
        >
            <el-table-column
                prop="id"
                label="ID"
                width="180"/>
            <el-table-column
                prop="name"
                label="姓名"
                width="180"/>
            <el-table-column
                prop="remark"
                label="备注"/>
        </el-table>
        <el-button type="primary" @click="gotoMerchantSettings">去 编辑 权限</el-button>
    </div>
</template>
<script>
    import {getRoleListRoleByPage} from "@/api/role/management";

    export default {
        name: 'MerchantSettings',

        data() {
            return {
                //  loading
                isLoading: true,

                //  请求数据
                pageInfo: {
                    pageSize: 20,
                    pageNo: 1,
                },
                tableData: []
            };
        },
        created() {
            this.getTableData();
        },
        methods: {
            //  获取角色权限管理列表
            getTableData() {
                //  {"successful":true,"code":1000,"msg":"查询成功","data":{"pageNo":1,"pageSize":20,"totalCount":1,"totalPage":1,"data":[{"id":"1","name":"测试角色","remark":"测试角色","sort":1,"isDelete":0,"createTime":"2020-05-21 11:41:36","offset":0,"max":0}],"offset":0}}
                // new Promise(resolve => {
                //     const str = '{"successful":true,"code":1000,"msg":"查询成功","data":{"pageNo":1,"pageSize":20,"totalCount":1,"totalPage":1,"data":[{"id":"1","name":"测试角色","remark":"测试角色","sort":1,"isDelete":0,"createTime":"2020-05-21 11:41:36","offset":0,"max":0}],"offset":0}}';
                //     resolve(JSON.parse(str));
                // })
                getRoleListRoleByPage(this.pageInfo)
                    .then((response) => {
                        this.isLoading = false;
                        console.log(response.data);
                        this.tableData = response.data.data;
                    })
                    .catch(() => {
                        this.isLoading = false;
                    });

            },
            //  选中某一个数据
            chooseRoleItem(data) {
                this.$store.dispatch('roleManagement/selectRoleId', data.id);
            },
            //  跳转到树
            gotoMerchantSettings() {
                const roleId = this.$store.getters.getSelectRoleManagementId;
                //  如果没有选中
                if (roleId === null) {
                    return false;
                }
                this.$router.push({
                    path: '/systemManagement/edit',
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

