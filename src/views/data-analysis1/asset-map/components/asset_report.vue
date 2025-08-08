<template>
  <div id="report_content" class="report_content">
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="grid-content report_title">
          <h1>数据安全中心</h1>
          <h3>分级分类报告</h3>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24">
        <div class="grid-content">
          <el-table
            ref="table"
            element-loading-background="rgba(255, 255, 255, .0)"
            element-loading-text="加载中，请稍后..."
            element-loading-spinner="el-icon-loading"
            :data="tableData"
            border
            style="width: 100%"
            tooltip-effect="lights"
            header-cell-class-name="header-row"
          >
            <el-table-column prop="dataSourceName" label="数据库名称" min-width="150" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="dataSourceType" label="数据库类型" min-width="120"></el-table-column>
            <el-table-column prop="tableCount" label="表数" min-width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="columnCount" label="字段总数" min-width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="hitColumnCount" label="敏感字段总数" min-width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="taskBuildType" label="扫描方式" min-width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="taskCreateTime" label="最后扫描时间" width="180" :show-overflow-tooltip="true">
              <template slot-scope="{row}">
                {{ parseTime(row.taskCreateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24" class="reset_el_col">
        <div class="grid-content sensitive_content">
          <div class="sensitive_echart_content sensitive_echart">
            <div id="sensitive_field" class="echart_div"></div>
            <div class="legend_content">
              <div class="legend_content_title">敏感字段占比</div>
              <div><p>敏感字段：</p><p><span>{{ hitColumnCount }}</span><span>{{ hitColumnCountPercentage + '%' }}</span></p></div>
              <div><p>非敏感字段：</p><p><span>{{ noHitColumnCount }}</span><span>{{ (100 - hitColumnCountPercentage) + '%' }}</span></p></div>
            </div>
          </div>
          <div class="sensitive_echart_content sensitive_echart">
            <div id="sensitive_table" class="echart_div"></div>
            <div class="legend_content">
              <div class="legend_content_title">敏感表占比</div>
              <div><p>敏感表：</p><p><span>{{ hitTableCount }}</span><span>{{ hitTableCountPercentage + '%' }}</span></p></div>
              <div><p>非敏感表：</p><p><span>{{ noHitTableCount }}</span><span>{{ (100 - hitTableCountPercentage) + '%' }}</span></p></div>
            </div>
          </div>
          <div class="sensitive_echart_content classification_echart_content"><div id="classification" class="echart_div"></div></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24" class="reset_el_col">
        <div class="grid-content feature_content">
          <div id="features" class="echart_div"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="24" class="reset_el_col">
        <div class="grid-content account_anthority">
          <div class="account_title">账户权限</div>
          <el-table :data="account_anthority" border style="width: 100%;">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="username" label="用户名" min-width="100"></el-table-column>
            <el-table-column prop="anthority" label="权限" min-width="180"></el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24" class="reset_el_col">
        <div class="grid-content other_content" :style="'height:' + sub_table_height +'px'">
          <div id="sub_table" class="echart_div"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getReportDetail } from '@/api/data-analysis/asset-report/index'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
// import manyData from '@/utils/data'
import { exportPdf } from '@/vendor/html2pdf'
import { getDBType } from '@/api/asset-management/database-asset'
// import _ from 'lodash'

export default {
  props: {
  },
  data() {
    return {
      parseTime,
      dataSourceId: null,
      tableData: [],
      fileName: '分级分类报告',
      dataSource: [],
      common_legend: {
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        right: 5,
        bottom: 5,
      },
      common_title: {
        text: '特征分布',
        textStyle: {
          fontWeight: 'normal',
          color: '#000000',
          fontSize: 16
        },
        left: 20,
        top: 20,
      },
      account_anthority: [],
      hitColumnCount: 20,
      hitTableCount: 20,
      hitColumnCountPercentage: 20,
      hitTableCountPercentage: 20,
      noHitColumnCount: 80,
      noHitTableCount: 80,
      // sub_table_height: 500,
      hitTableColumnResult: []
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ]),
    sub_table_height: function() {
      return this.hitTableColumnResult.length > 0 ? this.hitTableColumnResult.length * 40 : 300
    }
  },
  watch: {
    $route() {
      this.init()
    }
  },
  async mounted() {
    await this.getDBType()
    await this.init()
    this.$nextTick(() => {
      setTimeout(() => {
        this.exportPDF()
      }, 3000)
    })
  },
  // updated() {
  //   this.$nextTick(() => {
  //     setTimeout(() => {
  //       this.exportPDF()
  //     }, 1000)
  //   })
  // },
  methods: {
    // 获取数据库类型数据
    getDBType() {
      getDBType().then(response => {
        this.dataSource = response.body.sourceType
      }).catch(err => {
        console.log(err)
      })
    },
    async init() {
      this.account_anthority = [
        { username: 'root', anthority: 'Delete,Select,Update' },
        { username: 'admin', anthority: 'Select,Update' }
      ]
      this.dataSourceId = this.$route.params.id
      var hitTypeResult = [
        // { value: 1048, name: '分类一' },
        // { value: 735, name: '分类二' },
        // { value: 580, name: '分类三' },
        // { value: 484, name: '分类四' },
        // { value: 300, name: '分类五' }
      ]
      // var hitCharacterResult = manyData.state.features_echarts
      var hitCharacterResult = []
      await getReportDetail({ dataSourceId: this.dataSourceId }).then((res) => {
        this.tableData = []
        if (res.body) {
          this.tableData.push(res.body)
          this.hitColumnCount = res.body.hitColumnCount
          this.noHitColumnCount = res.body.columnCount - res.body.hitColumnCount
          this.hitColumnCountPercentage = parseInt((res.body.hitColumnCount / res.body.columnCount).toFixed(2) * 100)
          this.hitTableCount = res.body.hitTableCount
          this.noHitTableCount = res.body.tableCount - res.body.hitTableCount
          this.hitTableCountPercentage = parseInt((res.body.hitTableCount / res.body.tableCount).toFixed(2) * 100)
          hitTypeResult = res.body.hitTypeResult
          hitCharacterResult = res.body.hitCharacterResult
          this.hitTableColumnResult = res.body.hitTableColumnResult
        }
      })
      // this.sub_table_height = this.hitTableColumnResult.length > 0 ? this.hitTableColumnResult.length * 40 : 300
      // this.$nextTick(() => {
      this.initEcharts('sensitive_field', this.getSensitiveOption(this.hitColumnCountPercentage, ['#EE6666']))
      this.initEcharts('sensitive_table', this.getSensitiveOption(this.hitTableCountPercentage, ['#5AD8A6']))
      this.initEcharts('classification', this.getClassificationOption(hitTypeResult))
      this.initEcharts('features', this.getFeaturesOption(hitCharacterResult))
      this.initEcharts('sub_table', this.getSubTableOption(this.hitTableColumnResult))
      // })
    },
    getSensitiveOption(data_value, color_list) {
      var auto_width = 16
      const option = {
        color: color_list,
        series: [
          {
            type: 'gauge',
            radius: '75%',
            startAngle: 90,
            endAngle: -270,
            // center: ['25%', '50%'],
            axisLine: {
              lineStyle: {
                width: auto_width
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            anchor: {
              show: false,
            },
            progress: {
              show: true,
              width: auto_width,
            },
            detail: {
              valueAnimation: true,
              fontSize: 20,
              formatter: data_value + '%',
              offsetCenter: [0, '0%']
            },
            data: [
              {
                value: data_value
              }
            ]
          }
        ]
      }
      return option
    },
    getClassificationOption(data_value) {
      var option = {
        title: {
          text: '分类占比',
          textStyle: {
            fontWeight: 'normal',
            color: '#000000',
            fontSize: 16
          },
          left: '75%',
          top: 40,
        },
        legend: {
          orient: 'vertical',
          icon: 'circle',
          itemWidth: 5,
          itemHeight: 5,
          left: '75%',
          top: 80,
          textStyle: {
            color: '#606266',
            fontSize: 14,
          },
          formatter: (name) => {
            var data = option.series[0].data
            var value
            for (var i = 0; i < data.length; i++) {
              var item = data[i]
              if (item.name === name) {
                value = item.value
              }
            }
            return name + '  ' + value
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n\n{d}%',
              padding: [35, -40],
            },
            labelLine: {
              show: true,
              length: 20,
              length2: 40,
            },
            data: data_value
          }
        ]
      }
      return option
    },
    getFeaturesOption(option_data) {
      this.common_title.text = '特征分布'
      const option = {
        title: this.common_title,
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'treemap',
            width: '90%',
            height: '80%',
            bottom: 25,
            nodeClick: false,
            breadcrumb: false,
            roam: false,
            silent: true,
            label: {
              show: true,
              position: [10, 10],
              fontSize: 14,
            },
            itemStyle: {
              borderWidth: 1,
            },
            data: [
              {
                colorAlpha: [0.5, 1],
                itemStyle: {
                  color: '#1890ff',
                },
                children: option_data
              },
            ],
          },
          {
            type: 'treemap',
            width: '90%',
            height: '80%',
            bottom: 25,
            nodeClick: false,
            breadcrumb: false,
            roam: false,
            silent: true,
            label: {
              show: true,
              position: ['40%', '40%'],
              fontSize: 14,
              formatter: '{c}',
            },
            itemStyle: {
              borderWidth: 1,
            },
            data: [
              {
                colorAlpha: [0.5, 1],
                itemStyle: {
                  color: '#1890ff',
                },
                children: option_data
              },
            ],
          },
        ]
      }
      return option
    },
    getSubTableOption(option_data) {
      var yAxis_data = []
      var series_Hitdata = []
      var series_noHitdata = []
      for (var i = 0; i < option_data.length; i++) {
        var item = option_data[i]
        yAxis_data.push(item.name)
        series_Hitdata.push(item.key)
        series_noHitdata.push(item.value)
      }
      this.common_title.text = '敏感数据分布'
      const option = {
        color: ['#73A0FA', '#73DEB3'],
        title: this.common_title,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: 25,
          right: 25,
          top: 100,
          bottom: 15,
          containLabel: true
        },
        legend: {
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          left: 30,
          top: 60,
          textStyle: {
            color: '#606266',
            fontSize: 14,
          },
        },
        xAxis: {
          show: true,
          type: 'value',
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
          data: yAxis_data
        },
        series: [
          {
            name: '敏感',
            type: 'bar',
            // barWidth: 20,
            stack: 'total',
            label: {
              show: true,
              color: '#ffffff',
              position: 'insideLeft',
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value
                } else {
                  return ''
                }
              }
            },
            data: series_Hitdata
          },
          {
            name: '非敏感',
            type: 'bar',
            // barWidth: 20,
            stack: 'total',
            label: {
              show: true,
              position: 'insideLeft',
              formatter: function(params) {
                if (params.value > 0) {
                  return params.value
                } else {
                  return ''
                }
              }
            },
            data: series_noHitdata
          }
        ]
      }
      return option
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
    exportPDF() {
      // exportDom是id名字，导出内容只能放在一个div
      exportPdf(this.fileName, 'report_content', resp => {
        console.log(resp)
        // this.fileExportCallBack(resp)
      })
    },
  },
}
</script>

