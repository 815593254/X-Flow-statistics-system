<template>
  <div class="tab_main_content components-content">
    <el-form ref="addForm" class="add-form" :model="formData" label-width="200px">
      <el-form-item class="updateAuthorize" label="系统当前时间：" prop="hysteresis_time">
        <el-date-picker v-model="formData.currentTime" type="datetime"></el-date-picker>
      </el-form-item>
      <el-form-item v-for="(item,index) in formData.server" :key="index" class="updateAuthorize" :label="'服务器地址'+(index+1)+'：'" prop="serverAddress1">
        <el-input :value="item"></el-input>
      </el-form-item>
      <el-form-item class="reset-item" label="系统同步周期" prop="cycle" :rules="[{ required: true, message: $t('common.pleaseEnter')+$t('label.system.syncCycle'), trigger: 'blur' }]">
        <el-input v-model.number="formData.cycle"></el-input>
        <span>分钟</span>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button type="primary" size="small" :loading="isLoading" @click="submitForm('addForm')">{{ $t('button.save') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
// import { syncTime, getSyncTime } from '@/api/system-management/index'
export default {
  data() {
    return {
      activeName: 'systemTime',
      formData: {
        currentTime: '',
        cycle: 1440,
        server: ['', '', '']
      },
      isLoading: false,
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    this.formData.currentTime = parseTime(new Date())
    this.getEditData()
  },
  methods: {
    submitForm(refForm) {
      this.$refs[refForm].validate((valid) => {
        if (valid) {
          this.isLoading = true
          // syncTime(
          //   this.formData
          // ).then(response => {
          //   if (response.success) {
          //     this.$message({
          //       type: 'success',
          //       message: this.$t('operation.confirmSuccess')
          //     })
          //     this.getEditData()
          //   } else {
          //     this.$message({
          //       type: 'error',
          //       message: this.$t('operation.confirmFail')
          //     })
          //   }
          // }).catch(err => {
          //   console.log(err)
          // }).finally(() => {
          //   this.isLoading = false
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getEditData() {
      // getSyncTime().then(response => {
      //   if (response.success) {
      //     if (response.detail.number) {
      //       this.formData = response.detail
      //     } else {
      //       this.formData['server'] = ['', '', '']
      //     }
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: this.$t('operation.getDetailFail')
      //     })
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
    },
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 15px 20px;
  min-width: 850px;
}
.add-form{
  width: 800px;
  padding-top: 30px;
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100% !important;
  }
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
}
</style>
