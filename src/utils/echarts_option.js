/**
 * 配置echats的一些option选项，方便监控数据库功能添加图表类型
 * option中 参数：
 * @param grid  是配置图表在demo中的大小，top 是距离demo上面的距离，bottom是距离demo下面的距离，left和right以此类推
 */

const echarts_option = {
  /**
   * 柱状图的option选项，
   * @param xAxis_data 横坐标的值格式是[value1,value2,value3,....]
   * @param series_data 纵坐标的值格式是[value1,value2,value3,....]，和 xAxis_data的值长度保持一致
   */
  barOptionInfo(xAxis_data, series_data) {
    for (var i = 0; i < series_data.length; i++) {
      var item = series_data[i]
      item['type'] = 'bar'
    }
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: xAxis_data,
      },
      yAxis: {
        type: 'value'
      },
      grid: {
        left: 0,
        right: 10,
        top: 10,
        bottom: 30,
        containLabel: true
      },
      series: series_data
    }
    return option
  },
  /**
   * 柱状图的option选项，
   * @param xAxis_data 横坐标的值格式是[value1,value2,value3,....]
   * @param series_data 纵坐标的值格式是[value1,value2,value3,....]，和 xAxis_data的值长度保持一致
   */
  lineOptionInfo(xAxis_data, series_data) {
    for (var i = 0; i < series_data.length; i++) {
      var item = series_data[i]
      item['type'] = 'line'
      item['symbol'] = 'circle'
    }
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        type: 'scroll',
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
        data: xAxis_data
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: series_data
    }
    return option
  },
  statOptionInfo(text_value, series_data) {
    const option = {
      color: '#B7B7E9',
      title: {
        text: text_value,
        left: 'center',
        top: '30%',
        textStyle: {
          fontSize: 50,
          transform: 'scale(0.7)'
        }
      },
      xAxis: {
        show: false,
        type: 'category',
        boundaryGap: false,
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      grid: {
        left: 0,
        right: 10,
        top: '50%',
        bottom: 0,
        containLabel: false
      },
      series: [
        {
          data: series_data,
          type: 'line',
          symbol: 'none',
          areaStyle: {}
        }
      ]
    }
    return option
  },
}

export default echarts_option
