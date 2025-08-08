const commonConfig = {
  state: {
    db_type: [
      { value: 1, name: 'MySQL' },
      { value: 2, name: 'Oracle' },
      { value: 3, name: 'MariaDB' },
      { value: 4, name: 'PostgreSQL' },
      { value: 5, name: 'MongoDB' },
      { value: 6, name: 'Cassandra' },
    ],
    taskProgress: {
      1: '扫描中',
      2: '扫描中',
      3: '扫描中',
      4: '扫描失败',
      5: '扫描中',
      6: '扫描中',
      7: '扫描成功',
      8: '扫描失败',
      9: '扫描中',
    }
  },
  setRole(val, type) { // 修改数据
    if (type === 'add') {
      this.state.dataLevelColorList.unshift(val)
    }
  }
}
export default commonConfig
