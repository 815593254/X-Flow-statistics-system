<template>
  <div class="tab_main_content">
    <div class="el-tab-content">
      <el-form ref="addForm" :model="formData" label-width="200px">
        <div class="el-tab-content">
          <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
              <span>邮件告警配置</span>
            </div>
            <div class="add-form">
              <!-- 发件服务器（SMTP） -->
              <el-form-item :label="$t('label.emailAlert.smtp_host')" prop="smtp_host">
                <el-input v-model="formData.smtp_host" />
              </el-form-item>
              <!-- 发件服务器端口 -->
              <el-form-item :label="$t('label.emailAlert.smtp_port')" prop="smtp_port">
                <el-input v-model="formData.smtp_port" />
              </el-form-item>
              <!-- 发件邮箱 -->
              <el-form-item :label="$t('label.emailAlert.email_address')" prop="email_address">
                <el-input v-model="formData.email_address" />
              </el-form-item>

              <!-- 邮箱登录名 -->
              <el-form-item :label="$t('label.emailAlert.mail_account')" prop="mail_account">
                <el-input v-model="formData.mail_account" />
              </el-form-item>
              <!-- 邮箱登录密码 -->
              <el-form-item :label="$t('label.emailAlert.mail_password')" prop="mail_password">
                <el-input v-model="formData.mail_password" type="password" />
              </el-form-item>

              <!-- 自定义发件主题 -->
              <el-form-item :label="$t('label.emailAlert.mail_subject')" prop="mail_subject">
                <el-input v-model="formData.mail_subject" />
              </el-form-item>

              <!-- 验证邮箱 -->
              <el-form-item :label="$t('label.emailAlert.test_mail')" prop="test_mail">
                <el-input v-model="formData.test_mail" />
              </el-form-item>

              <!-- 接收邮箱 -->
              <el-form-item :label="$t('label.emailAlert.receivers_mail')" prop="receivers_mail">
                <el-input v-model="formData.receivers_mail" type="textarea" :rows="2" placeholder="逗号分隔" />
              </el-form-item>
              <el-form-item class="form-btn" style="margin-top: 20px;">
                <el-button type="primary" size="small" :loading="isLoading" @click="onSubmit('addForm')">{{ $t('button.save') }}</el-button>
              </el-form-item>
            </div>
          </el-card>
        </div>

      </el-form>
    </div>
  </div>
</template>
<script>
import { emailAlertGet, emailAlertUpdate } from '@/api/system-management/system-safety'
import _ from 'lodash'

export default {
  data() {
    return {
      isLoading: false,
      formData: {
        smtp_host: '', // 发件服务器（SMTP）
        smtp_port: '', // 发件服务器端口
        email_address: '', // 发件邮箱
        mail_account: '', // 发件邮箱账号
        mail_password: '', // 邮箱登陆密码
        mail_subject: '', // 自定义发件主题
        test_mail: '', // 验证邮箱
        receivers_mail: '', // 接收邮箱列表
      },
      rules: {
      },
    }
  },

  mounted() {
    this.getConfig()
  },

  methods: {
    getConfig() {
      emailAlertGet()
        .then(response => {
          this.formData = response.data
          this.formData.receivers_mail = response.data.receivers_mail.join(',')
        })
    },
    // 提交表单
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          var data = _.cloneDeep(this.formData)
          data.receivers_mail = this.formData.receivers_mail.split(',')
          emailAlertUpdate(data)
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('operation.confirmSuccess')
              })
            })
            .finally(() => {
              this.isLoading = false
            })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('operation.formError')
          })
        }
      })
    },

  },
}
</script>
<style lang="scss" scoped>
.tab_main_content{
  padding: 15px 20px;
  .reset-form{
    .reset-item{
      margin-bottom: 20px !important;
    }
    .form-btn{
      margin-top: 20px;
    }
  }

  .el-tab-content{
    font-size: 14px;
    .el-card__header{
      padding: 10px 20px;
      background-color: #FAFAFA;
      color: $commonColor;
    }
  }

  .add-form{
    width: 800px;
    height: auto;
    padding: 20px 0 0 20px;
    .el-date-editor.el-input, .el-date-editor.el-input__inner{width: 100%;}

    .reset-item {
      position: relative;

      span{
        position: absolute;
        right: 10px;
        color: #C0C4CC;
      }

      .el-input__inner{
        padding-right: 25px !important;
      }
    }

    .locking{
      color: #606266;
      display: flex;
      flex-wrap: nowrap;

      .input{
        width: 60px;
        padding: 0 3px;
      }
    }

  }

  .reset-table {
    .reset-table-btn{
      background: #D1E9FF;
      border: 1px solid #1890FF;
      border-radius: 2px;
      border-radius: 2px;
      color: #1890FF;
      letter-spacing: 0;
    }

    .table-group{
      background-color:  #FAFAFA;
      border: 1px solid #dfe6ec;
      border-bottom: none;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
    }

    .table-btn{
      height: 24px;
      padding: 5px 10px;
    }

    .el-table__row,.el-table th{
      height: 40px !important;
    }
  }

}
</style>
