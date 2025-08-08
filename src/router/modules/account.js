/**
 * 账户管理员路由列表
 */

import Layout from '@/layout'

/** When your routing table is too long, you can split it into small modules **/

const accountRouter = [
  // 流量分析
  {
    path: '/flow-analysis',
    component: Layout,
    redirect: '/flow-analysis/interface-flow',
    disabled: false,
    meta: { title: '流量分析', icon: 'el-icon-stopwatch', number: '1' },
    children_count: 2,
    children: [
      //  接口流量
      {
        path: 'interface-flow',
        component: () => import('@/views/flow-analysis/interface-flow/index'),
        name: 'InterfaceFlow',
        disabled: false,
        meta: { title: '接口流量', activeMenu: '/flow-analysis/interface-flow', number: '1-1', permission: [{ title: '实时流量', number: '1-1-1' },{ title: '历史流量', number: '1-1-2' }] },
        redirect: '/flow-analysis/interface-flow/realtime',
        // children_count: 2,
        children: [
          // 实时流量
          {
            path: 'realtime',
            component: () => import('@/views/flow-analysis/interface-flow/realtime/index'),
            name: 'InterfaceFlowRealtime',
            meta: { title: '实时流量', label: 'realtime', activeMenu: '/flow-analysis/interface-flow', number: '1-1-1',  },
            hidden: true,
          },
          // 历史流量
          {
            path: 'history',
            component: () => import('@/views/flow-analysis/interface-flow/history/index'),
            name: 'InterfaceFlowHistory',
            meta: { title: '历史流量', label: 'history', activeMenu: '/flow-analysis/interface-flow',  number: '1-1-2',  },
            hidden: true,
          },
        ]
      },
      //  IP流量
      {
        path: 'ip-flow',
        component: () => import('@/views/flow-analysis/ip-flow/index'),
        name: 'IpFlow',
        disabled: false,
        meta: { title: 'IP流量', activeMenu: '/flow-analysis/ip-flow', number: '1-2', permission: [{ title: '实时流量', number: '1-2-1' },{ title: '历史流量', number: '1-2-2' }] },
        redirect: '/flow-analysis/ip-flow/realtime',
        // children_count: 2,
        children: [
          // 实时流量
          {
            path: 'realtime',
            component: () => import('@/views/flow-analysis/ip-flow/realtime/index'),
            name: 'IpFlowRealtime',
            meta: { title: '实时流量', label: 'realtime', activeMenu: '/flow-analysis/ip-flow', number: '1-2-1',  },
            hidden: true,
          },
          // 历史流量
          {
            path: 'history',
            component: () => import('@/views/flow-analysis/ip-flow/history/index'),
            name: 'IpFlowHistory',
            meta: { title: '历史流量', label: 'history', activeMenu: '/flow-analysis/ip-flow', number: '1-2-2',  },
            hidden: true,
          },
        ]
      },
    ],
  },

  // // 流量分析
  // {
  //   path: '/flow-analysis',
  //   component: Layout,
  //   redirect: '/flow-analysis/interface-flow',
  //   disabled: false,
  //   meta: { title: '流量分析', icon: 'el-icon-stopwatch', number: '1' },
  //   children_count: 2,
  //   children: [
  //     //  接口流量
  //     {
  //       path: 'interface-flow',
  //       component: () => import('@/views/flow-analysis/interface-flow/index'),
  //       name: 'InterfaceFlow',
  //       disabled: false,
  //       meta: { title: '接口流量', activeMenu: '/flow-analysis/interface-flow', number: '1-1', permission: [{ title: '查看1', number: '1-1-see' }] },
  //       redirect: '/flow-analysis/interface-flow/realtime',
  //       // children_count: 2,
  //       children: [
  //         // 实时流量
  //         {
  //           path: 'realtime',
  //           component: () => import('@/views/flow-analysis/interface-flow/realtime/index'),
  //           name: 'InterfaceFlowRealtime',
  //           meta: { title: '实时流量', label: 'realtime', activeMenu: '/flow-analysis/interface-flow', number: '1-1-1', permission: [{ title: '查看', number: '1-1-1-see' }] },
  //           hidden: true,
  //         },
  //         // 历史流量
  //         {
  //           path: 'history',
  //           component: () => import('@/views/flow-analysis/interface-flow/history/index'),
  //           name: 'InterfaceFlowHistory',
  //           meta: { title: '历史流量', label: 'history', activeMenu: '/flow-analysis/interface-flow',  number: '1-1-2', permission: [{ title: '查看', number: '1-1-2-see' }] },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //     //  IP流量
  //     {
  //       path: 'ip-flow',
  //       component: () => import('@/views/flow-analysis/ip-flow/index'),
  //       name: 'IpFlow',
  //       disabled: false,
  //       meta: { title: 'IP流量', activeMenu: '/flow-analysis/ip-flow', number: '1-2', permission: [{ title: '查看2', number: '1-2-see' }] },
  //       redirect: '/flow-analysis/ip-flow/realtime',
  //       // children_count: 2,
  //       // children: [
  //       //   // 实时流量
  //       //   {
  //       //     path: 'realtime',
  //       //     component: () => import('@/views/flow-analysis/ip-flow/realtime/index'),
  //       //     name: 'IpFlowRealtime',
  //       //     meta: { title: '实时流量', label: 'realtime', activeMenu: '/flow-analysis/ip-flow', number: '1-2-1', permission: [{ title: '查看', number: '1-2-1-see' }] },
  //       //     hidden: true,
  //       //   },
  //       //   // 历史流量
  //       //   {
  //       //     path: 'history',
  //       //     component: () => import('@/views/flow-analysis/ip-flow/history/index'),
  //       //     name: 'IpFlowHistory',
  //       //     meta: { title: '历史流量', label: 'history', activeMenu: '/flow-analysis/ip-flow', number: '1-2-2', permission: [{ title: '查看', number: '1-2-2-see' }] },
  //       //     hidden: true,
  //       //   },
  //       // ]
  //     },
  //   ],
  // },

  // 用户管理
  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/user',
    disabled: false,
    meta: { title: '用户管理', icon: 'el-icon-s-custom', number: '4' },
    children_count: 3,
    children: [
      {
        path: 'user',
        component: () => import('@/views/user-management/user/index'),
        name: 'user',
        disabled: false,
        meta: { title: '用户', activeMenu: '/user-management/user', number: '4-1', permission: [{ title: '查看', number: '4-1-see' }, { title: '重置密码', number: '4-1-password' }, { title: '锁定', number: '4-1-lock' }, { title: '新增', number: '4-1-add' }, { title: '编辑', number: '4-1-edit' }, { title: '删除', number: '4-1-delete' }] }
      },
      {
        path: 'user-group',
        component: () => import('@/views/user-management/user-group/index'),
        name: 'userGroup',
        disabled: false,
        meta: { title: '用户组', activeMenu: '/user-management/user-group', number: '4-3', permission: [{ title: '查看', number: '4-3-see' }, { title: '新增', number: '4-3-add' }, { title: '编辑', number: '4-3-edit' }, { title: '删除', number: '4-3-delete' }] }
      },
      {
        path: 'role',
        component: () => import('@/views/user-management/role/index'),
        name: 'role',
        disabled: false,
        meta: { title: '角色', activeMenu: '/user-management/role', number: '4-2', permission: [{ title: '查看', number: '4-2-see' }, { title: '权限', number: '4-2-permission' }, { title: '新增', number: '4-2-add' }, { title: '编辑', number: '4-2-edit' }, { title: '删除', number: '4-2-delete' }] }
      },

    ],
  },

  // 系统管理
  {
    path: '/system-management',
    component: Layout,
    redirect: '/system-management/login-safety',
    disabled: false,
    meta: { title: '系统管理', icon: 'el-icon-setting', number: '5' },
    children_count: 2,
    children: [
      {
        path: 'login-safety',
        component: () => import('@/views/system-management/login-safety/index'),
        name: 'loginSafety',
        disabled: false,
        meta: { title: '登录安全', activeMenu: '/system-management/login-safety', number: '5-1', permission: [{ title: '查看', number: '5-1-see' }, { title: '保存', number: '5-1-save' }] }
      },
      {
        path: 'system-time',
        component: () => import('@/views/system-management/system-time/index'),
        name: 'systemTime',
        disabled: true,
        meta: { title: '系统时间', activeMenu: '/system-management/system-time', number: '5-2', permission: [{ title: '查看', number: '5-2-see' }, { title: '保存', number: '5-2-save' }] }
      },
    ],
  },

  // //  数据分析-数据资产报告
  // {
  //   path: '/asset-report/:id',
  //   component: () => import('@/views/data-analysis/asset-map/components/asset_report'),
  //   name: 'assetReport',
  //   disabled: false,
  //   hidden: true,
  //   meta: { title: '数据资产报告', activeMenu: '', number: '1-1-report' }
  // },

]

export default accountRouter
