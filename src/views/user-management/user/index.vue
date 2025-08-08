<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="60px">
          <el-form-item label="用户名：">
            <el-input v-model="searchForm.systemUserNameLike" class="search_input" placeholder="用户名">
            </el-input>
          </el-form-item>
          <el-form-item label="所属用户组：" label-width="80px">
            <el-select v-model="searchForm.systemUserGroupId">
              <template v-for="item in userGroupList">
                <el-option :key="item.systemUserGroupId" :label="item.systemUserGroupName" :value="item.systemUserGroupId" />
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
          <el-button v-permission="'4-1-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <div v-permission="'4-1-delete'" class="icon-button delete-button" @click="deleteManyData">
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
        <el-table-column prop="systemUserName" label="用户名" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="systemUserState" label="用户状态" width="100">
          <template slot-scope="{row}">
            {{ row.systemUserState === 1 ? '正常': '锁定' }}
          </template>
        </el-table-column>
        <el-table-column prop="systemUserGroupName" label="所属用户组" min-width="150" :show-overflow-tooltip="true">
          .dsocSystemUserGroup
          <template slot-scope="{row}">
            {{ row.dsocSystemUserGroup.systemUserGroupName }}
          </template>
        </el-table-column>
        <el-table-column prop="last_login_time" label="最后登录时间" min-width="130" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.systemUserLastLoginTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="220">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'4-1-password'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="reset_passwort(row)">修改密码</el-button>
              </span>
              <span v-permission="'4-1-lock'" class="icon-button">
                <el-button v-if="row.systemUserState === 1" type="text" class="detail-btn" @click="lockData(row)">锁定</el-button>
                <el-button v-else type="text" class="detail-btn" @click="lockData(row)">解锁</el-button>
              </span>
              <span v-permission="'4-1-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <span v-permission="'4-1-delete'" class="icon-button">
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
    <el-dialog title="修改密码" :visible.sync="showPassword" width="500px" :close-on-click-modal="false">
      <el-form ref="ruleForm" :model="formData" status-icon :rules="addrules" label-width="100px" class="demo-ruleForm">
        <!--<el-form-item label="原密码：" prop="systemUserOldPwd">-->
        <!--  <el-input v-model="formData.systemUserOldPwd" type="password" autocomplete="off" />-->
        <!--</el-form-item>-->
        <el-form-item label="新密码：" prop="systemUserPwd">
          <el-input v-model="formData.systemUserPwd" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="systemUserConfirmPwd">
          <el-input v-model="formData.systemUserConfirmPwd" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item class="form-btn">
          <el-button type="primary" size="small" @click="submitForm('ruleForm')">确认</el-button>
          <el-button size="small" @click="showPassword=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--新增编辑弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="addrules" label-width="120px">
        <el-form-item label="用户名：" prop="systemUserName">
          <el-input v-model.trim="formData.systemUserName"></el-input>
        </el-form-item>
        <el-form-item v-if="!formData.systemUserId" label="密码：" prop="systemUserPwd">
          <el-input v-model.trim="formData.systemUserPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item v-if="!formData.systemUserId" label="确认密码：" prop="systemUserConfirmPwd">
          <el-input v-model.trim="formData.systemUserConfirmPwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="用户状态：" prop="systemUserState">
          <el-select v-model="formData.systemUserState">
            <el-option label="正常" :value="1" />
            <el-option label="锁定" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属用户组：" prop="systemUserGroupId">
          <el-select v-model="formData.systemUserGroupId">
            <template v-for="item in userGroupList">
              <el-option :key="item.systemUserGroupId" :label="item.systemUserGroupName" :value="item.systemUserGroupId" />
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
import { getUserList, userCreate, userUpdate, userDelete } from '@/api/user-management/user/index'
import { parseTime } from '@/utils'
// import { simpleValidatePassword, validatePassword } from '@/utils/validate'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { getUserGroupList } from '@/api/user-management/user-group'

