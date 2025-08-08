<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" class="search_form_data" :inline="true" label-position="left" label-width="80px">
          <el-form-item label="级别组名称：">
            <el-select v-model="searchForm.dataLevelGroupId" placeholder="请选择" @change="getList">
              <el-option v-for="item in levelGroupList" :key="item.dataLevelGroupId" :label="item.dataLevelGroupName" :value="item.dataLevelGroupId">
                <span>{{ item.dataLevelGroupName }}</span>
                <span class="deleteLevelGroup" @click.stop="deleteLevelGroup(item.dataLevelGroupId)"><i class="el-icon-delete"></i></span>
              </el-option>
              <div class="addLevelGroup">
                <el-button v-if="showAddLevelGroup" type="text" size="small" @click="addLevelGroup">-------- 新增 --------</el-button>
                <el-input v-else v-model.trim="searchForm.dataLevelGroupName" placeholder="级别组名称,按回车键添加" @keyup.enter.native="submitLevelGroup"></el-input>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="级别名称：">
            <el-input v-model="searchForm.dataLevelName" placeholder="请输入级别名称"></el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
        <div>
          <el-button v-permission="'3-4-add'" type="primary" size="small" @click="addData">新增</el-button>
        </div>
        <!--<div class="icon-button delete-button" @click="deleteManyData">-->
        <!--  <el-tooltip class="item" effect="dark" content="批量删除" placement="top-start">-->
        <!--    <i class="el-icon-delete"></i>-->
        <!--  </el-tooltip>-->
        <!--</div>-->
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
      >
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="dataLevelName" label="级别名称" min-width="100" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataLevelDesc" label="级别描述" min-width="220" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataLevelWeight" label="级别权重" width="100"> </el-table-column>
        <el-table-column prop="dataLevelName" label="标签颜色" width="130">
          <template slot-scope="{row}">
            <div class="level_label_color">
              <span :style="'background-color:' + row.dataLevelColor"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="操作时间" width="180" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="100">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'3-4-edit'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="eidtData(row)">编辑</el-button>
              </span>
              <!--<span class="icon-button">-->
              <!--  <el-button type="text" class="detail-btn" @click="deleteData(row)">删除</el-button>-->
              <!--</span>-->
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="级别名称：" prop="dataLevelName">
          <el-input v-model.trim="formData.dataLevelName"></el-input>
        </el-form-item>
        <el-form-item label="级别描述：" prop="dataLevelDesc">
          <el-input v-model.trim="formData.dataLevelDesc"></el-input>
        </el-form-item>
        <el-form-item label="级别权重：" prop="dataLevelWeight">
          <el-input v-model.number="formData.dataLevelWeight"></el-input>
        </el-form-item>
        <el-form-item label="级别颜色：" prop="dataLevelColor">
          <el-color-picker v-model="formData.dataLevelColor" color-format="hex" size="medium"></el-color-picker>
        </el-form-item>
        <el-form-item label="关联级别组：" prop="dataLevelGroupId">
          <el-select v-model="searchForm.dataLevelGroupId" disabled>
            <el-option v-for="item in levelGroupList" :key="item.dataLevelGroupId" :label="item.dataLevelGroupName" :value="item.dataLevelGroupId" />
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
import {
  createLevelData,
  deleteLevelData,
  editLevelData,
  getLevelList,
  getLevelGroupList,
  createLevelGroupData,
  deleteLevelGroupData
} from '@/api/classification-management/level-management/index'
import { getTemplateList } from '@/api/classification-management/template-management'
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
        dataLevelGroupName: '',
        dataLevelName: '',
        dataLevelGroupId: null,
      },
      isLoading: false,
      isaddLoading: false,
      dataTemplate: [],
      dialogTitle: '新增',
      dialogVisible: false,
      formData: {
        dataLevelName: '',
        dataLevelDesc: '',
        dataLevelGroupId: '',
        dataLevelColor: '#00CC00',
        dataLevelWeight: 0,
      },
      rules: {
        dataLevelName: [{ required: true, message: '请输入级别名称', trigger: 'blur' }],
        dataLevelWeight: [{ type: 'number', required: true, message: '请输入级别权重', trigger: 'blur' }],
        dataLevelGroupId: [{ required: true, message: '请选择级别组', trigger: 'blur' }],
        dataLevelColor: [{ required: true, message: '请选择数据级别', trigger: 'blur' }],
      },
      levelGroupList: [],
      showAddLevelGroup: true,
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
    await this.getLevelGroupList()
    await this.getList()
  },
  methods: {
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
    // 获取关联模板内容
    getTemplateList() {
      getTemplateList(
        {
          'page': {
            'pageNo': 0,
            'pageSize': 10000000
          },
        }
      ).then(response => {
        this.dataTemplate = response.body.results
      }).catch(err => {
        console.log(err)
      })
    },
    addData() {
      // this.$router.push({ path: '/classification-management/level/new' })
      this.dialogTitle = '新增'
      this.dialogVisible = true
      this.formData = {
        dataLevelName: '',
        dataLevelDesc: '',
        dataLevelGroupId: '',
        dataLevelColor: '#00CC00',
        dataLevelWeight: 0,
      }
    },
    eidtData(row) {
      // this.$router.push({ path: '/classification-management/level/edit/' + row.dataLevelId })
      console.log(row)
      this.dialogTitle = '编辑'
      this.dialogVisible = true
      this.formData = {
        dataLevelId: row.dataLevelId,
        dataLevelName: row.dataLevelName,
        dataLevelDesc: row.dataLevelDesc,
        dataLevelGroupId: row.dataLevelGroupId ? row.dataLevelGroupId.toString() : '',
        dataLevelColor: row.dataLevelColor,
        dataLevelWeight: row.dataLevelWeight,
      }
    },
    deleteData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLevelData({
          dataLevelId: row.dataLevelId
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
    deleteManyData(row) {
      this.$confirm('确定要删除选中的数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLevelData({
          obj_id: row._id
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
      getLevelList(
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
          var userapi = this.formData.dataLevelId ? editLevelData : createLevelData
          userapi(
            this.formData
          ).then(() => {
            this.$message({
              type: 'success',
              message: this.formData.dataLevelId ? '编辑成功' : '创建成功'
            })
            this.dialogVisible = false
            this.getList()
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
    getLevelGroupList() {
      var params = {
        'page': {
          'pageNo': 1,
          'pageSize': 0
        },
      }
      getLevelGroupList(
        params
      ).then(response => {
        this.levelGroupList = response.body.results
        if (this.levelGroupList && this.levelGroupList.length > 0) {
          this.searchForm.dataLevelGroupId = this.levelGroupList[0].dataLevelGroupId
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addLevelGroup() {
      this.showAddLevelGroup = false
    },
    deleteLevelGroup(dataLevelGroupId) {
      deleteLevelGroupData({
        dataLevelGroupId: dataLevelGroupId
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).then(() => {
        this.getLevelGroupList()
      }).catch(err => {
        console.log(err)
      })
    },
    submitLevelGroup() {
      if (this.searchForm.dataLevelGroupName) {
        createLevelGroupData({
          dataLevelGroupName: this.searchForm.dataLevelGroupName
        }).then(() => {
          this.getLevelGroupList()
          this.showAddLevelGroup = true
          this.searchForm.dataLevelGroupName = ''
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.showAddLevelGroup = true
      }
    },
  }
}
</script>

<style lang="scss">
.add_form_data{
  width: 100%;
  padding-right: 20px;
  .el-color-picker--medium{
    width: 100% !important;
    .el-color-picker__trigger{
      width: 100% !important;
    }
  }
  .el-select{
    width: 100% !important;
  }
}
.search_form_data{
  .el-form-item--medium .el-form-item__label{
    white-space: nowrap !important;
  }
}
.deleteLevelGroup{
  position: absolute;
  right: 10px;
  color: red;
}
.addLevelGroup{
  padding: 5px 5px 0 5px;
  .el-input__inner{
    width: 200px !important;
  }
}
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
</style>
