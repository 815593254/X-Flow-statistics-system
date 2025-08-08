<template>
  <div class="">
  </div>
</template>

<script>
const Base64 = require('js-base64').Base64

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456',
        totp_token: '',
      },
    }
  },
  watch: {
    // 监听路由变化，提取路由中 redirect 参数
    // 用于在 token 过期重新登录后返回原页面
    $route: {
      // handler: function() {
      //   this.handleLogin()
      // },
      // immediate: true
    }
  },
  created() {

  },
  mounted() {
    this.handleLogin()
  },
  destroyed() {

  },
  methods: {
    handleLogin() {
      var decodeStr = this.$route.params.id
      decodeStr = Base64.decode(decodeStr.toString())
      decodeStr = decodeURIComponent(decodeStr)
      this.loginForm = {
        username: decodeStr.split('&')[0],
        password: decodeStr.split('&')[1],
      }
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      }).catch((e) => {
        console.log(e)
        // if (e.response.data.errors.code === 50017) {
        //   this.show_totp_token = true
        // }
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

input:-internal-autofill-selected{
  background-color: transparent !important;
}

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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-image: url('../../../public/login_bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  // background-size: 100%;
  // background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    //padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
    width: 40px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
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
