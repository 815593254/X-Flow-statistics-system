<template>
  <div class="tab_main_content components-content index_table_tab">
    <el-row :gutter="15">
      <el-col :span="12">
        <div class="reset_el_col" :style="'height:' + clientHeight2 + 'px;margin-bottom: 15px;'">
          <div class="reset_el_col_title">设备信息</div>
          <div class="reset_el_col_content">IP地址：{{ IP }}</div>
          <div id="serverStatus" style="width: 100%;height: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="reset_el_col" :style="'height:' + clientHeight2 + 'px;margin-bottom: 15px;'">
          <div class="reset_el_col_title">资产数量</div>
          <div id="dataAssert" style="width: 100%;height: 100%;"></div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :span="12" :style="'height:' + clientHeight2 + 'px;'">
        <div class="reset_el_col" :style="'height:' + clientHeight2 + 'px;'">
          <div class="reset_el_col_title">数据库类型</div>
          <div id="db_type" style="width: 100%;height: 100%;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="reset_el_col" :style="'height:' + clientHeight2 + 'px;'">
          <div class="reset_el_col_title">特征分布</div>
          <div id="features" style="width: 100%;height: 100%;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDatabaseType, getfeatureData, getAssertData } from '@/api'
import { getCPUData } from '@/api/data-analysis/data-monitor'
import { parseTime } from '@/utils'
// import manyData from '@/utils/data'

