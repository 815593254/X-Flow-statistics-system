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
        <!--<div>-->
        <!--  <el-button type="primary" size="small" @click="addData">新增</el-button>-->
        <!--</div>-->
        <!--<div class="icon-button delete-button" @click="deleteManyData">-->
        <!--  <el-tooltip class="item" effect="dark" content="批量删除" placement="top-start">-->
        <!--    <i class="el-icon-delete"></i>-->
        <!--  </el-tooltip>-->
        <!--</div>-->
        <div class="icon-button refresh-button" @click="settingScan()">
          <el-tooltip class="item" effect="dark" content="扫描配置" placement="top-start">
            <i class="el-icon-setting"></i>
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
        <el-table-column prop="dataSourceType" label="数据库类型" width="120" :formatter="row=>formatType(row,'dataSourceType')"></el-table-column>
        <el-table-column prop="status" label="扫描状态" width="130" :formatter="row=>formatType(row,'status')">
        </el-table-column>
        <el-table-column prop="createTime" label="开始扫描时间" width="180" :formatter="row=>formatType(row,'createTime')">
        </el-table-column>
        <el-table-column prop="operateTime" label="结束扫描时间" width="180" :formatter="row=>formatType(row,'operateTime')">
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{row}">
            <div class="table-button">
              <span v-permission="'3-1-scan'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="startScan(row)">开始扫描</el-button>
              </span>
              <span v-permission="'3-1-setting'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="settingScan(row)">扫描配置</el-button>
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
    <!--扫描配置弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="addSetting" class="add-form" :model="addSettingData" label-width="120px">
        <el-form-item label="自动扫描：" prop="status">
          <el-switch v-model="addSettingData.status" />
        </el-form-item>
<!--        <el-form-item class="cron_from_item" label="cron表达式：" prop="start_time">-->
<!--          <el-popover-->
<!--            placement="bottom"-->
<!--            width="400"-->
<!--            trigger="click"-->
<!--          >-->
<!--            <el-tabs v-model="activeName">-->
<!--              <el-tab-pane label="分" name="first">用户管理</el-tab-pane>-->
<!--              <el-tab-pane label="时" name="second">配置管理</el-tab-pane>-->
<!--              <el-tab-pane label="日" name="third">角色管理</el-tab-pane>-->
<!--              <el-tab-pane label="月" name="fourth">定时任务补偿</el-tab-pane>-->
<!--            </el-tabs>-->
<!--            <div class="cron_content" slot="reference">-->
<!--              click 激活-->
<!--              <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--            </div>-->
<!--          </el-popover>-->
<!--        </el-form-item>-->
        <el-form-item label="扫描周期：" prop="cycle">
          <el-select v-model="addSettingData.cycle" placeholder="请选择">
            <el-option label="天" value="day" />
            <el-option label="周" value="week" />
            <el-option label="月" value="month" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间：" prop="start_time">
          <el-time-picker v-model="addSettingData.start_time" value-format="timestamp" :picker-options="{selectableRange: '00:00:00 - 23:59:59'}" placeholder="请选择时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="采集行数：" prop="dataTaskSampling">
          <el-input v-model="addSettingData.dataTaskSampling" class="search_input" placeholder="请输入采集行数" />
        </el-form-item>
        <el-form-item label="保留行数：" prop="dataTaskSamplingSave">
          <el-input v-model="addSettingData.dataTaskSamplingSave" class="search_input" placeholder="请输入保留行数" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getScanList, startScan } from '@/api/classification-management/task-management'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import commonConfig from '@/utils/config'
import { getDBType } from '@/api/asset-management/database-asset'

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
      dialogTitle: '扫描配置',
      dialogVisible: false,
      addSettingData: {
        dataTaskSampling: 10,
        dataTaskSamplingSave: 5,
      },
      multipleSelection: [],
      taskProgressDict: commonConfig.state.taskProgress,
      activeName: 'first',
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
    startScan(row) {
      var params = {
        'dataSourceId': row.dataSourceId,
        'task': {
          'dataTaskSampling': this.addSettingData.dataTaskSampling,
          'dataTaskSamplingSave': this.addSettingData.dataTaskSamplingSave
        },
      }
      this.$message({
        type: 'success',
        message: '正在扫描中，请稍等'
      })
      startScan(params).then(() => {
        this.tbParam.tableData = []
        this.getList()
      }).catch(err => {
        console.log(err)
      })
    },
    settingScan(row) {
      console.log(row)
      if (row) {
        this.dialogVisible = true
      } else {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请选择要配置的行数'
          })
        } else {
          this.dialogVisible = true
        }
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
      getScanList(
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
    formatType(row, type) {
      if (type === 'dataSourceType') {
        for (var i = 0; i < this.dataSource.length; i++) {
          var item = this.dataSource[i]
          if (item.value === row.dataSourceType) {
            return item.name
          }
        }
        return ''
      } else if (type === 'status') {
        if (row.historyTasks && row.historyTasks.length > 0) {
          if (row.historyTasks[0].dataTaskProgress) {
            return this.taskProgressDict[row.historyTasks[0].dataTaskProgress]
          } else {
            return ''
          }
        } else {
          return ''
        }
      } else if (type === 'createTime') {
        if (row.historyTasks && row.historyTasks.length > 0) {
          return parseTime(row.historyTasks[0].createTime, '{y}-{m}-{d} {h}:{i}:{s}')
        } else {
          return ''
        }
      } else if (type === 'operateTime') {
        if (row.historyTasks && row.historyTasks.length > 0) {
          if (row.historyTasks[0].dataTaskProgress === 7 || row.historyTasks[0].dataTaskProgress === 4 || row.historyTasks[0].dataTaskProgress === 8) {
            return parseTime(row.historyTasks[0].operateTime, '{y}-{m}-{d} {h}:{i}:{s}')
          } else {
            return ''
          }
        } else {
          return ''
        }
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
    submitForm() {
      this.$message({
        type: 'success',
        message: '提交成功'
      })
      console.log(this.addSettingData)
      this.dialogVisible = false
      this.addSettingData = {
        dataTaskSampling: 10,
        dataTaskSamplingSave: 5,
      }
    },
  }
}
</script>

<style lang="scss">
.cron_from_item{
  .cron_content{
    position: relative;
    width: 100%;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    outline: none;
    padding: 0 30px 0 15px;
    box-sizing: border-box;
    color: #606266;
    height: 32px;
    line-height: 32px;
    .el-icon--right{
      position: absolute;
      right: 10px;
      top: 10px;
      color: #C0C4CC;
      font-size: 14px;
    }
  }

}
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
.add-form{
  padding-right: 25px;
}
</style>
