const manyData = {
  state: {
    role: [
      {
        id: 1,
        name: 'admin',
        desc: '管理员角色',
        is_admin: true,
        permission: [],
        create_time: 1651125239,
      },
      {
        id: 2,
        name: '员工',
        desc: '',
        is_admin: false,
        permission: [],
        create_time: 1651125239,
      },
    ], // 角色数据
    user: [
      {
        id: 1,
        username: 'admin',
        role_name: 'admin',
        role_id: 1,
        is_lock: false,
        last_login_time: 1651125239,
      }
    ],
    db_type_echarts: [
      { value: 105, name: 'MySQL' },
      { value: 9, name: 'Cassandra' },
      { value: 62, name: 'Oracle' },
      { value: 70, name: 'MariaDB' },
      { value: 10, name: 'PostgreSQL' },
      { value: 23, name: 'MongoDB' },
    ],
    features_echarts: [
      { value: 205, name: '身份证' },
      { value: 112, name: '手机号码' },
      { value: 231, name: 'IP' },
      { value: 30, name: '姓名' },
      { value: 43, name: '工号' },
      { value: 59, name: '家庭住址' },
    ],
    db_type: [
      { value: 1, name: 'MySQL' },
      { value: 2, name: 'Oracle' },
      { value: 3, name: 'MariaDB' },
      { value: 4, name: 'PostgreSQL' },
      { value: 5, name: 'MongoDB' },
      { value: 6, name: 'Cassandra' },
    ],
  },
  setRole(val, type) { // 修改数据
    if (type === 'add') {
      this.state.role.unshift(val)
    } else if (type === 'edit') {
      this.state.role.unshift(val)
    }
    this.state.aaa = val
  }
}
export default manyData
