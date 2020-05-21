<template>
    <div class="app-container">
        <el-button v-if="permissionButtons[1]"
                   type="primary"
                   @click="putAway">上架
        </el-button>
        <el-button v-if="permissionButtons[0]"
                   type="primary"
                   @click="soldOut">下架
        </el-button>
    </div>
</template>
<script>
    export default {
        name: 'Management',
        data() {
            return {
                permissionButtons: [],
            };
        },
        watch: {
            '$route': 'fetchData'
        },
        created() {
            console.warn('created Management ');
            console.log(this.$route.meta.permissionButtons);
            this.permissionButtons = this.$route.meta.permissionButtons;
        },
        methods: {
            fetchData() {
                this.error = this.post = null;
                this.loading = true;
                console.log('路由变化');
            },
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
