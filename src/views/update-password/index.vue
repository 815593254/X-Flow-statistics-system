<template>
  <div class="login-container">
    <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="ruleForm">
      <el-form-item label="用户名：" prop="systemUserName">
        <el-input v-model="ruleForm.systemUserName" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="原密码：" prop="systemUserOldPwd">
        <el-input v-model="ruleForm.systemUserOldPwd" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码：" prop="systemUserPwd">
        <el-input v-model="ruleForm.systemUserPwd" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码：" prop="systemUserConfirmPwd">
        <el-input v-model="ruleForm.systemUserConfirmPwd" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updatePassword } from '@/api/update-password'

export default {
  // components: { LangSelect },
  data() {
    var checkPassword = (rule, value, callback) => {
      // 编辑时且密码为空，不检查
      if (!value) {
        callback(new Error('请输入确认密码'))
      }
      if (this.ruleForm.systemUserPwd === '') {
        callback()
      } else {
        if (value !== this.ruleForm.systemUserPwd) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {},
      rules: {
        systemUserName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        systemUserOldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        systemUserPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        systemUserConfirmPwd: [{ required: true, validator: checkPassword, trigger: 'blur' }],
      }
    }
  },
  watch: {
    // 监听路由变化，提取路由中 redirect 参数
    // 用于在 token 过期重新登录后返回原页面
  },
  created() {

  },
  mounted() {

  },
  destroyed() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(
            this.ruleForm
          ).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            // this.$router.push({ path: '/' })
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    close() {
      // this.$store.dispatch('app/setShowPassword', false)
      // this.ruleForm = {
      //   new_password: '',
      //   checkPass: '',
      // }
      // this.$refs['ruleForm'].resetFields()
    },
  }
}
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
.ruleForm{
  margin:0 auto;
  padding-top: 50px;
  width: 500px;
}
</style>
