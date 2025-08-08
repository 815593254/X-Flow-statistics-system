<template>
  <div class="tab_main_content components-content">
    <el-form ref="addForm" class="add-form" :model="formData" :rules="rules" label-width="200px">
      <!-- 密码复杂度 -->
      <el-form-item label="密码复杂度：" prop="pwdConfigType">
        <el-radio-group v-model="formData.pwdConfigType">
          <el-radio :label="0">简单密码</el-radio>
          <el-radio :label="1">复杂密码</el-radio>
        </el-radio-group>
        <p style="color: #aaaaaa;">复杂密码需要由字母大小写、数字和符号组成</p>
      </el-form-item>

      <!-- 账户锁定 -->
      <el-form-item label="账户锁定：" prop="pwdErrorCountConfState">
        <el-radio-group v-model="formData.pwdErrorCountConfState">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
        <p class="locking">
          密码错误
          <el-form-item label-width="0" prop="pwdErrorCountConfValue">
            <el-input v-model.number="formData.pwdErrorCountConfValue" class="input"></el-input>
          </el-form-item>
          次，锁定帐户
          <el-form-item label-width="0" prop="accLockConfValue">
            <el-input v-model.number="formData.accLockConfValue" class="input"></el-input>
          </el-form-item>
          分钟。
        </p>
      </el-form-item>

      <!-- 定期改密 -->
      <el-form-item label="定期修改密码：" prop="updatePwdConfValue">
        <el-select v-model="formData.updatePwdConfValue">
          <el-option label="从不" value="1"></el-option>
          <el-option label="每周" value="2"></el-option>
          <el-option label="一个月" value="3"></el-option>
          <el-option label="三个月" value="4"></el-option>
          <el-option label="六个月" value="5"></el-option>
        </el-select>
      </el-form-item>

      <!-- 登录超时注销时间-->
      <el-form-item class="reset-item" label="账号登录超时：" prop="accTimeoutConfValue">
        <el-input v-model.number="formData.accTimeoutConfValue"></el-input>
        <span>分钟</span>
      </el-form-item>

      <!-- 登录IP白名单 -->
      <el-form-item class="reset-table" label="登录IP白名单：" prop="ipWhiteListConfState">
        <el-radio-group v-model="formData.ipWhiteListConfState">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
        <div v-if="formData.ipWhiteListConfState === 1">
          <div class="table-group">
            <el-button class="table-btn" type="primary" size="mini" @click="addManageIP">{{ $t('button.add') }}</el-button>
          </div>
          <div class="rule-table host-table">
            <el-table
              ref="multipleTable"
              :data="formData.manage_ip_arr"
              border
              style="width: 100%"
              :empty-text="' '"
              max-height="441"
            >
              <!-- 起始IP地址 -->
              <el-table-column prop="start_address" label="起始IP地址" min-width="150">
                <template slot-scope="scope">
                  <el-form-item label="" label-width="0px" :prop="'manage_ip_arr.' + scope.$index + '.start_address'">
                    <el-input v-model.trim="scope.row.start_address" size="small"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <!-- 结束IP地址 -->
              <el-table-column prop="end_address" label="结束IP地址" min-width="150">
                <template slot-scope="scope">
                  <el-form-item label="" label-width="0px" :prop="'manage_ip_arr.' + scope.$index + '.end_address'">
                    <el-input v-model.trim="scope.row.end_address" size="small"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.operation')" width="100" align="center">
                <template slot-scope="scope">
                  <div class="table-button">
                    <span class="icon-button">
                      <el-button type="text" @click="ipDelete(scope.$index)">删除</el-button>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button v-permission="'5-1-save'" type="primary" size="small" :loading="isLoading" @click="onSubmit">{{ $t('button.save') }}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
// import { checkIp } from '@/utils/check-rule'
import { getLoginSafety, updateLoginSafety } from '@/api/system-management'

export default {
  data() {
    return {
      isLoading: false,
      formData: {
        complexity: 'simple',
      },
      rules: {
        updatePwdConfValue: [{ required: true, message: '请选择', trigger: 'blur' }],
        accTimeoutConfValue: [{ required: true, message: '请输入超时时间', trigger: 'blur' }]
      },
      // ipRule: [{ validator: checkIp(), message: this.$t('valid.ip'), trigger: 'blur' }]
    }
  },

  mounted() {
    this.getConfig()
  },

  methods: {
    getConfig() {
      getLoginSafety({}).then(response => {
        this.formData = response.body
        var manage_ip_arr = this.formData.ipWhiteListConfValue.split(',')
        var new_manage_ip_arr = []
        for (var index = 0; index < manage_ip_arr.length; index++) {
          var item = manage_ip_arr[index]
          var new_manage_ip_arr_dic = {}
          new_manage_ip_arr_dic['start_address'] = item.split('-')[0]
          new_manage_ip_arr_dic['end_address'] = item.split('-')[1]
          new_manage_ip_arr.push(new_manage_ip_arr_dic)
        }
        this.formData.manage_ip_arr = new_manage_ip_arr
        console.log(this.formData)
      }).catch(err => {
        console.log(err)
      })
    },
    // 增加管理ip
    addManageIP() {
      var item = { 'start_address': '', 'end_address': '' }
      this.formData.manage_ip_arr.push(item)
    },

    // 删除管理ip
    ipDelete(index) {
      if (index > -1) {
        this.formData.manage_ip_arr.splice(index, 1)
      }
    },

    // 提交表单
    onSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          var manage_ip_arr = []
          if (this.formData.ipWhiteListConfState === 1) {
            for (var index = 0; index < this.formData.manage_ip_arr.length; index++) {
              var item = this.formData.manage_ip_arr[index]
              if (item.start_address && item.end_address) {
                manage_ip_arr.push(item.start_address + '-' + item.end_address)
              }
            }
          }
          this.formData.ipWhiteListConfValue = manage_ip_arr.join(',')
          if (this.formData.pwdConfigType === 0) {
            this.formData.pwdSimpleConfState = 1
            this.formData.pwdComplexConfState = 0
          } else {
            this.formData.pwdSimpleConfState = 0
            this.formData.pwdComplexConfState = 1
          }
          console.log(this.formData)
          updateLoginSafety(this.formData).then(() => {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
          })
          // this.isLoading = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

  },
}
</script>

<style lang="scss" scoped>
.tab_main_content{
  padding: 15px 20px;
  min-width: 850px;
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
    padding-top: 30px;
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
