<template>
  <div id="tab_main_content_id" class="tab_main_content components-content">
    <div class="monitor_title">
      <div class="monitor_title_left">
        <el-form :inline="true" label-position="left" label-width="60px">
          <el-form-item label="数据库：">
            <el-select v-model="dataSourceId">
              <template v-for="item in databaseList">
                <el-option :key="item.dataSourceId" :label="item.dataSourceName" :value="item.dataSourceId" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="时间段：">
            <el-select v-model="time_range">
              <template v-for="item in timeList">
                <el-option :key="item.value" :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="monitor_title_right">
        <div>
          <el-button type="primary" size="small" :loading="isDatabaseLoading" @click="saveDashboard">保存面板</el-button>
        </div>
        <div class="icon-button delete-button" @click="addEchart">
          <el-tooltip class="item" effect="dark" content="新增图表" placement="top-start">
            <!--<i class="el-icon-s-data"></i>-->
            <i class="el-icon-plus"></i>
          </el-tooltip>
        </div>
        <div class="icon-button delete-button" @click="saveTemplate">
          <el-tooltip class="item" effect="dark" content="保存模板" placement="top-start">
            <i class="el-icon-collection"></i>
          </el-tooltip>
        </div>
        <div class="icon-button refresh-button" @click="refresh">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
            <i class="el-icon-refresh"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div>
      <grid-layout
        :col-num="layoutColNum"
        :is-draggable="true"
        :is-resizable="true"
        :layout="layout"
        :row-height="15"
        :margin="[15, 15]"
        :use-css-transforms="true"
        :vertical-compact="false"
        @layout-updated="layoutUpdatedEvent"
        @layout-ready="layoutReadyEvent"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :h="item.h"
          :i="item.i"
          :w="item.w"
          :x="item.x"
          :y="item.y"
        >
          <div :id="'reset_card_'+item.i" class="reset_card">
            <div class="reset_card_title">
              <span>{{ item.name }}</span>
            </div>
            <div class="reset_card_body">
              <div class="reset_card_operate">
                <span @click.stop="editEcharts(item)">
                  <i class="el-icon-edit"></i>
                </span>
                <span @click.stop="deleteEcharts(item.i)">
                  <i class="el-icon-delete"></i>
                </span>
              </div>
              <div :id="'echart_'+item.i" style="width: 100%;height: 100%;"></div>
            </div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
    <!--新增编辑数据库监控指标图表-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="800px">
      <div>
        <div class="dialogEchart">
          <div id="dialogEchartId" style="width: 100%;height: 100%;"></div>
        </div>
        <el-form ref="addFormData" class="add_form_data" :model="formData" :rules="addrules" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="监控名称：" prop="name">
                <el-input v-model.trim="formData.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图表类型：" prop="echartType">
                <el-select v-model="formData.echartType">
                  <template v-for="item in echartTypeList">
                    <el-option :key="item.value" :label="item.label" :value="item.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="监控指标类型：" prop="monitorFieldType">
                <el-radio-group v-model="formData.monitorFieldType">
                  <el-radio :label="1">基础监控指标</el-radio>
                  <el-radio :label="2" :disabled="dataSourceType !== 1 ? true:false">扩展监控指标</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="formData.monitorFieldType === 1">
            <el-col :span="12">
              <el-form-item label="基础监控指标：" prop="monitorField">
                <el-select v-model="formData.monitorField" multiple :multiple-limit="multipleLimit" filterable>
                  <template v-for="item in monitorFieldList">
                    <el-option :key="item.value" :label="item.label" :value="item.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="基础监控字段：" prop="monitorFieldStr">
                <el-input v-model="formData.monitorFieldStr" type="textarea" readonly autosize></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else-if="formData.monitorFieldType === 2">
            <el-col :span="12">
              <el-form-item label="扩展监控指标：" prop="extendMonitorField">
                <el-select v-model="formData.extendMonitorField" multiple :multiple-limit="multipleLimit" filterable>
                  <template v-for="item in extendMonitorFieldList">
                    <el-option :key="item.value" :label="item.label" :value="item.value" />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="扩展监控字段：" prop="extendMonitorFieldStr">
                <el-input v-model="formData.extendMonitorFieldStr" type="textarea" readonly autosize></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" :loading="isaddLoading" @click="submitForm('addFormData')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
// import commonConfig from '@/utils/config'
import _ from 'lodash'
import { getSocket } from '@/utils/socket'
import { getEchartData, getDashboardData, saveDashboardData, getOracleData, getOracleDashboardData, saveOracleDashboardData, saveTemplateData, getTemplateData } from '@/api/data-analysis/data-monitor'
import echarts_option from '@/utils/echarts_option'
import { GridLayout, GridItem } from 'vue-grid-layout'
import { getList } from '@/api/asset-management/database-asset'

