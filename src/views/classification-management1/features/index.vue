<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="80px">
          <el-form-item label="识别方法：">
            <el-select v-model="searchForm.dataCharacterType" placeholder="请选择识别方法">
              <el-option label="全部" :value="null"> </el-option>
              <el-option v-for="item in dataCharacter" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="特征名称：">
            <el-input v-model="searchForm.dataCharacterName" class="search_input" placeholder="请输入特征名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
        <div>
          <el-button v-permission="'3-3-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <div v-permission="'3-3-delete'" class="icon-button delete-button" @click="deleteManyData">
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
    <div class="host-table reset_host_table">
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
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
        <el-table-column prop="dataCharacterName" label="特征项名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataCharacterDesc" label="特征项描述" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataCharacterType" label="识别方法" width="120" :formatter="formatType"></el-table-column>
        <el-table-column prop="dataCharacterBody" label="特征项主体内容" min-width="200" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="operateTime" label="操作时间" width="160" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="120">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'3-3-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <span v-permission="'3-3-delete'" class="icon-button">
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="特征项名称：" prop="dataCharacterName">
          <el-input v-model.trim="formData.dataCharacterName"></el-input>
        </el-form-item>
        <el-form-item label="特征项描述：" prop="dataCharacterDesc">
          <el-input v-model.trim="formData.dataCharacterDesc"></el-input>
        </el-form-item>
        <el-form-item label="识别方法：" prop="dataCharacterType">
          <el-row :gutter="20" type="flex">
            <el-col :span="8">
              <el-select v-model="formData.dataCharacterType" placeholder="请选择">
                <el-option v-for="item in dataCharacter" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-col>
            <el-col :span="16">
              <el-input v-model.trim="formData.dataCharacterBody" placeholder="请输入匹配内容"></el-input>
            </el-col>
          </el-row>
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
import {
  getCharacterList,
  deleteCharacterData,
  deleteCharacterManyData,
  editCharacterData, createCharacterData
} from '@/api/classification-management/features/index'
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
        dataCharacterType: '',
      },
      dataCharacter: [{ label: '包含关键字', value: 1 }, { label: '不包含关键字', value: 2 }, { label: '正则表达式', value: 3 }],
      isLoading: false,
      multipleSelection: [],
      isaddLoading: false,
      dialogTitle: '新增',
      dialogVisible: false,
      formData: {
        dataCharacterName: '',
        dataCharacterDesc: '',
        dataCharacterBody: '',
        dataCharacterType: 1,
      },
      rules: {
        dataCharacterName: [{ required: true, message: '请输入特征项名称', trigger: 'blur' }],
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
  mounted() {
    this.getList()
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
      // this.$router.push({ path: '/classification-management/features/new' })
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        dataCharacterName: '',
        dataCharacterDesc: '',
        dataCharacterBody: '',
        dataCharacterType: 1,
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/classification-management/features/edit/' + row.dataCharacterId })
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = {
        dataCharacterId: row.dataCharacterId,
        dataCharacterName: row.dataCharacterName,
        dataCharacterDesc: row.dataCharacterDesc,
        dataCharacterBody: row.dataCharacterBody,
        dataCharacterType: row.dataCharacterType,
      }
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCharacterData({
          dataCharacterId: row.dataCharacterId
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
          var dataCharacterId_list = []
          for (var i = 0; i < this.multipleSelection.length; i++) {
            var item = this.multipleSelection[i]
            dataCharacterId_list.push(item.dataCharacterId)
          }
          deleteCharacterManyData({
            dataCharacterId: dataCharacterId_list.join(',')
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
      getCharacterList(
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
      if (row.dataCharacterType) {
        var label = ''
        for (var i = 0; i < this.dataCharacter.length; i++) {
          var item = this.dataCharacter[i]
          if (item.value === row.dataCharacterType) {
            label = item.label
            break
          }
        }
        return label
      }
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
          var userapi = this.formData['dataCharacterId'] ? editCharacterData : createCharacterData
          userapi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.formData['dataCharacterId'] ? '编辑成功' : '新增成功'
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
