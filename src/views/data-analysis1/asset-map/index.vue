<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="85px">
          <el-form-item label="数据库类型：">
            <el-select v-model="searchForm.dataSourceType" placeholder="请选择数据类型">
              <el-option label="全部" :value="null"> </el-option>
              <el-option v-for="item in dataSource" :key="item.value" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="级别名称：" label-width="75px">
            <el-input v-model="searchForm.dataLevelName" class="search_input" placeholder="请输入级别名称"></el-input>
          </el-form-item>
          <el-form-item label="数据库名称：">
            <el-input v-model="searchForm.dataSourceName" class="search_input" placeholder="数据库名称"></el-input>
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
        ref="table"
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
        @expand-change="tableExpandChange"
      >
        <el-table-column v-show="false" type="expand" width="1">
          <template slot-scope="{row}">
            <div class="table_tab">
              <el-tabs value="first">
                <el-tab-pane label="分级分类" name="first">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <div class="reset_el_col">
                        <div :id="'category_'+row.dataSourceId" style="width: 100%;height: 100%;"></div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="reset_el_col">
                        <div :id="'level_'+row.dataSourceId" style="width: 100%;height: 100%;"></div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="reset_el_col">
                        <div :id="'bar_'+row.dataSourceId" style="width: 100%;height: 100%;"></div>
                      </div>
                    </el-col>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="账号权限" name="second">
                  <el-table :data="row.account_anthority" border max-height="240px" style="width: 100%">
                    <el-table-column prop="username" label="用户名" width="200"></el-table-column>
                    <el-table-column prop="anthority" label="权限" min-width="180"></el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="扫描记录" name="third">
                  <el-table :data="row.historyTasks" border max-height="240px" style="width: 100%">
                    <el-table-column prop="type" label="扫描类型" min-width="120"></el-table-column>
                    <el-table-column prop="status" label="扫描状态" min-width="130" :formatter="formatStatus">
                    </el-table-column>
                    <el-table-column prop="createTime" label="开始扫描时间" min-width="180" :formatter="formatCreateTime">
                    </el-table-column>
                    <el-table-column prop="operateTime" label="结束扫描时间" min-width="180" :formatter="formatOperateTime">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="设备信息" name="fourth">
                  <div class="device_info">
                    <div :id="'device_'+row.dataSourceId" style="width: 100%;height: 100%;"></div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="50"> </el-table-column>
        <el-table-column prop="dataSourceName" label="数据库名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
        <el-table-column prop="dataSourceType" label="数据库类型" width="120" :formatter="formatType"></el-table-column>
        <el-table-column prop="dataLevelName" label="数据级别" width="150" align="center">
          <template slot-scope="{row}">
            <div class="level_label_color data_level">
              <span :style="'background-color:' + row.dataLevelColor">{{ row.dataLevelName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="命中表/总表数" width="120" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            <span v-if="(row.dataSourceTableHitCount || row.dataSourceTableHitCount===0) && row.dataSourceTableCount">{{ row.dataSourceTableHitCount + '/' + row.dataSourceTableCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataScan" label="扫描方式" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="operateTime" label="操作时间" min-width="150" :show-overflow-tooltip="true">
          <template slot-scope="{row}">
            {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="{row}">
            <div class="table-button">
              <span class="icon-button">
                <el-button type="text" class="detail-btn" @click="seeData(row)">{{ row.operate }}</el-button>
              </span>
              <span v-permission="'1-1-report'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="downloadReport(row)">下载报告</el-button>
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
  </div>
</template>

<script>
// import { getList } from '@/api/asset-management/database-asset/index'
import { getScanList } from '@/api/classification-management/task-management'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
import _ from 'lodash'
import commonConfig from '@/utils/config'
import { getDBType } from '@/api/asset-management/database-asset'
import { getDeviceInfo } from '@/api/data-analysis/asset-map'

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
      searchForm: {},
      dataSource: [],
      isLoading: false,
      common_legend: {
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        right: 5,
        bottom: 5,
      },
      common_title: {
        text: '类别分布',
        textStyle: {
          fontWeight: 'normal',
          color: '#2A3237',
          fontSize: 14
        },
        left: 5,
        top: 5,
      },
      taskProgressDict: commonConfig.state.taskProgress,
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
    seeData(row) {
      if (row.operate === '展开') {
        row.operate = '折叠'
      } else {
        row.operate = '展开'
      }
      this.$nextTick(() => {
        this.$refs.table.toggleRowExpansion(row)
      })
    },
    downloadReport(row) {
      console.log(row)
      window.open('/#/asset-report/' + row.dataSourceId, '_blank')
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
        for (var i = 0; i < this.tbParam.tableData.length; i++) {
          var item = this.tbParam.tableData[i]
          item.operate = '展开'
          item.dataScan = '手动扫描'
        }
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
    // 数据表格展开时的操作
    async tableExpandChange(row, expandedRows) {
      var level_id = 'level_' + row.dataSourceId
      var category_id = 'category_' + row.dataSourceId
      var bar_id = 'bar_' + row.dataSourceId
      var device_id = 'device_' + row.dataSourceId
      row.account_anthority = [
        { username: 'root', anthority: 'Delete,Select,Update' },
        { username: 'admin', anthority: 'Select,Update' }
      ]
      if (expandedRows.includes(row)) {
        for (var i = 0; i < row.historyTasks.length; i++) {
          var item = row.historyTasks[i]
          item.type = '手动扫描'
        }
        var type_data = []
        if (row.taskHitState && row.taskHitState.type) {
          type_data = row.taskHitState.type
        }
        var level_data = []
        if (row.taskHitState && row.taskHitState.level) {
          level_data = row.taskHitState.level
        }
        var character_data = []
        if (row.taskHitState && row.taskHitState.character) {
          character_data = row.taskHitState.character
        }
        this.$nextTick(() => {
          this.initEcharts(category_id, this.initcategoryEchart(type_data))
          this.initEcharts(level_id, this.initLevelEchart(level_data))
          this.initEcharts(bar_id, this.initBar(character_data))

          var xAxis_data = []
          var cpu_data = []
          var ram_data = []
          var hd_data = []
          this.initEcharts(device_id, this.initDeviceInfo(xAxis_data, cpu_data, ram_data, hd_data))
          var today = new Date()
          var begin = today.setMonth(today.getMonth() - 3)
          getDeviceInfo({
            dataSourceId: row.dataSourceId,
            dataSourceType: row.dataSourceType,
            type: 3,
            condition: {
              begin: begin,
            }
          }).then(response => {
            console.log(response)
            if (response.body.results.length > 0) {
              for (var y = 0; y < response.body.results.length; y++) {
                var itemy = response.body.results[y]
                xAxis_data.push(parseTime(itemy.time, '{y}-{m}-{d} \n {h}:{i}:{s}'))
                cpu_data.push(parseInt(itemy.cpuUS))
                ram_data.push(parseInt(itemy.ramUS * 100))
                hd_data.push(parseInt(itemy.diskUS * 100))
              }
              this.initEcharts(device_id, this.initDeviceInfo(xAxis_data, cpu_data, ram_data, hd_data))
            }
          }).catch(err => {
            console.log(err)
          })
        })
      }
    },
    initcategoryEchart(option_data) {
      this.common_title.text = '类别分布'
      const broadband_option = {
        title: this.common_title,
        legend: this.common_legend,
        series: [
          {
            type: 'pie',
            radius: ['30%', '60%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n\n{d}%',
              padding: [30, -40],
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 30,
            },
            data: option_data
          }
        ]
      }
      return broadband_option
    },
    initLevelEchart(level_data) {
      this.common_title.text = '级别分布'
      const broadband_option = {
        title: this.common_title,
        legend: this.common_legend,
        series: [
          {
            type: 'pie',
            radius: '60%',
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n\n{c}',
              padding: [30, -30],
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 30,
            },
            data: level_data
          },
          {
            type: 'pie',
            radius: '60%',
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'inner',
              formatter: '{d}%',
              color: '#ffffff',
            },
            data: level_data
          }
        ]
      }
      return broadband_option
    },
    initBar(character_data) {
      var yAxis_data = []
      var series_data = []
      for (var i = 0; i < character_data.length; i++) {
        var item = character_data[i]
        yAxis_data.unshift(item.name)
        series_data.unshift(item.value)
      }
      this.common_title.text = '规则命中分布'
      const broadband_option = {
        title: this.common_title,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 15,
          right: 10,
          top: 30,
          bottom: -15,
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value',
          splitLine: { show: false },
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: { show: false },
          // data: ['工号', '身份证', '姓名', '地址', '手机号码', 'URL', '时间']
          data: yAxis_data
        },
        series: [
          {
            type: 'bar',
            // barMaxWidth: 20,
            label: {
              show: true,
              position: 'insideLeft'
            },
            // data: [19325, 23438, 31000, 121594, 134141, 68180, 69180]
            data: series_data
          }
        ]
      }
      return broadband_option
    },
    initDeviceInfo(xAxis_data, cpu_data, ram_data, hd_data) {
      const broadband_option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          right: 'center',
          bottom: 0,
        },
        grid: {
          left: 0,
          right: 10,
          top: 10,
          bottom: 30,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
          data: xAxis_data
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: 'CPU',
            type: 'line',
            symbol: 'circle',
            // data: [12, 32, 11, 14, 90, 30, 60]
            data: cpu_data
          },
          {
            name: 'RAM',
            type: 'line',
            symbol: 'circle',
            // data: [22, 82, 91, 24, 20, 30, 31]
            data: ram_data
          },
          {
            name: 'HD',
            type: 'line',
            symbol: 'circle',
            // data: [15, 32, 21, 54, 90, 30, 40]
            data: hd_data
          },
        ]
      }
      return broadband_option
    },
    // 初始化表格数据
    initEcharts(id, option) {
      // 基于准备好的dom，初始化echarts实例
      const broadband_chart = this.$echarts.init(
        document.getElementById(id)
      )
      broadband_chart.setOption(option)
      window.addEventListener('resize', () => {
        broadband_chart.resize()
      })
      window.addEventListener('click', () => {
        broadband_chart.resize()
      })
    },
    formatStatus(row) {
      if (row.dataTaskProgress) {
        return this.taskProgressDict[row.dataTaskProgress]
      } else {
        return ''
      }
    },
    formatCreateTime(row) {
      if (row.createTime) {
        return parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        return ''
      }
    },
    formatOperateTime(row) {
      if (row.dataTaskProgress === 7 || row.dataTaskProgress === 4 || row.dataTaskProgress === 8) {
        return parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}')
      } else {
        return ''
      }
    },
  }
}
</script>

<style lang="scss">
.el-table__expand-column.el-table__cell{
  border-right: 0px solid #ffffff !important;
}
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
</style>
