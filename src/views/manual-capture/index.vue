<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="85px">
          <el-form-item label="抓包状态:">
            <el-select v-model="searchForm.captureRes" placeholder="请选择">
              <el-option label="全部" :value="null"> </el-option>
              <el-option label="已完成" value="1"> </el-option>
              <el-option label="未完成" value="0"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="抓包IP:">
            <el-input v-model="searchForm.ip" class="search_input" placeholder="抓包IP">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col class="right-form">
        <div>
          <el-button v-permission="'1-4-add'" type="primary" size="small" @click="addData">发起手动抓包</el-button>
        </div>
        <div v-permission="'1-4-delete'" class="icon-button delete-button" @click="deleteManyData">
          <el-tooltip class="item" effect="dark" content="批量删除" placement="top-start">
            <i class="el-icon-delete"></i>
          </el-tooltip>
        </div>
        <div class="icon-button refresh-button" @click="refresh">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
            <i class="el-icon-refresh"></i>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <div class="host-table">
      <!-- 表格 -->
      <el-table v-loading="isLoading" element-loading-background="rgba(255, 255, 255, .0)"
        element-loading-text="加载中，请稍后..." element-loading-spinner="el-icon-loading" :data="tbParam.tableData" border
        style="width: 100%" tooltip-effect="lights" header-cell-class-name="header-row"
        :empty-text="isLoading ? ' ' : ''" @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="40"> </el-table-column>
        <el-table-column type="index" label="序号" min-width="50"> </el-table-column>
        <el-table-column prop="ip" label="抓包IP" min-width="150"> </el-table-column>
        <el-table-column prop="file" label="抓包文件地址" min-width="500"></el-table-column>
        <el-table-column prop="captureRes" label="抓包状态" min-width="120">
          <template slot-scope="{row}">
            {{ row.captureRes == 0 ? '未完成' : '已完成' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="抓包时间" min-width="180">
          <template slot-scope="{row}">
            {{ parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="180">
          <template slot-scope="{row}">
            {{ parseTime(row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>

        <el-table-column :label="$t('common.operation')" min-width="220" fixed="right">
          <template slot-scope="{row}">
            <div class="table-button">
              <!-- <span v-permission="'1-4-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span> -->
              <span v-permission="'1-4-delete'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="deleteData(row)">删除</el-button>
              </span>
              <span v-permission="'1-4-down'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="downFile(row)">下载抓包文件</el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-content">
        <el-pagination :current-page.sync="tbParam.currentPage" :page-sizes="[20, 50, 100]"
          :page-size="tbParam.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tbParam.total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <!--新增编辑弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="IP：" prop="ip">
          <el-input v-model.trim="formData.ip"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="countVal">
          <el-input v-model.trim="formData.countVal"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" :loading="isaddLoading" @click="submitForm('addFormData')">确
          定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { sendDemand, getList, deleteData, getDetail, editData } from '@/api/manual-capture/index'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  props: {
  },
  data() {
    return {
      parseTime,
      searchKey: '',
      tbParam: {
        currentPage: 1,
        tableData: [],
        total: 0,
        pageSize: 20,
      },
      searchForm: {
        captureRes: '',
        ip: '',
      },
      dataSource: [],
      isLoading: false,
      multipleSelection: [],
      isaddLoading: false,
      dialogTitle: '手动抓包',
      dialogVisible: false,
      formData: {
        ip: '',
        countVal: ''
      },
      rules: {
        ip: [{ required: true, message: '请输入ip', trigger: 'blur' }],
        countVal: [{ required: true, message: '请输入数量', trigger: 'blur' }],
      },
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ])
  },
  watch: {
    $route() {
      this.getList()
    }
  },
  async mounted() {
    this.getList()
  },
  methods: {
    downFile(row) {
      window.open(row.file, '_blank');
    },

    // 处理多选框的值
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.tbParam.currentPage = 1
      this.tbParam.pageSize = val
      this.tbParam.tableData = []
      this.getList()
    },
    handleCurrentChange(val) {
      this.tbParam.currentPage = val
      this.tbParam.tableData = []
      this.getList()
    },
    addData() {
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        ip: '',
        countVal: ''
      }
    },
    eidtData(row) {
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = {
        ip: row.ip,
        countVal: row.countVal
      }
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(row).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).then(() => {
          this.tbParam.tableData = []
          this.getList()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    deleteManyData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要删除的行数'
        })
      } else {
        this.$confirm('确定要删除选中的数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var dataId_list = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            var item = this.multipleSelection[i]
            dataId_list.push(item.id)
          }
          deleteData({
            id: dataId_list.join(',')
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }).then(() => {
            this.tbParam.tableData = []
            this.getList()
          }).catch(err => {
            console.log(err)
          })
        })
      }
    },
    getList() {
      var params = {
        'page': {
          'pageNo': _.cloneDeep(this.tbParam.currentPage),
          'pageSize': this.tbParam.pageSize
        },
        "sorts": [
          {
            "index": 0,
            "property": "create_time",
            "direction": "desc"
          }
        ]
      }
      for (var key in this.searchForm) {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key]
        }
      }
      this.isLoading = true
      getList(
        params
      ).then(response => {
        this.tbParam.tableData = response.body.results
        this.tbParam.total = response.body.totalCount
        this.isLoading = false
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    refresh() {
      this.tbParam.tableData = []
      this.getList()
      this.$message({
        type: 'success',
        message: '刷新成功'
      })
    },
    searchData() {
      this.tbParam.tableData = []
      this.getList()
      this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    submitForm(refForm) {
      this.$refs[refForm].validate((valid) => {
        if (valid) {
          this.isaddLoading = true
          var userapi = this.formData['id'] ? editData : sendDemand
          userapi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.formData['id'] ? '编辑成功' : '发起手动抓包成功'
            })
            this.getList()
            this.dialogVisible = false
          }).catch(err => {
            console.log(err)
          }).finally(() => {
            this.isaddLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss"></style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
</style>