<style lang="scss">

</style>
<style lang="scss" scoped>
.report_content {
  padding: 25px;
}
.grid-content{
  margin-bottom: 30px;
}
.report_title{
  text-align: center;
  h1{
    margin-top: 0px;
    margin-bottom: 5px;
  }
  h3{
    margin-top: 0px;
  }
}
.reset_el_col{
  .grid-content{
    border: 1px solid #dfe6ec;
  }
  .echart_div{
    width: 100%;
    height: 100%;
  }
  .sensitive_content{
    height: 280px;
    display: flex;
    justify-content: space-between;
    padding: 25px 15px;
    .sensitive_echart_content{
      width: 33%;
      height: 100%;
      border-right: 1px solid #dfe6ec;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sensitive_echart_content:last-of-type{
      border-right: 0px solid #dfe6ec;
    }
    .sensitive_echart_content .echart_div{
      width: 60%;
      height: 100%;
    }
    .classification_echart_content .echart_div{
      width: 100%;
      height: 100%;
    }
  }
  .legend_content{
    width: 40%;
    & > div{
      margin-bottom: 20px;
      font-size: 14px;
      & > p{
        margin-bottom: 5px;
        color: #606266;
        display: flex;
        & > span{
          display: inline-block;
          width: 50px;
          margin-right: 0px;
          font-size: 18px;
          color: #1890ff;
        }
      }
    }
    & > div:last-of-type{
      margin-bottom: 0px;
    }
    .legend_content_title{
      font-size: 16px;
      font-weight: 500;
      color: #000000;
    }
  }
  .feature_content{
    width: 100%;
    height: 400px;
  }
  .other_content{
    width: 100%;
  }
  .account_anthority{
    padding: 20px 25px;
    .account_title{
      font-size: 16px;
      margin: 3px 0px 15px 0px;
    }
  }
}
</style>
