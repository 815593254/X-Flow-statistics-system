<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="85px">
          <el-form-item label="数据库类型：">
            <el-select v-model="searchForm.dataSourceType" placeholder="请选择">
              <el-option label="全部" :value="null"> </el-option>
              <el-option v-for="item in dataSource" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据库名称：">
            <el-input v-model="searchForm.dataCharacterName" class="search_input" placeholder="数据库名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
        <div>
          <el-button v-permission="'2-1-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <div v-permission="'2-1-delete'" class="icon-button delete-button" @click="deleteManyData">
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
      <el-table
        v-loading="isLoading"
        element-loading-background="rgba(255, 255, 255, .0)"
        element-loading-text="加载中，请稍后..."
        element-loading-spinner="el-icon-loading"
        :data="tbParam.tableData"
        border
        style="width: 100%"
        tooltip-effect="lights"
        header-cell-class-name="header-row"
        :empty-text="isLoading?' ':''"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="dataSourceName" label="数据库名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataSourceType" label="数据库类型" width="120" :formatter="formatType"></el-table-column>
        <el-table-column prop="loginType" label="登录方式" width="120">
          <template slot-scope="">
            常规
          </template>
        </el-table-column>
        <el-table-column prop="loginType" label="连接状态" width="120" align="center">
          <template slot-scope="">
            <span class="connection_status">正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间" width="180" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'2-1-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <span v-permission="'2-1-delete'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="deleteData(row)">删除</el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-content">
        <el-pagination
          :current-page.sync="tbParam.currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="tbParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tbParam.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!--新增编辑弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="数据库名称：" prop="dataSourceName">
          <el-input v-model.trim="formData.dataSourceName"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型：" prop="dataSourceType">
          <el-select v-model="formData.dataSourceType">
            <el-option v-for="item in dataSource" :key="item.value" :label="item.name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="登录方式：" prop="loginType">
          <el-select v-model="formData.loginType">
            <el-option label="常规" value="1" />
            <el-option label="SSH" value="2" disabled />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库地址：" prop="dataSourceUrl">
          <el-input v-model.trim="formData.dataSourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="数据库端口：" prop="dataSourcePort">
          <el-input v-model.trim="formData.dataSourcePort"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="dataSourceUser">
          <el-input v-model.trim="formData.dataSourceUser"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="dataSourcePassword">
          <el-input v-model="formData.dataSourcePassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="schema：" prop="dataSourceSchema">
          <el-input v-model.trim="formData.dataSourceSchema"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" :loading="isaddLoading" @click="submitForm('addFormData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteData, deleteManyData, editData, createData, getDBType } from '@/api/asset-management/database-asset/index'
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
        dataSourceType: '',
        dataSourceName: '',
      },
      dataSource: [],
      isLoading: false,
      multipleSelection: [],
      isaddLoading: false,
      dialogTitle: '新增',
      dialogVisible: false,
      formData: {
        loginType: '1',
        dataSourceType: 1,
        dataSourcePort: 3306,
        dataSourceName: '',
        dataSourceUrl: '',
        dataSourceUser: '',
        dataSourcePassword: '',
        dataSourceSchema: '',
      },
      rules: {
        dataSourceType: [{ required: true, message: '请选择数据库类型', trigger: 'blur' }],
        dataSourceName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
        dataSourceUrl: [{ required: true, message: '请输入数据库地址', trigger: 'blur' }],
        dataSourceUser: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        dataSourcePassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
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
      this.getDBType()
      this.getList()
    }
  },
  async mounted() {
    await this.getDBType()
    this.getList()
  },
  methods: {
    // 获取数据库类型数据
    getDBType() {
      getDBType().then(response => {
        this.dataSource = response.body.sourceType
      }).catch(err => {
        console.log(err)
      })
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
      // this.$router.push({ path: '/asset-management/database-asset/new' })
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        loginType: '1',
        dataSourceType: 1,
        dataSourcePort: 3306,
        dataSourceName: '',
        dataSourceUrl: '',
        dataSourceUser: '',
        dataSourcePassword: '',
        dataSourceSchema: '',
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/asset-management/database-asset/edit/' + row.dataSourceId })
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      var dataSourceUrl_list = row.dataSourceUrl.split(':')
      var dataSourceAuth_list = row.dataSourceAuth.split(':')
      this.formData = {
        dataSourceId: row.dataSourceId,
        dataSourceName: row.dataSourceName,
        loginType: '1',
        dataSourceType: row.dataSourceType,
        dataSourceSchema: row.dataSourceSchema,
        dataSourceUrl: dataSourceUrl_list[0],
        dataSourcePort: dataSourceUrl_list.length === 2 ? parseInt(dataSourceUrl_list[1]) : 3306,
        dataSourceUser: dataSourceAuth_list[0],
        dataSourcePassword: dataSourceAuth_list.length === 2 ? dataSourceAuth_list[1] : '',
      }
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData({
          dataSourceId: row.dataSourceId
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
            dataId_list.push(item.dataTemplateId)
          }
          deleteManyData({
            dataSourceId: dataId_list.join(',')
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
    formatType(row) {
      for (var i = 0; i < this.dataSource.length; i++) {
        var item = this.dataSource[i]
        if (item.value === row.dataSourceType) {
          return item.name
        }
      }
      return ''
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
          this.formData['dataSourceUrl'] = this.formData['dataSourceUrl'] + ':' + this.formData['dataSourcePort']
          this.formData['dataSourceAuth'] = this.formData['dataSourceUser'] + ':' + this.formData['dataSourcePassword']
          if (!this.formData['dataSourceSchema'] || this.formData['dataSourceSchema'] === '') {
            this.formData['dataSourceSchema'] = this.formData['dataSourceName']
          }
          var userapi = this.formData['dataSourceId'] ? editData : createData
          userapi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.formData['dataSourceId'] ? '编辑成功' : '新增成功'
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

<style lang="scss">
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
</style>
