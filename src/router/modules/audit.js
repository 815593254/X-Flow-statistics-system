/**
 * 审计管理员路由列表
 */

import Layout from '@/layout'

/** When your routing table is too long, you can split it into small modules **/

const auditRouter = [
  // // 审计管理
  // {
  //   path: '/audit-management',
  //   component: Layout,
  //   redirect: '/audit-management/operate-audit',
  //   meta: { title: 'auditManagement', icon: 'audit', role_type: 'audit', number: '1', }, // todo number要修改
  //   disabled: false,
  //   children_count: 2,
  //   children: [
  //     //  操作审计
  //     {
  //       path: 'operate-audit',
  //       component: () => import('@/views/audit-management/operate-audit/index'),
  //       meta: { title: 'operateAudit', role_type: 'audit', number: '1-1', },
  //       disabled: false,
  //       redirect: '/audit-management/operate-audit/',
  //       children_count: 1,
  //       children: [
  //         {
  //           path: '/',
  //           component: () => import('@/views/audit-management/operate-audit/operate-audit/index'),
  //           name: 'OperateAudit',
  //           meta: { title: 'OperateAudit', label: 'operateAudit', activeMenu: '/audit-management/operate-audit', role_type: 'audit', number: '1-1-1', },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //     // 系统审计
  //     {
  //       path: 'system-audit',
  //       component: () => import('@/views/audit-management/system-audit/index'),
  //       meta: { title: 'systemAudit', role_type: 'audit', number: '1-2', },
  //       disabled: true,
  //       redirect: '/audit-management/system-audit/',
  //       children_count: 1,
  //       children: [
  //         {
  //           path: '/',
  //           component: () => import('@/views/audit-management/system-audit/system-audit/index'),
  //           name: 'SystemAudit',
  //           meta: { title: 'SystemAudit', label: 'systemAudit', activeMenu: '/audit-management/system-audit', role_type: 'audit', number: '1-2-1', },
  //           hidden: true
  //         },
  //       ]
  //     },
  //   ]
  // },
]

export default auditRouter
