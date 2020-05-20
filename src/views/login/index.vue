<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
                 label-position="left">
            <div class="title-container">
                <h3 class="title">哈奇商家管理系统</h3>
                <p class="text-center">hachibusiness system</p>
            </div>
            <el-form-item prop="username">
                <span class="svg-container">
                    <svg-icon icon-class="user"/>
                </span>
                <el-input ref="username"
                          v-model="loginForm.username"
                          placeholder="请输入用户名"
                          name="username"
                          type="text"
                          tabindex="1"
                          autocomplete="on"
                />
            </el-form-item>
            <!--            密码-->
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password"/>
                </span>
                <el-input :key="passwordType"
                          ref="password"
                          v-model="loginForm.password"
                          :type="passwordType"
                          placeholder="请输入密码"
                          name="password"
                          tabindex="2"
                          autocomplete="on"
                          @blur="capsTooltip = false"
                          @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
                </span>
            </el-form-item>
            <!--            图片验证码-->
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="17">
                    <div class="grid-content bg-purple">
                        <!--验证码文本-->
                        <el-form-item prop="validCode">
                            <span class="svg-container">
                                <svg-icon icon-class="user"/>
                            </span>
                            <el-input ref="validCode"
                                      v-model="loginForm.validCode"
                                      placeholder="请输入验证码"
                                      name="validCode"
                                      type="text"
                                      tabindex="3"
                                      autocomplete="on"
                            />
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="7">
                    <el-image class="validate-pic fr"
                              fit="scale-down"
                              :src="validatePicSrc+clientKey"
                              @click="getValidatePicSrc"/>
                </el-col>
            </el-row>
            <!--                登录按钮-->
            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                       @click.native.prevent="handleLogin">Login
            </el-button>
        </el-form>
    </div>