export default {
  props: {
  },
  data() {
    var checkPassword = (rule, value, callback) => {
      // 编辑时，检查
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        // var result = this.pwdComplexity === 'complex' ? validatePassword(value) : simpleValidatePassword(value)
        // if (!result.success) {
        //   callback(new Error(result.msg))
        // }
        callback()
      }
    }
    var checkPassword2 = (rule, value, callback) => {
      // 编辑时且密码为空，不检查
      if (value === '') {
        callback(new Error('请输入确认密码'))
      }
      if (this.formData.systemUserPwd === '') {
        callback()
      } else {
        if (value !== this.formData.systemUserPwd) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      }
    }
    var checkUsername = (rule, value, callback) => {
      if (value === '') {
        callback('请输入用户名')
      } else {
        // if (!adminRe.test(value)) {
        //   callback(this.$t('valid.user.usernameDiff'))
        // }
      }
      callback()
    }
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
        systemUserNameLike: '',
        systemUserGroupId: '',
      },
      dataSource: [{ label: '全部数据库类型', value: '' }, { label: 'MYSQL', value: 1 }],
      isLoading: false,
      showPassword: false,
      showOldPassword: true,
      dialogTitle: '新增',
      dialogVisible: false,
      formData: {
        systemUserName: '',
        systemUserPwd: '',
        systemUserConfirmPwd: '',
        systemUserState: 1,
        systemUserGroupId: null,
      },
      addrules: {
        systemUserName: [{ required: true, validator: checkUsername, trigger: 'blur' }],
        systemUserPwd: [{ required: true, validator: checkPassword, trigger: 'blur' }],
        systemUserConfirmPwd: [{ required: true, validator: checkPassword2, trigger: 'blur' }],
        systemUserState: [{ required: true, message: '请选择用户状态', trigger: 'blur' }],
        systemUserGroupId: [{ required: true, message: '请选择所属用户组', trigger: 'blur' }],
      },
      isaddLoading: false,
      userGroupList: []
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
      this.getUserGroupList()
    }
  },
  mounted() {
    this.getList()
    this.getUserGroupList()
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
    getUserGroupList() {
      var params = {
        'page': {
          'pageNo': 0,
          'pageSize': 1000000
        },
      }
      getUserGroupList(
        params
      ).then(response => {
        this.userGroupList = response.body.results
      }).catch(err => {
        this.isLoading = false
        console.log(err)
      })
    },
    addData() {
      // this.$router.push({ path: '/user-management/user/new' })
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        systemUserName: '',
        systemUserPwd: '',
        systemUserConfirmPwd: '',
        systemUserState: 1,
        systemUserGroupId: null,
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/user-management/user/edit/' + row.id })
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = {
        systemUserId: row.systemUserId,
        systemUserName: row.systemUserName,
        systemUserState: row.systemUserState,
        systemUserGroupId: row.dsocSystemUserGroup.systemUserGroupId,
      }
    },
    reset_passwort(row) {
      this.showPassword = true
      this.formData = {
        systemUserId: row.systemUserId,
        systemUserName: row.systemUserName,
        systemUserState: row.systemUserState,
        systemUserGroupId: row.dsocSystemUserGroup.systemUserGroupId,
        systemUserOldPwd: '',
        systemUserPwd: '',
        systemUserConfirmPwd: '',
      }
    },
    lockData(row) {
      var submitData = {
        systemUserId: row.systemUserId,
        operateType: 3,
        systemUserState: row.systemUserState === 1 ? 0 : 1,
      }
      userUpdate(
        submitData
      ).then(() => {
        this.$message({
          type: 'success',
          message: row.systemUserState === 1 ? '锁定成功' : '解锁成功'
        })
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelete({
          systemUserId: row.systemUserId
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
            dataId_list.push(item.systemUserId)
          }
          userDelete({
            systemUserId: dataId_list.join(',')
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
      getUserList(
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
          var message = '新增成功'
          if (refForm === 'ruleForm') {
            this.formData.operateType = 2
            message = '修改密码成功'
          } else if (this.formData.systemUserId) {
            this.formData.operateType = 1
            message = '编辑成功'
          }
          this.isaddLoading = true
          var submitApi = this.formData.systemUserId ? userUpdate : userCreate
          submitApi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: message
            })
            this.getList()
            if (refForm === 'ruleForm') {
              this.showPassword = false
            } else {
              this.dialogVisible = false
            }
            this.isaddLoading = false
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
