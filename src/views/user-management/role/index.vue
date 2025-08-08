<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="60px">
          <el-form-item label="角色名：">
            <el-input v-model="searchForm.systemRoleNameLike" class="search_input" placeholder="请输入角色名">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
        <div>
          <el-button v-permission="'4-2-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <div v-permission="'4-2-delete'" class="icon-button delete-button" @click="deleteManyData">
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
        <el-table-column prop="systemRoleName" label="角色名" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="systemRoleDesc" label="说明" min-width="150"> </el-table-column>
        <el-table-column prop="systemRoleType" label="角色类型" min-width="150" :formatter="row=>formatTable(row,'systemRoleType')"></el-table-column>
        <el-table-column prop="systemRoleState" label="角色状态" min-width="150" :formatter="row=>formatTable(row,'systemRoleState')"></el-table-column>
        <el-table-column prop="operateTime" label="创建时间" width="180" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="180">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'4-2-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <span v-permission="'4-2-delete'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="deleteData(row)">删除</el-button>
              </span>
              <span v-permission="'4-2-permission'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="permissionData(row)">权限</el-button>
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
    <!-- 角色权限 -->
    <el-dialog title="角色权限" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
      <TreeTable :menu-data="roleMenuData" :cur-permission="cur_permission" @changePermission="changePermission" />
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" :loading="permissionLoading" @click="updatePermission">保存</el-button>
      </div>
    </el-dialog>
    <!--新增编辑弹窗-->
    <el-dialog :title="addDialogTitle" :visible.sync="addDialogVisible" width="600px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="角色名：" prop="systemRoleName">
          <el-input v-model.trim="formData.systemRoleName"></el-input>
        </el-form-item>
        <el-form-item label="角色说明：" prop="systemRoleDesc">
          <el-input v-model.trim="formData.systemRoleDesc"></el-input>
        </el-form-item>
        <el-form-item label="角色类型：" prop="systemRoleType">
          <el-select v-model="formData.systemRoleType">
            <template v-for="item in systemRoleTypeList">
              <el-option :key="item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态：" prop="systemRoleState">
          <el-select v-model="formData.systemRoleState">
            <template v-for="item in systemRoleStateList">
              <el-option :key="item.value" :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <p class="span_tips">提示：非管理员角色需要在列表页给角色分配菜单权限</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" :loading="isaddLoading" @click="submitForm('addFormData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, roleCreate, roleUpdate, roleDelete } from '@/api/user-management/role/index'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import TreeTable from '@/components/TreeTable'

export default {
  components: {
    TreeTable
  },
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
        systemRoleNameLike: null,
      },
      isLoading: false,
      multipleSelection: [],
      dialogVisible: false,
      permissionLoading: false,
      roleMenuData: [],
      cur_permission: [],
      obj_id: '',
      addDialogTitle: '新增',
      addDialogVisible: false,
      systemRoleTypeList: [{ label: '管理员', value: 1 }, { label: '普通角色', value: 2 }, { label: '其他', value: 3 }],
      systemRoleStateList: [{ label: '正常', value: 1 }, { label: '冻结', value: 0 }],
      formData: {
        systemRoleName: '',
        systemRoleDesc: '',
        systemRoleType: 2,
        systemRoleState: 1,
      },
      rules: {
        systemRoleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        systemRoleType: [{ required: true, message: '请选择角色类型', trigger: 'blur' }],
        systemRoleState: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
      },
      isaddLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ])
  },
  watch: {
    '$store.getters.menuData'() {
      this.menuData = this.$store.getters.menuData
      this.roleMenuData = this.filterMenuData(this.menuData)
    },
    $route() {
      this.getList()
    }
  },
  mounted() {
    this.menuData = this.$store.getters.menuData
    this.getList()
    this.roleMenuData = this.filterMenuData(this.menuData)
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
    addData() {
      // this.$router.push({ path: '/user-management/role/new' })
      this.obj_id = null
      this.addDialogTitle = '新增'
      this.addDialogVisible = true
      this.formData = {
        systemRoleName: '',
        systemRoleDesc: '',
        systemRoleType: 2,
        systemRoleState: 1,
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/user-management/role/edit/' + row.id })
      this.obj_id = row.systemRoleId
      this.addDialogTitle = '编辑'
      this.addDialogVisible = true
      this.formData = {
        systemRoleName: row.systemRoleName,
        systemRoleDesc: row.systemRoleDesc,
        systemRoleType: row.systemRoleType,
        systemRoleState: row.systemRoleState,
      }
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roleDelete({
          systemRoleId: row.systemRoleId
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
            dataId_list.push(item.systemRoleId)
          }
          roleDelete({
            systemRoleId: dataId_list.join(',')
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
    permissionData(row) {
      // this.roleMenuData = []
      this.obj_id = row.systemRoleId
      this.cur_permission = row.systemRolePermission ? row.systemRolePermission.split(',') : []
      this.dialogVisible = true
    },
    getList() {
      this.isLoading = true
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
      getRoleList(
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
      this.tbParam.total = 0
      this.getList()
      this.$message({
        type: 'success',
        message: '刷新成功'
      })
    },
    searchData() {
      this.tbParam.tableData = []
      this.tbParam.total = 0
      this.getList()
      this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    changePermission(cur_permission) {
      this.cur_permission = cur_permission
    },
    filterMenuData(routes) {
      var res = []
      routes.forEach(route => {
        var tmp = { ...route }
        if (tmp.children) {
          tmp.children = this.filterMenuData(tmp.children)
        }
        if (tmp.meta.number && !tmp.hidden) {
          if (tmp.meta.permission) {
            tmp.children = []
            tmp.meta.permission.forEach(t => {
              tmp.children.push({ meta: t })
            })
          }
          res.push(tmp)
        }
      })
      return res
    },
    submitForm(refForm) {
      this.$refs[refForm].validate((valid) => {
        if (valid) {
          if (this.obj_id) {
            this.formData['systemRoleId'] = this.obj_id
          } else {
            this.formData['systemRoleId'] = null
          }
          var submitapi = this.obj_id ? roleUpdate : roleCreate
          submitapi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.obj_id ? '编辑成功' : '新增成功'
            })
            this.getList()
            this.addDialogVisible = false
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    updatePermission() {
      roleUpdate({
        systemRoleId: this.obj_id,
        systemRolePermission: this.cur_permission.join(',')
      }).then(() => {
        this.$message({
          type: 'success',
          message: '编辑权限成功'
        })
        this.getList()
        this.dialogVisible = false
      }).catch(err => {
        console.log(err)
      })
    },
    formatTable(row, type) {
      var forList
      if (type === 'systemRoleType') {
        forList = this.systemRoleTypeList
      } else if (type === 'systemRoleState') {
        forList = this.systemRoleStateList
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
