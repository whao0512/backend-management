<template>
  <div
    style="position:relative; width:100%;height:100%;background-image:url(../../../static/image/login/background2.png);background-size:100% 100%;">
    <div class="computer">
    </div>
    <div class="head">
      <span style="font-size:54px;color: #fff;font-weight: bold;">HyMall运营后台</span>
    </div>

    <div class="form" align="center"
         style="width:440px;height:466px;background:url(../../../static/image/login/Loginbox.png)">
      <el-form ref="loginForm" autoComplete="on" :model="loginForm" :rules="loginRules">
        <el-form-item style="margin-top:60px">
          <el-row>
            <el-col :span="17" :offset="3">
              <span style="font-size:22px;">用户登录</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="username">
          <el-row>
            <el-col :span="17" :offset="3">
              <el-input
                v-model="loginForm.username"
                name="username"
                type="text"
                auto-complete="off"
                placeholder="请输入用户名">
                <template slot="prepend">
                  <img :src="imguser">
                </template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-row>
            <el-col :span="17" :offset="3">
              <el-input
                :type="pwdType"
                v-model="loginForm.password"
                name="password"
                auto-complete="off"
                placeholder="请输入密码"
                @keyup.enter.native="handleLogin">
                <template slot="prepend">
                  <img :src="imgpassword">
                </template>
              </el-input>
              <span style="position:fixed;left:340px;top: 190px" class="show-pwd" @click="showPwd">
                <svg-icon icon-class="eye"/>
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="checkCode">
          <el-row>
            <el-col :span="12" :offset="3">
              <el-input
                v-model="loginForm.checkCode"
                name="checkCode"
                type="text"
                auto-complete="off"
                placeholder="请输入验证码">
                <template slot="prepend">
                  <img :src="imgverify">
                </template>
              </el-input>
            </el-col>
            <el-col :span="4.5" :offset="10.5">
              <img @click="getCheckedImg" :src="checkedImg"
                   style="margin-left:10px;width:78px;height:38px;border:solid #dfe2e4 1px;border-radius:5px;color:#dfe2e4;"/>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="display:none;">
          <el-row>
            <el-input v-model="loginForm.imgCheckCodeId" name="imgCheckCodeId" type="text">
            </el-input>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="17" :offset="3">
              <el-button type="primary" @click.native.prevent="handleLogin" style="width:300px">登录</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <div class="foot margin-left-100" align="center">
      <span style="color:#fff;font-size:14px">版权所有©华云信息科技有限公司</span>
    </div>
  </div>

</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {
    getImgCheckCodeId,
    getImgCheckCode,
    login
  } from "@/api/login"

  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 5) {
          callback(new Error('密码不能小于5位'))
        } else {
          callback()
        }
      };
      const validateVerifyCode = (rule, value, callback) => {
        if (value.length != 4) {
          callback(new Error('验证码4位'))
        } else {
          callback()
        }
      };
      return {
        imglogo: '../../../static/image/login/1.png',
        imgbox: '../../../static/image/login/Loginbox.png',
        imguser: '../../../static/image/login/icon_Username_01.png',
        imgpassword: '../../../static/image/login/icon_Password_01.png',
        imgverify: '../../../static/image/login/icon_VerificationCode.png',
        checkedImg: '',
        checkCodeId: '',
        // checkedImgPrefix: "http://47.107.111.34:8182/merchantUserManger/generateImageCode?randomPageId=",
        checkedImgPrefix: "http://seller-service-sit.cyblogs.com/merchantUserManger/generateImageCode?randomPageId=",
        loginForm: {
          username: '',
          password: '',
          checkCode: '',
          imgCheckCodeId: ''
        },
        loginRules: {
          // username: [
          //   {required: true, message: '请输入用户名', trigger: 'blur', validator: validateUsername},
          // ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur', validator: validatePass},
          ],
          checkCode: [
            {required: true, message: '请输入验证码', trigger: 'blur', validator: validateVerifyCode},
          ],
        },
        loading: false,
        pwdType: 'password',
        redirect: undefined,
        fullscreenLoading: false,
        alwaystrue: true
      };
    },
    created() {
      this.init();
      // const host = window.location.host;
      // let domain = this.getQueryString('domain', window.location.hash);
      // let currentDomain = sessionStorage.getItem('seller_domain');
      // if (domain && currentDomain != domain) {
      //   sessionStorage.setItem('seller_domain', domain)
      //   window.location.href = `http://${host}/#/login?domain=${domain}`;
      //   return;
      // } else {
      //   window.location.href = `http://${host}/#/login?domain=${domain}`;
      //   return;
      // }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      getQueryString(name, url) {
        // url = url || window.location.href.split('?')[1];
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let urlFormat = url.substr(7)
        let r = urlFormat.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // this.$store.dispatch('Login', this.loginForm).then(() => {
            login(this.loginForm).then((res) => {
              this.loading = false
              sessionStorage.setItem('baseInfo', res.returnData.menuAuthority)
              sessionStorage.setItem('hymall_token', res.returnData.token)
              this.$router.push({path: '/layout/dashboard'})
            },err => {
              this.getCheckedImg();
            }).catch((err) => {
              this.loading = false;
              this.$message.error(err.returnMsg);
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getCheckedImg() {
        // 调用逻辑：先调用/merchantUserManger/getImgCheckCodeId 不用请求参数
        // 得到验证码id,比如：1234 表示这个页面只有一个验证码id,只需要调用一次就好了
        // 然后将图片验证码src值改成/merchantUserManger/generateImageCode?randomPageId='1234'
        // 并且设置imgCheckCodeId = '1234'
        // 点击登录的时候会要传递四个属性
        this.setImgCheck();
      },
      init() {
        getImgCheckCodeId({}).then(
          res => {
            this.loginForm.imgCheckCodeId = res.returnData;
            this.setImgCheck();
          }
        )
      },
      setImgCheck() {
        //验证码id进来后获取到了不变了，就一直用好了
        //后面加时间戳，为了点击时刷新验证码图片
        this.checkedImg = this.checkedImgPrefix + "'" + this.loginForm.imgCheckCodeId +
          "'&timestamp=" + Date.parse(new Date());
      }
    }
  };
</script>

<style>
  .head {
    position: absolute;
    left: 76px;
    top: 5%;
  }

  @media (max-width: 1440px) {
    .computer {
      position: absolute;
      right: 47%;
      top: 50%;
      transform: translateY(-60%);
      width: 547px;
      height: 369px;
      background-image: url("../../../static/image/login/1.png");
      background-size: 100%;
    }
  }

  @media (min-width: 1440px) {
    .computer {
      position: absolute;
      right: 47%;
      top: 50%;
      transform: translateY(-60%);
      width: 716px;
      height: 492px;
      background-image: url("../../../static/image/login/1.png");
      background-size: 100%;
    }
  }

  .form {
    position: absolute;
    right: 12%;
    top: 50%;
    transform: translateY(-60%);
  }

  .foot {
    position: absolute;
    right: 40%;
    bottom: 8%;
    vertical-align: middle;
  }

  .el-form-item__error {
    margin-left: 25%;
  }
</style>
