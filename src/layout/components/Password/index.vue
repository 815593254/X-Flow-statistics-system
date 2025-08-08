<template>
  <div class="about-main form-top">
    <el-dialog title="修改密码" :visible="showPassword" width="500px" :show-close="showPasswordClose" :close-on-click-modal="false" @close="close">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <!--<el-form-item :label="$t('label.user.oldPassword')" prop="old_password">-->
        <!--  <el-input v-model="ruleForm.old_password" type="password" autocomplete="off" />-->
        <!--</el-form-item>-->
        <el-form-item label="新密码：" prop="new_password">
          <el-input v-model="ruleForm.new_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div class="password-button">
        <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
        <el-button v-if="showPasswordClose" size="small" @click="close">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userUpdate } from '@/api/user-management/user/index'
import { simpleValidatePassword, validatePassword } from '@/utils/validate'

export default {
  data() {
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        var result = this.pwdComplexity === 'complex' ? validatePassword(value) : simpleValidatePassword(value)
        if (!result.success) {
          callback(new Error(result.msg))
        }
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        // if (this.ruleForm.old_password !== '' && this.ruleForm.old_password === value) {
        //   callback(new Error(this.$t('valid.user.errorNewPassword')))
        // }
        callback()
      }
    }
    var checkPassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.ruleForm.new_password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    // var checkPassword3 = (rule, value, callback) => {
    //   if (value) {
    //     callback()
    //   } else {
    //     callback(new Error(this.$t('valid.user.oldPassword')))
    //   }
    // }
    return {
      dialogTableVisible: false,
      ruleForm: {
        new_password: '',
        checkPass: '',
      },
      rules: {
        // old_password: [
        //   { validator: checkPassword3, trigger: 'blur' }
        // ],
        new_password: [
          { validator: checkPassword, trigger: 'blur' }
        ],
        checkPass: [
          { validator: checkPassword2, trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    ...mapGetters([
      'showPassword',
      'showPasswordClose',
      'language',
      'pwdComplexity',
      'user_info'
    ])
  },
  methods: {
    close() {
      this.$store.dispatch('app/setShowPassword', false)
      this.ruleForm = {
        new_password: '',
        checkPass: '',
      }
      this.$refs['ruleForm'].resetFields()
    },
    submitForm(formName) {
      console.log(this.user_info)
      debugger
      this.$refs[formName].validate((valid) => {
        if (valid) {
          userUpdate({
            systemUserPwd: this.ruleForm.new_password,
          }).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.$store.dispatch('app/setShowPassword', false)
          }).catch(err => {
            console.log(err)
          })
          // if (this.ruleForm.old_password === this.ruleForm.pass) {
          //   this.$message({
          //     type: 'error',
          //     message: this.$t('valid.user.errorNewPassword')
          //   })
          // } else {
          //   changePassword({
          //     origin_password: this.ruleForm.old_password,
          //     new_password: this.ruleForm.pass
          //   }).then(response => {
          //     if (response.success) {
          //       this.$message({
          //         type: 'success',
          //         message: this.$t('operation.confirmSuccess')
          //       })
          //       this.$store.dispatch('app/setShowPassword', false)
          //     }
          //   }).catch(err => {
          //     console.log(err)
          //   })
          // }
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped>
.password-button{
  text-align: center;
}
</style>
