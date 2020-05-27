<template>
    <div class="app-container">
        <el-button v-if="goodsInfoUp" type="primary" @click="putAway" v-text="goodsInfoUp.remark"/>
        <el-button v-if="goodsInfoDown" type="primary" @click="soldOut" v-text="goodsInfoDown.remark"/>
    </div>
</template>
<script>
    //  当前页面按钮nameList
    import {ManagementButtonList} from "@/button/asyncButtonsMap";

    export default {
        name: 'Management',
        data() {
            return {
                ManagementButtonList,
                buttonPermissionMap: null,
                goodsInfoUp: null,
                goodsInfoDown: null,
            };
        },
        watch: {
            buttonPermissionMap(current, prev) {
                console.log(ManagementButtonList[0]);
                this.goodsInfoUp = current[ManagementButtonList[0]];
                this.goodsInfoDown = current[ManagementButtonList[1]];
            }
        },
        created() {
            this.buttonPermissionMap = this.$route.meta.buttonPermissionMap;
            console.log(JSON.parse(JSON.stringify(this.buttonPermissionMap)));
        },
        methods: {
            putAway() {
                this.$message({
                    type: 'success',
                    message: '我是上架'
                });
            },
            soldOut() {
                this.$message({
                    type: 'success',
                    message: '我是下架'
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    .app-container {
        .roles-table {
            margin-top: 30px;
        }

        .permission-tree {
            margin-bottom: 30px;
        }
    }
</style>