</template>
<script>
    import { randomMinAndMax } from '@utils/numeration';
    import { Fingerprint } from '@utils/fingerprint';
    import { md5 } from '@utils/md5';
    import { verifyCode } from '@/api/user';

    export default {
        name: 'Login',
        data(){
            const validateUsername = (rule, value, callback) => {
                if (!value.length) {
                    callback(new Error('请输入用户名'));
                } else {
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (!value.length) {
                    callback(new Error('请输入有效密码'));
                } else {
                    callback();
                }
            };
            const validateCodeServlet = (rule, value, callback) => {
                if (!value.length) {
                    callback(new Error('请输入验证码'));
                } else {
                    callback();
                }
            };
            return {
                loginForm: {
                    username: 'dxy',
                    password: '123456',
                    validCode: '',
                },
                loginRules: {
                    username: [{ required: true, trigger: 'blur', validator: validateUsername }],
                    password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                    validCode: [{ required: true, trigger: 'blur', validator: validateCodeServlet }]
                },
                //  密码类型
                passwordType: 'password',

                capsTooltip: false,
                loading: false,
                showDialog: false,
                redirect: undefined,
                otherQuery: {},
                //  图片验证码
                validatePicSrc: verifyCode,
                //  传给服务端的加密的字段
                clientKey: '',
                validateRandomCodeDigit: 8,
                validateRandomCodeList: null,
            };
        },
        watch: {
            $route: {
                handler: function (route){
                    const query = route.query;
                    if (query) {
                        this.redirect = query.redirect;
                        this.otherQuery = this.getOtherQuery(query);
                    }
                },
                immediate: true
            }
        },
        created(){
            const numbersArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            const lowerCaseLetterArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
            const upperCaseLetterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            this.validateRandomCodeList = numbersArr.concat(lowerCaseLetterArr).concat(upperCaseLetterArr);
            this.getValidatePicSrc();
            // window.addEventListener('storage', this.afterQRScan)
        },
        mounted(){
            if (this.loginForm.username === '') {
                this.$refs.username.focus();
            } else if (this.loginForm.password === '') {
                this.$refs.password.focus();
            }
        },
        destroyed(){
            // window.removeEventListener('storage', this.afterQRScan)
        },
        methods: {
            //  获取图片验证码信息，之前的拿随机数
            getValidatePicSrc(){
                let n = this.validateRandomCodeDigit;
                let validateRandomCodeList = this.validateRandomCodeList;
                let listLength = validateRandomCodeList.length;
                let randomStr = '';
                while (n--) {
                    randomStr += validateRandomCodeList[randomMinAndMax(0, listLength - 1)];
                }
                const uuid = new Fingerprint({ canvas: true }).get();
                // console.log(uuid);
                randomStr += uuid;
                randomStr += new Date().getTime().toString().slice(7);
                // console.log(randomStr);
                // console.log(md5(randomStr));
                // console.log(md5(randomStr));
                this.clientKey = md5(randomStr);
            },
            //  改变密码的眼睛
            showPwd(){
                if (this.passwordType === 'password') {
                    this.passwordType = '';
                } else {
                    this.passwordType = 'password';
                }
                this.$nextTick(() => {
                    this.$refs.password.focus();
                });
            },
            //  登录按钮
            handleLogin(){
                this.$refs.loginForm.validate(valid => {
                    if (valid) {
                        this.loading = true;
                        // console.log(this.loginForm);
                        const data = Object.assign({}, this.loginForm, {
                            clientKey: this.clientKey,
                        });
                        // console.log('请求数据', JSON.stringify(data));
                        this.$store.dispatch('user/login', data)
                            .then(() => {
                                this.loading = false;
                                // console.log('登录成功');
                                this.$router.push({ path: this.redirect || '/', query: this.otherQuery });
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            getOtherQuery(query){
                return Object.keys(query).reduce((acc, cur) => {
                    if (cur !== 'redirect') {
                        acc[cur] = query[cur];
                    }
                    return acc;
                }, {});
            }
            // afterQRScan() {
            //   if (e.key === 'x-admin-oauth-code') {
            //     const code = getQueryObject(e.newValue)
            //     const codeMap = {
            //       wechat: 'code',
            //       tencent: 'code'
            //     }
            //     const type = codeMap[this.auth_type]
            //     const codeName = code[type]
            //     if (codeName) {
            //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            //         this.$router.push({ path: this.redirect || '/' })
            //       })
            //     } else {
            //       alert('第三方登录失败')
            //     }
            //   }
            // }
        }
    };
</script>
<style lang="scss">
    /* 修复input 背景不协调 和光标变色 */
    /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

    $bg: #283443;
    $light_gray: #fff;
    $cursor: #fff;

    @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
        .login-container .el-input input {
            color: $cursor;
        }
    }

    /* reset element-ui css */
    .login-container {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;

            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                caret-color: $cursor;

                &:-webkit-autofill {
                    box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: $cursor !important;
                }
            }
        }

        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            color: #454545;
        }
    }
</style>
<style lang="scss" scoped>
    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;

    .login-container {
        min-height: 100%;
        width: 100%;
        background-color: $bg;
        overflow: hidden;

        .login-form {
            position: relative;
            width: 520px;
            max-width: 100%;
            padding: 160px 35px 0;
            margin: 0 auto;
            overflow: hidden;

            .validate-pic {
                border-radius: 4px;
                height: 50px;
                margin-top: 1px;
                width: 100px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
            }
        }

        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 10px;

            span {
                &:first-of-type {
                    margin-right: 16px;
                }
            }
        }

        .svg-container {
            padding: 6px 5px 6px 15px;
            color: $dark_gray;
            vertical-align: middle;
            width: 30px;
            display: inline-block;
        }

        .title-container {
            position: relative;

            .title {
                font-size: 26px;
                color: $light_gray;
                margin: 0px auto 20px auto;
                text-align: center;
                font-weight: bold;
            }

            p {
                color: $light_gray;
                margin-bottom: 40px;
            }
        }

        .show-pwd {
            position: absolute;
            right: 10px;
            top: 7px;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
            user-select: none;
        }

        .thirdparty-button {
            position: absolute;
            right: 0;
            bottom: 6px;
        }

        @media only screen and (max-width: 470px) {
            .thirdparty-button {
                display: none;
            }
        }
    }
</style>
