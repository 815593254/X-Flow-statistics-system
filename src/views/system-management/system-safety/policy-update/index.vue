<template>
  <div class="tab_main_content">
    <span class="form-title">规则更新</span>
    <el-divider></el-divider>
    <div style="margin: 20px;">
      <div class="form-title" style="margin: 20px 0">最近更新时间：{{ rule_update_time }}</div>

      <!-- 防护规则更新 -->
      <el-upload
        ref="rule_update_upload"
        action=""
        :file-list="uploadFileList"
        :auto-upload="false"
        :http-request="ruleHttpRequest"
        :limit="1"
      >
        <el-button slot="trigger" size="small" type="primary">上传</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="ruleUpload">升级</el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { ruleUpdateGet, ruleUpdateImport } from '@/api/system-management/system-safety'
import { parseTime } from '@/utils'
// import { logSave } from '@/api/system-management'

export default {
  data() {
    return {
      uploadFileList: [], // 上传文件列表
      rule_update_time: '', // 安全规则更新时间
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    getConfig() {
      ruleUpdateGet()
        .then(response => {
          this.rule_update_time = response.data.rule_update_time ? parseTime(response.data.rule_update_time) : ''
        })
    },
    // 上传规则更新文件函数
    ruleHttpRequest(file) {
      var formData = new FormData()
      formData.append('file', file.file)
      this.uploadDisable = true
      ruleUpdateImport(formData).then(() => {
        this.$message.success('升级成功')
        this.getConfig()
        this.uploadFileList = []
      }).catch(err => {
        this.$message.error(err.response.data.message)
      }).finally(() => {
        this.uploadDisable = false
      })
    },

    // 点击更新规则按钮
    ruleUpload() {
      this.$refs.rule_update_upload.submit()
    },
  },
}
</script>

<style lang="scss" scoped>
.tab_main_content {
  padding: 30px;
}
</style>
