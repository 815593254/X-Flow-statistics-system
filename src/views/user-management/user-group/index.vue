<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="80px">
          <el-form-item label="用户组名称：">
            <el-input v-model="searchForm.systemUserGroupNameLike" class="search_input" placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item label="用户组状态：">
            <el-select v-model="searchForm.systemUserGroupState">
              <template v-for="item in stateList">
                <el-option :key="item.value" :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
        <div>
          <el-button v-permission="'4-3-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <div v-permission="'4-3-delete'" class="icon-button delete-button" @click="deleteManyData">
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
        <el-table-column prop="systemUserGroupName" label="用户组名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="systemUserGroupDesc" label="用户组描述" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="systemUserGroupState" label="用户组状态" width="100" :formatter="row=>formatTable(row,'systemUserGroupState')"></el-table-column>
        <el-table-column prop="systemRoleId" label="用户组角色" min-width="200" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <el-tag v-for="item in row.systemRoles" :key="item.systemRoleId" size="small" style="margin-right: 5px;">{{ item.systemRoleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间" width="180" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="110">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'4-3-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <span v-permission="'4-3-delete'" class="icon-button">
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
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="addrules" label-width="120px">
        <el-form-item label="用户组名称：" prop="systemUserGroupName">
          <el-input v-model="formData.systemUserGroupName"></el-input>
        </el-form-item>
        <el-form-item label="用户组描述：" prop="systemUserGroupDesc">
          <el-input v-model="formData.systemUserGroupDesc"></el-input>
        </el-form-item>
        <el-form-item label="用户组状态：" prop="systemUserGroupState">
          <el-select v-model="formData.systemUserGroupState">
            <template v-for="item in stateList">
              <el-option :key="item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="用户组角色：" prop="systemRoleId">
          <el-select v-model="formData.systemRoleIdList" multiple>
            <template v-for="item in rolesList">
              <el-option :key="item.systemRoleId" :label="item.systemRoleName" :value="item.systemRoleId" />
            </template>
          </el-select>
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
import { getUserGroupList, userGroupCreate, userGroupUpdate, userGroupDelete } from '@/api/user-management/user-group/index'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { getRoleList } from '@/api/user-management/role'

export default {
  props: {
  },
  data() {
    return {
      parseTime,
      obj_id: '',
      searchKey: '',
      tbParam: {
        currentPage: 1,
        tableData: [],
        total: 0,
        pageSize: 20,
      },
      searchForm: {
        systemUserGroupNameLike: null,
        systemUserGroupState: null,
      },
      dataSource: [{ label: '全部数据库类型', value: '' }, { label: 'MYSQL', value: 1 }],
      isLoading: false,
      showPassword: false,
      ruleForm: {
        old_password: '',
        new_password: '',
        checkPass: '',
      },
      showOldPassword: true,
      dialogTitle: '新增',
      dialogVisible: false,
      formData: {
        systemUserGroupName: '',
        systemUserGroupDesc: '',
        systemUserGroupState: 1,
        systemRoleIdList: [],
      },
      addrules: {
        systemUserGroupName: [{ required: true, message: '请输入用户组名称', trigger: 'blur' }],
        systemUserGroupState: [{ required: true, message: '请选择用户组状态', trigger: 'blur' }],
        systemRoleIdList: [{ required: true, message: '请选择用户组角色', trigger: 'blur' }],
      },
      stateList: [{ label: '正常', value: 1 }, { label: '冻结', value: 0 }],
      isaddLoading: false,
      rolesList: [],
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
      this.getRoleList()
    }
  },
  mounted() {
    this.getList()
    this.getRoleList()
  },
  methods: {
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
    getRoleList() {
      var params = {
        'page': {
          'pageNo': 1,
          'pageSize': 1000000
        },
      }
      getRoleList(
        params
      ).then(response => {
        this.rolesList = response.body.results
      }).catch(err => {
        console.log(err)
      })
    },
    addData() {
      this.obj_id = null
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        systemUserGroupName: '',
        systemUserGroupDesc: '',
        systemUserGroupState: 1,
        systemRoleIdList: [],
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/user-management/user/edit/' + row.id })
      this.obj_id = row.systemUserGroupId
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = {
        systemUserGroupName: row.systemUserGroupName,
        systemUserGroupDesc: row.systemUserGroupDesc,
        systemUserGroupState: row.systemUserGroupState,
        systemRoleIdList: [],
      }
      row.systemRoles.forEach(item => {
        this.formData.systemRoleIdList.push(item.systemRoleId)
      })
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userGroupDelete({
          systemUserGroupId: row.systemUserGroupId
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
            dataId_list.push(item.systemUserGroupId)
          }
          userGroupDelete({
            systemUserGroupId: dataId_list.join(',')
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
      getUserGroupList(
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
          if (this.obj_id) {
            this.formData['systemUserGroupId'] = this.obj_id
          } else {
            this.formData['systemUserGroupId'] = null
          }
          this.formData.systemRoleId = this.formData.systemRoleIdList.join(',')
          var submitApi = this.obj_id ? userGroupUpdate : userGroupCreate
          submitApi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.obj_id ? '编辑成功' : '新增成功'
            })
            this.isaddLoading = false
            this.dialogVisible = false
            this.getList()
          }).catch(err => {
            console.log(err)
            this.isaddLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formatTable(row, type) {
      var forList
      if (type === 'systemUserGroupState') {
        forList = this.stateList
      }
      for (var i = 0; i < forList.length; i++) {
        var item = forList[i]
        if (item.value === row[type]) {
          return item.label
        }
      }
      return ''
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
