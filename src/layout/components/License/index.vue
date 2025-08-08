<template>
  <div class="about-main form-top license-active">
    <el-dialog :title="$t('navbar.showLicense')" :visible="showLicense" width="700px" :show-close="false" :close-on-click-modal="false" @close="close">
      <div>
        <div class="license-header">
          <div class="license-img">
          <!-- <img src="../../../../public/logo-esm-black.svg" class="logo-esm">-->
          </div>
          <div>
            <p class="license-text1">{{ $t('navbar.licenseText1') }}</p>
            <p class="license-text2">{{ $t('navbar.licenseText2') }}</p>
            <p class="license-text2">{{ $t('navbar.licenseText3') }}</p>
          </div>
        </div>

        <div class="export_hd" @click="exportHd">
          <p>{{ $t('navbar.export_hd') }}</p>
        </div>

        <div class="license">
          <p>{{ $t('navbar.licenseFile') }}</p>
        </div>

        <el-form ref="ruleForm" status-icon label-position="top" label-width="100px" class="demo-ruleForm">
          <el-form-item>
            <el-upload
              ref="file-upload"
              class="upload-icon"
              action=""
              :multiple="false"
              :limit="1"
              :auto-upload="false"
              :show-file-list="true"
              list-type="text"
              drag
              :http-request="httpRequest"
              :file-list="fileList"
            >
              <div class="upload-icon">
                <svg-icon class="el-icon-upload" icon-class="add" />
                <div class="el-upload__text">{{ $t('navbar.license_tip1') }}<em>{{ $t('navbar.license_tip2') }}</em></div>
              </div>

              <!-- <el-button size="small" type="primary">{{ $t('hsr.window.password.upload') }}</el-button> -->
            </el-upload>
          </el-form-item>

        </el-form>

        <div class="license-button">
          <el-button type="primary" size="small" :disabled="saveDisable" @click="submitForm">{{ $t('navbar.active') }}</el-button>
          <!--          <el-button size="small" @click="close">{{ $t('operation.cancel') }}</el-button>-->
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { exportHdInfoApi, activateApi, getLicenseInfoApi } from '@/api/layout'
import { fileDownload } from '@/utils/file-download'

export default {
  data() {
    return {
      saveDisable: false,
      fileList: [],
    }
  },
  computed: {
    ...mapGetters([
      'showLicense'
    ])
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 获取系统授权信息
    getInfo() {
      getLicenseInfoApi().then(response => {
        if (response.data.auth_type !== 1) {
          if (response.data.auth_remain === 0) {
            this.$store.dispatch('app/setShowLicense', true)
          }
        }
      })
    },

    // 导出系统信息
    exportHd() {
      exportHdInfoApi().then(response => {
        fileDownload(response.data, 'hd_info.txt')
      }).finally(() => {

      })
    },
    close() {
      this.$store.dispatch('app/setShowLicense', false)
      this.$refs['ruleForm'].resetFields()
    },

    httpRequest(file) {
      var formData = new FormData()
      formData.append('file', file.file)
      this.saveDisable = true
      activateApi(formData).then(() => {
        this.$message({
          type: 'success',
          message: this.$t('operation.activeSuccess')
        })
        this.close()
      }).catch(err => {
        console.log(err)
      }).finally(() => {
        this.saveDisable = false
      })
    },

    submitForm() {
      this.$refs['file-upload'].submit()
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     changePassword({
      //       password: this.ruleForm.pass
      //     }).then(response => {
      //       if (response.success) {
      //         this.$message({
      //           type: 'success',
      //           message: this.$t('operation.confirmSuccess')
      //         })
      //         this.$store.dispatch('app/setShowPassword', false)
      //       }
      //     }).catch(err => {
      //       console.log(err)
      //     })
      //   } else {
      //     return false
      //   }
      // })
    },
  }
}
</script>

<style scoped>
.license-button{
  text-align: right;
}
.license-header{
  display: flex;
  align-items: center;
}
.license-img{
  width: 230px;
}
.license-img img{
  width: 210px;
}
.license-text1{
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 26px;
  color: #000E18;
  letter-spacing: 0;
  margin-bottom: 15px;
}
.license-text2{
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 16px;
  line-height: 22px;
  color: #404B52;
  letter-spacing: 0;
}
.export_hd{
  padding-top: 10px;
  cursor: pointer;
  margin: 10px 0;
  text-align: right;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 16px;
  color: #1890FF;
  letter-spacing: 0;
}
.upload-icon{
  padding: 0px;
}

.license{
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  font-size: 18px;
  color: #404B52;
  letter-spacing: 0;
  padding: 20px 0;
}
</style>

<style lang="scss">
.license-active{
  .el-upload{
    width:100%;
  }
  .el-upload-dragger{
    width: 100%;
  }
}
</style>
