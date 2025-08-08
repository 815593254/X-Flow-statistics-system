<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="85px">
          <el-form-item label="数据库类型：">
            <el-select v-model="searchForm.dataSourceType" placeholder="选择数据库类型">
              <el-option label="全部" :value="null"> </el-option>
              <el-option v-for="item in dataSource" :key="item.value" :label="item.name" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属数据库：">
            <el-select v-model="searchForm.dataSourceId" placeholder="选择所属数据库">
              <el-option label="全部" :value="null"> </el-option>
              <el-option v-for="item in allDatabase" :key="item.dataSourceId" :label="item.dataSourceName" :value="item.dataSourceId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字段名称：" label-width="75px">
            <el-input v-model="searchForm.dataStructureName" class="search_input" placeholder="请输入字段名称">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col class="right-form">
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
        <el-table-column prop="dataStructureName" label="字段名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataStructureTable" label="所属表名" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataSourceName" label="所属数据库" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataSourceType" label="数据库类型" width="100" :formatter="formatType"></el-table-column>
        <el-table-column prop="dataStructureDsocTypeName" label="类别" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="dataStructureDsocLevelName" label="级别" min-width="120">
          <template slot-scope="{row}">
            <div class="level_label_color data_level">
              <span :style="'background-color:' + row.dataStructureDsocLevelColor">{{ row.dataStructureDsocLevelName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dataStructureDsocCharacterName" label="命中特征项" min-width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="dataSourceUrl" label="扫描方式" width="120">
          <template slot-scope="">
            {{ '手动扫描' }}
          </template>
        </el-table-column>
        <el-table-column prop="operateTime" label="扫描时间" width="180" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
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
  </div>
</template>

<script>
import { getStructureList } from '@/api/data-analysis/classification-retrieval/index'
import { getDBType, getList } from '@/api/asset-management/database-asset'
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
        dataSourceId: '',
        dataSourceType: '',
        dataStructureName: '',
      },
      dataSource: [],
      isLoading: false,
      allDatabase: [],
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
    this.getAllDatabase()
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
    getList() {
      var params = {
        'dataStructureDsocTypeExist': 1,
        'obsolete': 1,
        'dataStructureType': 3,
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
      getStructureList(
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
    getAllDatabase() {
      var params = {
        'page': {
          'pageNo': 1,
          'pageSize': 1000000
        },
      }
      getList(
        params
      ).then(response => {
        this.allDatabase = response.body.results
      }).catch(err => {
        console.log(err)
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