export default {
  components: {
    GridLayout,
    GridItem
  },
  data() {
    return {
      parseTime,
      curID: null,
      drag: false,
      dataSourceId: null,
      dataSourceType: 1,
      time_range: '5',
      databaseList: [],
      multipleLimit: 0,
      timeList: [
        { label: '最近5分钟', value: '5' },
        { label: '最近15分钟', value: '15' },
        { label: '最近30分钟', value: '30' },
        { label: '最近1小时', value: '60' }
      ],
      websock: null,
      start_time: Date.now() - 5 * 60 * 1000,
      end_time: Date.now(),
      dialogTitle: '新增监控指标',
      dialogVisible: false,
      isaddLoading: false,
      formData: {},
      addrules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        echartType: [{ required: true, message: '请选择图表类型', trigger: 'blur' }],
        monitorFieldType: [{ required: true, message: '请选择指标类型', trigger: 'blur' }],
        monitorField: [{ required: true, message: '请选择基础监控指标', trigger: 'blur' }],
        extendMonitorField: [{ required: true, message: '请选择基础监控指标', trigger: 'blur' }],
      },
      monitorFieldList: [],
      extendMonitorFieldList: [
        { label: '线程缓存大小', value: 'thread_cache_size' },
        { label: '已使用线程缓存', value: 'threads_cached' },
        { label: '已创建的线程数', value: 'threads_created' },
        { label: '创建的临时表数', value: 'created_tmp_tables' },
        { label: '创建磁盘临时表数', value: 'created_tmp_disk_tables' },
        { label: '创建的临时文件数', value: 'created_tmp_files' },
        { label: '立即释放表锁数', value: 'table_locks_immediate' },
        { label: '缓存空余内存', value: 'qcache_free_memory' },
        { label: '缓存大小', value: 'query_cache_size' },
        { label: '全联接无索引联接', value: 'select_full_join' },
        { label: '范围查询联接表', value: 'select_full_range_join' },
        { label: '使用第一个表的范围执行连接的次数', value: 'select_range' },
        { label: '在利用服务搜索获取辅助表的行时执行连接的次数', value: 'select_range_check' },
        { label: '在对第一张表进行全表扫描时执行连接的次数', value: 'select_scan' },
        { label: '排好序的行数', value: 'sort_rows' },
        { label: '使用范围的排序操作的个数', value: 'sort_range' },
        { label: '排序算法执行的合并的次数', value: 'sort_merge_passes' },
        { label: '使用全表扫描的排序操作的个数', value: 'sort_scan' },
        { label: '连接服务器的尝试失败的次数', value: 'aborted_connects' },
        { label: '因客户端未正确关闭而被中断的客户端连接个数', value: 'aborted_clients' },
        { label: 'InnoDB表空间里的页面大小', value: 'innodb_page_size' },
        { label: 'Buffer Pool缓存命中率统计', value: 'buffer_pool_pages' },
        { label: '日志缓冲区的大小', value: 'log_buffer_size' },
        { label: '用于缓存MyISAM表索引块的缓冲区大小', value: 'key_buffer_size' },
        { label: '保存在缓存里的满足查询请求的查询数量', value: 'qcache_hits' },
        { label: '在查询缓存里注册过的查询数量', value: 'qcache_inserts' },
        { label: '无法缓存的或者因用户使用了SQL_NO_CACHE关键字而被禁止缓存的查询的数量', value: 'qcache_not_cached' },
        { label: '为了给新的查询结果腾出空间而从查询缓存里丢弃的缓存查询结果的数量', value: 'qcache_lowmem_prunes' },
        { label: '缓存里注册的查询数量', value: 'qcache_queries_in_cache' },
        { label: '服务器已打开文件的次数', value: 'opened_files' },
        { label: '打开文件的个数', value: 'open_files' },
        { label: 'MySQL服务器试图保留的文件描述符的个数', value: 'open_files_limit' },
        { label: '已打开的文件个数', value: 'num_open_files' },
        { label: '服务器已打开表的次数', value: 'opened_tables' },
        { label: '表缓存被命中的次数', value: 'open_cache_hits' },
        { label: '表缓存被未命中的次数', value: 'open_cache_misses' },
        { label: '缓存超出table_open_cache所表示的那个大小限制的次数', value: 'open_cache_overflows' },
        { label: '处于打开状态的表的个数，其中不包括TEMPORARY表', value: 'open_tables' },
        { label: '服务器能够同时打开的表的最大个数', value: 'table_open_cache' },
        { label: '缓存的.frm文件的个数', value: 'open_table_definitions' },
        { label: '服务器在其定义缓存里可以存放的表定义（来自.frm文件）个数', value: 'table_definition_cache' },
        { label: '服务器已打开.frm文件的次数', value: 'opened_table_definitions' },
      ],
      echartTypeList: [
        { label: '折线图', value: 'line' },
        { label: '柱状图', value: 'bar' },
        { label: '矩阵过程图', value: 'stat' },
      ],
      layout: [], // 布局位置数据
      layoutColNum: 12, // 布局位置数据
      layoutMap: [], // 布局二维数组地图
      monitorFieldValue: {},
      xAxis_data: [],
      extend_xAxis_data: [],
      basic_xAxis_data: [],
      isDatabaseLoading: false,
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ]),
  },
  watch: {
    $route() {
      this.getSourceData()
    },
    // 监控数据库时间段下拉框选择变化
    'time_range': {
      handler(newValue) {
        this.end_time = Date.now()
        this.start_time = this.end_time - parseInt(newValue) * 60 * 1000
        this.getEchartData()
      },
    },
    // 监控数据库值的变化
    'dataSourceId': {
      handler(newValue) {
        this.databaseList.forEach(item => {
          if (item.dataSourceId === newValue) {
            this.dataSourceType = item.dataSourceType
          }
        })
        if (this.dataSourceType === 1) {
          this.monitorFieldList = [
            { label: '服务工作时间', value: 'status_uptime' },
            { label: '查询记录总量', value: 'status_queries' },
            { label: '实际连接数', value: 'threads_connected' },
            { label: '库计数总量', value: 'status_questions' },
            { label: '需要等待的表锁数', value: 'table_locks_waited' },
            { label: '入站流量（KB）', value: 'bytes_received' },
            { label: '出站流量（KB）', value: 'bytes_sent' },
            { label: '监控库状态', value: 'mysql_up' },
            { label: '慢查询次数', value: 'slow_queries' },
            { label: '使用中最大连接', value: 'max_used_connections' },
            { label: '最大并发连接数', value: 'max_connections' },
            { label: '已经激活的线程数', value: 'threads_running' },
            { label: '缓冲池大小（MB）', value: 'buffer_pool_size' },
            { label: 'QPS指标', value: 'questions_qps' },
          ]
        } else {
          this.formData.monitorFieldType = 1
          this.monitorFieldList = [
            { label: '用户提交数（次数）', value: 'user_commits' },
            { label: '执行总数（次数）', value: 'execute_count' },
            { label: '采集耗时（秒）', value: 'scrape_seconds' },
            { label: '采集总数（次数）', value: 'scrapes_total' },
            { label: '并发等待时间（毫秒）', value: 'wait_time_concurrency' },
            { label: '提交等待时间（毫秒）', value: 'wait_time_commit' },
            { label: '系统I/O等待时间（毫秒）', value: 'wait_time_system' },
            { label: '监控库状态(1正常，0未连接)', value: 'oracledb_up' },
            { label: '用户I/O等待时间（毫秒）', value: 'wait_time_user' },
            { label: '应用等待时间(毫秒）', value: 'wait_time_app' },
            { label: '网络等待时间（毫秒）', value: 'wait_time_network' },
            { label: '进程计数（个）', value: 'process_count' },
            { label: '回滚计数（次数）', value: 'user_rollbacks' },
            { label: '组态等待时间（毫秒）', value: 'wait_time_conf' },
            { label: '任务等待时间（毫秒）', value: 'wait_time_scheduler' },
            { label: '解析调用总数（次数）', value: 'parse_count_total' },
            { label: '其他等待时间（毫秒）', value: 'wait_time_other' },
            { label: '管理等待时间（毫秒）', value: 'wait_time_admin' },
            { label: '采集错误计数（次数）', value: 'scrape_error' },
            { label: '每秒请求次数', value: 'questions_qps' },
          ]
        }
        console.log('dataSourceId========')
        console.log(this.dataSourceType)
        this.getEchartData()
        // 获取模板数据
        getTemplateData({
          dataSourceType: this.dataSourceType,
        }).then(response => {
          console.log('response.body.results++++++++++++')
          console.log(response.body.results)
        }).catch(err => {
          console.log(err)
        })
      },
    },
    // 监控新增图表时基础监控指标值的变化
    'formData.monitorField': {
      handler(newValue) {
        var xAxis_data
        if (this.formData.monitorFieldType === 1) {
          this.formData.monitorFieldStr = newValue.join(',')
          xAxis_data = this.basic_xAxis_data
          this.renderEcharts(this.formData.echartType, 'dialogEchartId', this.formData.monitorFieldStr, xAxis_data, true)
        }
      },
    },
    // 监控新增图表时扩展监控指标值的变化
    'formData.extendMonitorField': {
      handler(newValue) {
        if (this.formData.monitorFieldType !== 1) {
          this.formData.extendMonitorFieldStr = newValue.join(',')
          var xAxis_data = this.extend_xAxis_data
          this.renderEcharts(this.formData.echartType, 'dialogEchartId', this.formData.extendMonitorFieldStr, xAxis_data, true)
        }
      },
    },
    // 监控新增图表时图表类型值的变化
    'formData.echartType': {
      handler(newValue) {
        var monitorFieldStr = this.formData.monitorFieldType === 1 ? this.formData.monitorFieldStr : this.formData.extendMonitorFieldStr
        var xAxis_data = this.formData.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
        if (newValue === 'stat') {
          // 监控指标如果是多个值就只取第一个值
          this.multipleLimit = 1
          if (this.formData.monitorFieldType === 1) {
            if (this.formData.monitorField.length > 1) {
              this.formData.monitorField = this.formData.monitorField[0]
            } else {
              this.renderEcharts(newValue, 'dialogEchartId', monitorFieldStr, xAxis_data, true)
            }
          } else {
            if (this.formData.extendMonitorField.length > 1) {
              this.formData.extendMonitorField = this.formData.extendMonitorField[0]
            } else {
              this.renderEcharts(newValue, 'dialogEchartId', monitorFieldStr, xAxis_data, true)
            }
          }
        } else {
          this.multipleLimit = 0
          this.renderEcharts(newValue, 'dialogEchartId', monitorFieldStr, xAxis_data, true)
        }
      },
    },
  },
  mounted() {
    this.getSourceData()
    // this.initWebSocket()
  },
  methods: {
    // 获取数据
    initWebSocket() {
      getSocket(
        // `ws://10.1.25.99:8116/socket/metric?dataSourceId=19&monitorSourceId=2&type=2`,
        `ws://10.1.25.99:8116/socket/metric?dataSourceId=18&monitorSourceId=6&type=1`,
        JSON.stringify({ dataSourceId: 19, monitorSourceId: 2, type: 2 }),
        (data, ws) => {
          console.log(data, ws)
          // 保存数据对象, 以便发送消息
          this.wsData = ws
        }
      )
    },
    // 启动定时器刷新面板表格数据
    initSetInterval() {
      // setInterval(() => {
      //   this.layout.forEach(item => {
      //     console.log('---------')
      //     this.renderEcharts(item.echartType, 'echart_' + item.i, item.monitorFieldStr)
      //   })
      // var params = {
      //   monitorSourceId: this.monitorSourceId,
      //   dataSourceId: this.dataSourceId,
      //   type: '3',
      //   condition: {
      //     'begin': this.start_time,
      //     'end': this.end_time
      //   }
      // }
      // getEchartData(
      //   params
      // ).then(response => {
      //   console.log(response)
      //   if (response.body.results && response.body.results.length > 0) {
      //     // this.monitorFieldValue = {}
      //     // this.xAxis_data = []
      //     var item = response.body.results[0]
      //     // 根据显示的时间段不同，横坐标的时间格式也不同, 小于1440显示是当天的小时和分钟，小于两天的显示日期，小时，分钟，
      //     if (item.time && parseInt(this.time_range) <= 1444) {
      //       this.xAxis_data.push(parseTime(item.time, '{h}:{i}'))
      //     } else if (item.time && parseInt(this.time_range) <= 2880) {
      //       this.xAxis_data.push(parseTime(item.time, '{m}-{d} \n {h}:{i}'))
      //     } else {
      //       this.xAxis_data.push(parseTime(item.time, '{m}-{d}'))
      //     }
      //     for (var key in item) {
      //       if (key !== 'id' && key !== 'time' && key !== 'page' && key !== 'sorts') {
      //         if (!this.monitorFieldValue[key]) {
      //           this.monitorFieldValue[key] = []
      //         }
      //         if (item[key]) {
      //           this.monitorFieldValue[key].push(item[key])
      //         } else {
      //           this.monitorFieldValue[key].push(0)
      //         }
      //       }
      //     }
      //     console.log('this.xAxis_data-------------')
      //     console.log(this.xAxis_data)
      //     this.layout.forEach(item => {
      //       this.renderEcharts(item.echartType, 'echart_' + item.i, item.monitorField)
      //     })
      //   }
      //   // monitorFieldValue
      // }).catch(err => {
      //   console.log(err)
      // })
      // }, 5000)
    },

    // 获取数据库的资源信息，包括IP地址等
    getSourceData() {
      var params = {
        'page': {
          'pageNo': 1,
          'pageSize': 1000000
        },
      }
      getList(
        params
      ).then(response => {
        if (response.body.results && response.body.results.length > 0) {
          this.databaseList = response.body.results
          this.databaseList = this.databaseList.filter(item => {
            return item.dataSourceType === 1 || item.dataSourceType === 2
          })
          if (this.databaseList.length > 0) {
            this.dataSourceId = this.databaseList[0].dataSourceId
            this.dataSourceType = this.databaseList[0].dataSourceType
            // this.getEchartData() // 因为监控了monitorSourceId值的变化，所以避免两次调用，这个地方注释
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据数据库资源，获取当前数据库的监控信息，便于渲染图表
    getEchartData() {
      var params = {
        dataSourceType: this.dataSourceType,
        dataSourceId: this.dataSourceId,
        type: '3',
        condition: {
          'begin': this.start_time,
          'end': this.end_time
        }
      }
      var getDataApi = this.dataSourceType === 1 ? getEchartData : getOracleData
      getDataApi(
        params
      ).then(response => {
        this.layout = []
        this.monitorFieldValue = {}
        this.basic_xAxis_data = []
        this.extend_xAxis_data = []
        var item
        if (this.dataSourceType === 1) {
          if (response.body.metricFields && response.body.metricFields.length > 0) {
            for (var index = 0; index < response.body.metricFields.length; index++) {
              item = response.body.metricFields[index]
              // 根据显示的时间段不同，横坐标的时间格式也不同, 小于1440显示是当天的小时和分钟，小于两天的显示日期，小时，分钟，
              if (item.time && parseInt(this.time_range) <= 1444) {
                this.basic_xAxis_data.push(parseTime(item.time, '{h}:{i}:{s}'))
              } else if (item.time && parseInt(this.time_range) <= 2880) {
                this.basic_xAxis_data.push(parseTime(item.time, '{m}-{d} \n {h}:{i}'))
              } else {
                this.basic_xAxis_data.push(parseTime(item.time, '{m}-{d}'))
              }
              for (var key in item) {
                if (key !== 'id' && key !== 'time' && key !== 'page' && key !== 'sorts') {
                  if (!this.monitorFieldValue[key]) {
                    this.monitorFieldValue[key] = []
                  }
                  if (item[key]) {
                    this.monitorFieldValue[key].push(item[key])
                  } else {
                    this.monitorFieldValue[key].push(0)
                  }
                }
              }
            }
          }
          if (response.body.extendMysqlFields && response.body.extendMysqlFields.length > 0) {
            for (var index2 = 0; index2 < response.body.extendMysqlFields.length; index2++) {
              item = response.body.extendMysqlFields[index2]
              // 根据显示的时间段不同，横坐标的时间格式也不同, 小于1440显示是当天的小时和分钟，小于两天的显示日期，小时，分钟，
              if (item.time && parseInt(this.time_range) <= 1444) {
                this.extend_xAxis_data.push(parseTime(item.time, '{h}:{i}:{s}'))
              } else if (item.time && parseInt(this.time_range) <= 2880) {
                this.extend_xAxis_data.push(parseTime(item.time, '{m}-{d} \n {h}:{i}'))
              } else {
                this.extend_xAxis_data.push(parseTime(item.time, '{m}-{d}'))
              }
              for (var key2 in item) {
                if (key2 !== 'id' && key2 !== 'time' && key2 !== 'page' && key2 !== 'sorts') {
                  if (!this.monitorFieldValue[key2]) {
                    this.monitorFieldValue[key2] = []
                  }
                  if (item[key2]) {
                    this.monitorFieldValue[key2].push(item[key2])
                  } else {
                    this.monitorFieldValue[key2].push(0)
                  }
                }
              }
            }
          }
        } else {
          if (response.body && response.body.length > 0) {
            for (var index3 = 0; index3 < response.body.length; index3++) {
              item = response.body[index3]
              // 根据显示的时间段不同，横坐标的时间格式也不同, 小于1440显示是当天的小时和分钟，小于两天的显示日期，小时，分钟，
              if (item.time && parseInt(this.time_range) <= 1444) {
                this.basic_xAxis_data.push(parseTime(item.time, '{h}:{i}:{s}'))
              } else if (item.time && parseInt(this.time_range) <= 2880) {
                this.basic_xAxis_data.push(parseTime(item.time, '{m}-{d} \n {h}:{i}'))
              } else {
                this.basic_xAxis_data.push(parseTime(item.time, '{m}-{d}'))
              }
              for (var key3 in item) {
                if (key3 !== 'id' && key3 !== 'time' && key3 !== 'page' && key3 !== 'sorts' && key3 !== 'begin' && key3 !== 'end') {
                  if (!this.monitorFieldValue[key3]) {
                    this.monitorFieldValue[key3] = []
                  }
                  if (item[key3]) {
                    this.monitorFieldValue[key3].push(item[key3])
                  } else {
                    this.monitorFieldValue[key3].push(0)
                  }
                }
              }
            }
          }
        }
        // 冻结大数据对象，提升性能
        this.monitorFieldValue = Object.freeze(this.monitorFieldValue)
        this.basic_xAxis_data = Object.freeze(this.basic_xAxis_data)
        this.extend_xAxis_data = Object.freeze(this.extend_xAxis_data)
        this.getDashboardData()
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取数据库ip地址获取已经保存的面板数据
    getDashboardData() {
      var params = {
        dataSourceType: this.dataSourceType,
        dataSourceId: this.dataSourceId,
      }
      var getDataApi = this.dataSourceType === 1 ? getDashboardData : getOracleDashboardData
      getDataApi(
        params
      ).then(response => {
        if (response.body.results.length > 0) {
          this.layout = response.body.results
          this.layoutMap = _.cloneDeep(this.layout)
          this.$nextTick(() => {
            this.layout.forEach(item => {
              var xAxis_data = item.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
              var monitorFieldStr = item.monitorFieldType === 1 ? item.monitorFieldStr : item.extendMonitorFieldStr
              this.renderEcharts(item.echartType, 'echart_' + item.i, monitorFieldStr, xAxis_data)
            })
          })
        } else {
          // 获取模板数据
          getTemplateData({
            dataSourceType: this.dataSourceType,
          }).then(response => {
            this.layout = response.body.results
            this.layoutMap = _.cloneDeep(this.layout)
            this.$nextTick(() => {
              this.layout.forEach(item => {
                var xAxis_data = item.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
                var monitorFieldStr = item.monitorFieldType === 1 ? item.monitorFieldStr : item.extendMonitorFieldStr
                this.renderEcharts(item.echartType, 'echart_' + item.i, monitorFieldStr, xAxis_data)
              })
            })
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 增加图表功能
    addEchart() {
      this.dialogVisible = true
      this.curID = null
      this.dialogTitle = '新增监控指标'
      this.formData = {
        name: '',
        monitorFieldType: 1,
        monitorField: [],
        extendMonitorField: [],
        monitorFieldStr: '',
        extendMonitorFieldStr: '',
        echartType: 'line'
      }
    },
    editEcharts(item) {
      console.log(item)
      this.curID = item.i
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.formData.name = item.name
      this.formData.monitorFieldType = item.monitorFieldType
      this.formData.echartType = item.echartType
      if (item.monitorFieldType === 1) {
        this.formData.monitorFieldStr = item.monitorFieldStr
        this.formData.monitorField = item.monitorFieldStr ? item.monitorFieldStr.split(',') : []
      } else {
        this.formData.extendMonitorFieldStr = item.extendMonitorFieldStr
        this.formData.extendMonitorField = item.extendMonitorFieldStr ? item.extendMonitorFieldStr.split(',') : []
      }
      var xAxis_data = item.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
      var monitorFieldStr = this.formData.monitorFieldType === 1 ? this.formData.monitorFieldStr : this.formData.extendMonitorFieldStr
      this.renderEcharts(this.formData.echartType, 'dialogEchartId', monitorFieldStr, xAxis_data, true)
    },
    deleteEcharts(id) {
      this.layout = this.layout.filter(item => {
        return item.i !== id
      })
    },
    // 保存模板
    saveTemplate() {
      var params = {
        dataSourceType: this.dataSourceType,
        monitorPanelDatas: this.layout,
      }
      saveTemplateData(
        params
      ).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }).catch(err => {
        console.log(err)
      })
    },
    // 保存监控指标图表数据
    submitForm(refForm) {
      this.$refs[refForm].validate((valid) => {
        if (valid) {
          this.isaddLoading = true
          // 编辑
          if (this.curID !== null) {
            this.layout = this.layout.filter(item => {
              if (item.i === this.curID) {
                item.name = this.formData.name
                item.echartType = this.formData.echartType
                item.monitorFieldStr = this.formData.monitorFieldStr
                item.monitorFieldType = this.formData.monitorFieldType
                item.extendMonitorFieldStr = this.formData.extendMonitorFieldStr
              }
              return item
            })
            var xAxis_data = this.formData.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
            var monitorFieldStr = this.formData.monitorFieldType === 1 ? this.formData.monitorFieldStr : this.formData.extendMonitorFieldStr
            this.renderEcharts(this.formData.echartType, 'echart_' + this.curID, monitorFieldStr, xAxis_data)
          } else { // 新增
            var itemW = 6
            var itemH = 8
            var addItem = {
              'x': 0,
              'y': this.layoutMap.length,
              'w': itemW,
              'h': itemH,
              'i': this.layout[this.layout.length - 1] ? parseInt(this.layout[this.layout.length - 1].i) + 1 : 0,
              'name': this.formData.name,
              'echartType': this.formData.echartType,
              'monitorFieldStr': this.formData.monitorFieldStr,
              'monitorFieldType': this.formData.monitorFieldType,
              'extendMonitorFieldStr': this.formData.extendMonitorFieldStr,
            }
            if (this.layoutMap.length) {
              // console.log(this.layoutMap.length);
              for (let r = 0, rLen = this.layoutMap.length; r < rLen; r++) {
                for (let c = 0; c <= (this.layoutColNum - itemW); c++) {
                  var res = this.regionalTest(c, r, itemW, rLen > (r + itemH) ? itemH : rLen - r)
                  if (res.result) {
                    // 更新添加数据内容
                    addItem = {
                      'x': res.x,
                      'y': res.y,
                      'w': itemW,
                      'h': itemH,
                      'i': parseInt(this.layout[this.layout.length - 1].i) + 1,
                      'name': this.formData.name,
                      'echartType': this.formData.echartType,
                      'monitorFieldStr': this.formData.monitorFieldStr,
                      'monitorFieldType': this.formData.monitorFieldType,
                      'extendMonitorFieldStr': this.formData.extendMonitorFieldStr,
                    }
                    c = this.layoutColNum + 1
                    r = rLen + 1
                  } else {
                    c = res.offsetX
                  }
                }
              }
            }
            // 更新二维数组地图
            for (let itemR = 0; itemR < itemH; itemR++) {
              for (let itemC = 0; itemC < itemW; itemC++) {
                // 如果没有该行，初始化
                if (!this.layoutMap[addItem.y + itemR]) {
                  this.layoutMap[addItem.y + itemR] = new Array(this.layoutColNum)
                  for (let i = 0; i < this.layoutColNum; i++) {
                    this.layoutMap[addItem.y + itemR][i] = 0
                  }
                }
                // 标记点
                this.layoutMap[addItem.y + itemR][addItem.x + itemC] = 1
              }
            }
            // 添加数据
            this.layout.push(addItem)
            this.$nextTick(() => {
              var xAxis_data = addItem.monitorFieldType === 1 ? this.basic_xAxis_data : this.extend_xAxis_data
              var monitorFieldStr = addItem.monitorFieldType === 1 ? addItem.monitorFieldStr : addItem.extendMonitorFieldStr
              this.renderEcharts(addItem.echartType, 'echart_' + addItem.i, monitorFieldStr, xAxis_data)
            })
          }
          this.dialogVisible = false
          this.isaddLoading = false
        } else {
          this.isaddLoading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存面板数据
    saveDashboard() {
      this.isDatabaseLoading = true
      var params = {
        dataSourceType: this.dataSourceType,
        dataSourceId: this.dataSourceId,
        monitorPanelDatas: this.layout,
      }
      var getDataApi = this.dataSourceType === 1 ? saveDashboardData : saveOracleDashboardData
      getDataApi(
        params
      ).then(() => {
        this.isDatabaseLoading = false
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }).catch(err => {
        this.isDatabaseLoading = false
        console.log(err)
      })
    },
    // 根据图表类型的不同渲染不同的图表
    renderEcharts(type, id, monitorFieldStr, xAxis_data, isClear = false) {
      var series_data = []
      if (type === 'stat') {
        series_data = this.monitorFieldValue[monitorFieldStr]
      } else {
        var monitorFieldList = monitorFieldStr ? monitorFieldStr.split(',') : []
        monitorFieldList.forEach(it => {
          var series_data_dict = {
            name: it,
            data: this.monitorFieldValue[it]
          }
          series_data.push(series_data_dict)
        })
      }
      if (type === 'stat') {
        var text_value = series_data && series_data.length > 0 ? series_data[series_data.length - 1] : ''
        this.$nextTick(() => {
          this.initEcharts(id, echarts_option.statOptionInfo(text_value, series_data), isClear)
        })
      } else if (type === 'line') {
        this.$nextTick(() => {
          this.initEcharts(id, echarts_option.lineOptionInfo(xAxis_data, series_data), isClear)
        })
      } else if (type === 'bar') {
        this.$nextTick(() => {
          this.initEcharts(id, echarts_option.barOptionInfo(xAxis_data, series_data), isClear)
        })
      }
    },
    // 初始化表格数据
    initEcharts(id, option, isClear = false) {
      // 基于准备好的dom，初始化echarts实例
      const broadband_chart = this.$echarts.init(
        document.getElementById(id)
      )
      if (isClear) {
        broadband_chart.clear()
      }
      broadband_chart.setOption(option)
      broadband_chart.resize()
      window.addEventListener('resize', () => {
        broadband_chart.resize()
      })
      window.addEventListener('click', () => {
        broadband_chart.resize()
      })
      window.addEventListener('mousemove', () => {
        broadband_chart.resize()
      })
    },
    // 刷新
    refresh() {
      this.getEchartData()
      this.$message({
        type: 'success',
        message: '刷新成功'
      })
    },
    // 区域检测 x,y 二维数据地图起始坐标点  w,h 检测区域宽高
    regionalTest(x, y, w, h) {
      // 定义返回 x,y 偏移 及 是否有空位置
      var offsetX = 0
      var offsetY = 0
      var res = true
      // 按区域循环检测 二维数组地图
      for (let r = 0; r < w; r++) {
        for (let c = 0; c <= h; c++) {
          var point = this.layoutMap[y + r] ? this.layoutMap[y + r][x + c] : 0
          // 如该点被占据 记录偏移值
          if (point === 1) {
            res = false
            offsetX = offsetX > (x + c) ? offsetX : x + c
            offsetY = offsetY > (y + r) ? offsetY : y + r
          }
        }
      }
      return {
        result: res,
        offsetX: offsetX,
        x: x,
        y: y
      }
    },
    // 生成二维数组地图
    genereatePlaneArr(data) {
      var map = []
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          var one = data[i]
          // 循环行
          for (var r = one.y; r < (one.y + one.h); r++) {
            // 循环列
            for (var c = one.x; c < (one.x + one.w); c++) {
              // 检修当前行是否存在
              if (!map[r]) {
                map[r] = new Array(this.layoutColNum)

                for (let i = 0; i < this.layoutColNum; i++) {
                  map[r][i] = 0
                }
              }
              // 占据为1
              map[r][c] = 1
            }
          }
        }
      }
      return map
    },
    // 组件更新完成生命周期
    layoutReadyEvent: function() {
      // 当插件加载完成后  获取现在的二维地图树
      this.layoutMap = this.genereatePlaneArr(this.layout)
    },
    layoutUpdatedEvent: function() {
      // 当插件内容布局发生变化后  获取现在的二维地图树
      this.layoutMap = this.genereatePlaneArr(this.layout)
    },
  },
}
</script>

<style lang="scss">
.vue-grid-item.vue-grid-placeholder {
  background: #1890ff;
  opacity: 0.2;
}

.reset_card{
  background-color: #ffffff;
  height: 100%;
  border: 1px solid #adadad;
  border-radius: 3px;
  position: relative;
  .reset_card_title{
    height: 40px;
    line-height: 30px;
    border-bottom: 1px solid #ebebeb;
    padding: 5px 10px;
    font-size: 14px;
  }
  .reset_card_body{
    padding: 15px;
    height: calc(100% - 40px);
    position: relative;
    .reset_card_operate{
      position: absolute;
      height: 40px;
      top: -30px;
      right: 10px;
      color: #1890ff;
      font-size: 16px;
      cursor: pointer;
      span{
        display: inline-block;
      }
      .el-icon-delete{
        color: red;
        margin-left: 5px;
      }
    }
    //.reset_card_body_title{
    //  position: absolute;
    //  top: 20%;
    //  left: 20%;
    //  font-size: 50px;
    //  transform: scale(0.7);
    //}
  }
  .reset_card_footer{
    position: absolute;
    bottom: -3px;
    right: -2px;
    .el-icon-arrow-down{
      font-size: 14px;
      transform: rotate(-45deg);
    }
  }
  .reset_card_footer:hover{
    cursor: nw-resize;
  }
}

.monitor_title{
  margin: auto 12px;
  display: flex;
  justify-content: space-between;
  .el-form--inline .el-form-item{
    margin-bottom: 5px;
  }
  .el-form-item--medium .el-form-item__label {
    white-space: nowrap !important;
    padding-right: 5px;
  }
  .monitor_title_right{
    display: flex;
    align-items: center;
    .icon-button{
      margin-left: 5px;
      font-size: 20px;
      color: #1890ff;
    }
  }

}
.dialogEchart{
  width: 100%;
  height: 230px;
  margin-bottom: 15px;
  padding: 5px;
}
</style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 20px 10px;
  //margin: 0px !important;
  min-width: 1300px;
}

</style>