export default {
  data() {
    return {
      clientHeight: document.body.clientHeight - 150,
      clientHeight2: (document.body.clientHeight - 165) / 2,
      IP: '',
    }
  },
  computed: {

  },
  watch: {
    $route() {
      this.init()
    },
  },
  mounted() {
    this.init()
    var host = window.location.host
    this.IP = host.indexOf(':') !== -1 ? host.split(':')[0] : host
  },
  methods: {
    init() {
      getCPUData({
        dataSourceId: 0,
      }).then(response => {
        console.log(response)
        if (response.body.length > 0) {
          var cpuUS = parseInt(response.body[0].cpuUS)
          var ramUS = parseInt(response.body[0].ramUS * 100)
          var diskUS = parseInt(response.body[0].diskUS * 100)
          this.initEcharts('serverStatus', this.getServerOption(cpuUS, ramUS, diskUS))
        }
      }).catch(err => {
        console.log(err)
      })

      getDatabaseType().then(response => {
        this.initEcharts('db_type', this.getDBTypeOption(response.body))
      }).catch(err => {
        console.log(err)
        var option_data = [
          { value: 0, name: 'MYSQL' },
        ]
        this.initEcharts('db_type', this.getDBTypeOption(option_data))
      })
      getfeatureData().then(response => {
        this.initEcharts('features', this.getFeaturesOption(response.body))
      }).catch(err => {
        console.log(err)
        var option_data = [
          {
            name: '身份证',
            value: 0
          },
          {
            name: '手机号码',
            value: 0
          },
        ]
        this.initEcharts('features', this.getFeaturesOption(option_data))
      })
      // 获取数据库资产
      getAssertData().then(response => {
        var xAxis_data = []
        var series_data = []
        if (response.body.length > 0) {
          for (var index = 0; index < response.body.length; index++) {
            var item = response.body[index]
            xAxis_data.unshift(parseTime(item.key, '{m}-{d}'))
            series_data.unshift(item.value)
          }
        }
        this.initEcharts('dataAssert', this.getAssertOption(xAxis_data, series_data))
      }).catch(err => {
        console.log(err)
        this.initEcharts('dataAssert', this.getAssertOption([], []))
      })
      this.initEcharts('dataAssert', this.getAssertOption())
    },
    getServerOption(cpuUS, ramUS, diskUS) {
      const auto_width = 12
      const title_top = '68%'
      const common = {
        type: 'gauge',
        radius: '35%',
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
      }
      const titleStyle = {
        fontWeight: 'normal',
        fontSize: '14',
        color: '#606266',
        textAlign: 'center'
      }

      // 第一个图
      const first_series = {
        center: ['21%', '55%'],
        progress: {
          show: true,
          width: auto_width,
          itemStyle: {
            color: '#6699FF',
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          formatter: cpuUS + '%',
          offsetCenter: [0, '0%']
        },
        data: [
          {
            value: cpuUS
          }
        ]
      }
      // 第二个图
      const second_series = {
        center: ['50%', '55%'],
        progress: {
          show: true,
          width: auto_width,
          itemStyle: {
            color: '#52CCA3',
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          formatter: ramUS + '%',
          offsetCenter: [0, '0%']
        },
        data: [
          {
            value: ramUS
          }
        ]
      }
      // 第三个图
      const third_series = {
        center: ['80%', '55%'],
        progress: {
          show: true,
          width: auto_width,
          itemStyle: {
            color: '#9580FF',
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          formatter: diskUS + '%',
          offsetCenter: [0, '0%']
        },
        data: [
          {
            value: diskUS
          }
        ]
      }
      const option = {
        title: [
          {
            text: 'CPU',
            left: '21%',
            top: title_top,
            textAlign: 'center',
            textStyle: titleStyle
          },
          {
            text: '内存',
            left: '50%',
            top: title_top,
            textAlign: 'center',
            textStyle: titleStyle
          },
          {
            text: '硬盘',
            left: '80%',
            top: title_top,
            textAlign: 'center',
            textStyle: titleStyle
          }
        ],
        series: [
          Object.assign(first_series, common),
          Object.assign(second_series, common),
          Object.assign(third_series, common),
        ]
      }
      return option
    },
    getFeaturesOption(option_data) {
      const option = {
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'treemap',
            nodeClick: false,
            breadcrumb: false,
            roam: false,
            label: {
              show: true,
              position: [10, 10],
              fontSize: 14,
            },
            left: 20,
            right: 20,
            top: 40,
            bottom: 20,
            emphasis: {
              disabled: false,
              focus: 'none'
            },
            itemStyle: {
              borderWidth: 1,
            },
            tooltip: {
              show: false,
            },
            silent: true,
            data: [
              {
                colorAlpha: [0.5, 1],
                itemStyle: {
                  color: '#1890ff',
                },
                silent: true,
                label: {
                  show: true,
                  position: [50, 50],
                  fontSize: 14,
                },
                children: option_data
              },
            ],
          },
          {
            type: 'treemap',
            nodeClick: false,
            breadcrumb: false,
            roam: false,
            silent: true,
            left: 20,
            right: 20,
            top: 40,
            bottom: 20,
            label: {
              show: true,
              position: ['40%', '40%'],
              fontSize: 14,
              formatter: '{c}',
            },
            emphasis: {
              disabled: false,
              focus: 'none'
            },
            itemStyle: {
              borderWidth: 1,
            },
            tooltip: {
              show: false,
            },
            data: [
              {
                colorAlpha: [0.5, 1],
                itemStyle: {
                  color: '#1890ff',
                },
                width: '80%',
                height: '80%',
                label: {
                  show: true,
                  position: [50, 50],
                  fontSize: 14,
                },
                children: option_data
              },
            ],
          },
        ]
      }
      return option
    },
    getAssertOption(xAxis_data, series_data) {
      const option = {
        // color: '#73C0DE',
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: xAxis_data
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          left: 60,
          top: '25%',
          right: 40,
          bottom: '20%',
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top'
            },
            data: series_data,
          }
        ]
      }
      return option
    },
    getDBTypeOption(option_data) {
      const option = {
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '60%',
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}\n\n{c}个',
              padding: [30, -60],
            },
            labelLine: {
              show: true,
              length: 30,
              length2: 70,
            },
            data: option_data
          },
          {
            name: 'Access From',
            type: 'pie',
            radius: '60%',
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'inner',
              formatter: '{d}%',
              color: '#ffffff',
            },
            data: option_data
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
    }
  }
}
</script>
<style lang="scss" scoped>
.index_table_tab{
  min-width: 1350px;
  margin-top: 60px;
  margin-bottom: 10px;
  background-color: #eff2f5;
  .el-row{
  }
  .reset_el_col{
    border: 1px solid #dfe6ec;
    background-color: #ffffff;
    //margin-bottom: 25px;
    position: relative;
  }
  .reset_el_col_title{
    font-size: $commonFontSize;
    color: $commonColor2;
    margin: 15px;
    position: absolute;
  }
  .reset_el_col_content{
    font-size: $commonFontSize;
    color: $commonColor2;
    position: absolute;
    top: 20%;
    left: 35%;
  }
}
</style>
