/**
 * 系统管理员路由列表
 */

import Layout from '@/layout'

/** When your routing table is too long, you can split it into small modules **/

const systemRouter = [
  // // 安全分析
  // {
  //   path: '/safety-analysis',
  //   component: Layout,
  //   redirect: '/safety-analysis/protection-record',
  //   meta: { title: 'safetyAnalysis', icon: 'safety-analysis', role_type: 'system', number: '3' },
  //   disabled: false,
  //   children_count: 7,
  //   children: [
  //     // 防护记录
  //     {
  //       path: 'protection-record',
  //       component: () => import('@/views/safety-analysis/protection-record/index'),
  //       name: 'ProtectionRecord',
  //       meta: { title: 'protectionRecord', role_type: 'system', number: '3-1' },
  //       disabled: false,
  //       redirect: '/safety-analysis/protection-record/intrusion',
  //       children_count: 4,
  //       children: [
  //         // 入侵记录
  //         {
  //           path: 'intrusion',
  //           component: () => import('@/views/safety-analysis/protection-record/intrusion/index'),
  //           name: 'Intrusion',
  //           meta: { title: 'Intrusion', label: 'intrusion', activeMenu: '/safety-analysis/protection-record', role_type: 'system', number: '3-1-1' },
  //           hidden: true,
  //         },
  //         // 阻断记录
  //         {
  //           path: 'block',
  //           component: () => import('@/views/safety-analysis/protection-record/block/index'),
  //           name: 'Block',
  //           meta: { title: 'Block', label: 'block', activeMenu: '/safety-analysis/protection-record', role_type: 'system', number: '3-1-2' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //         // 木马记录
  //         {
  //           path: 'trojanHorse',
  //           component: () => import('@/views/safety-analysis/protection-record/trojan-horse/index'),
  //           name: 'TrojanHorse',
  //           meta: { title: 'TrojanHorse', label: 'trojanHorse', activeMenu: '/safety-analysis/protection-record', role_type: 'system', number: '3-1-3' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //         // CC记录
  //         {
  //           path: 'CC',
  //           component: () => import('@/views/safety-analysis/protection-record/CC/index'),
  //           name: 'CC',
  //           meta: { title: 'CC', label: 'CC', activeMenu: '/safety-analysis/protection-record', role_type: 'system', number: '3-1-4' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //       ]
  //     },
  //     // 网络流程
  //     {
  //       path: 'network-flow',
  //       component: () => import('@/views/safety-analysis/network-flow/index'),
  //       name: 'NetworkFlow',
  //       meta: { title: 'networkFlow', role_type: 'system', number: '3-2' },
  //       disabled: false,
  //       redirect: '/safety-analysis/network-flow/interfaceData',
  //       children_count: 3,
  //       children: [
  //         {
  //           path: 'interfaceData',
  //           component: () => import('@/views/safety-analysis/network-flow/interfaceData/index'),
  //           name: 'InterfaceData',
  //           meta: { title: 'InterfaceData', label: 'interfaceData', activeMenu: '/safety-analysis/network-flow', role_type: 'system', number: '3-2-1' },
  //           hidden: true,
  //         },
  //         {
  //           path: 'accessData',
  //           component: () => import('@/views/safety-analysis/network-flow/accessData/index'),
  //           name: 'AccessData',
  //           meta: { title: 'AccessData', label: 'accessData', activeMenu: '/safety-analysis/network-flow', role_type: 'system', number: '3-2-2' },
  //           hidden: true,
  //         },
  //         {
  //           path: 'regionStatus',
  //           component: () => import('@/views/safety-analysis/network-flow/regionStatus/index'),
  //           name: 'RegionStatus',
  //           meta: { title: 'RegionStatus', label: 'regionStatus', activeMenu: '/safety-analysis/network-flow', role_type: 'system', number: '3-2-3' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //   ]
  // },

  // // 系统管理
  // {
  //   path: '/system-management',
  //   component: Layout,
  //   redirect: '/system-management/system-management/device-info',
  //   meta: { title: 'systemManagement', icon: 'settings', role_type: 'system', number: '4' },
  //   disabled: false,
  //   children_count: 8,
  //   children: [
  //     // 设备信息
  //     {
  //       path: 'device-info',
  //       component: () => import('@/views/system-management/device-info/index'),
  //       // name: 'DeviceInfo',
  //       meta: { title: 'deviceInfo', role_type: 'system', number: '4-1' },
  //       disabled: false,
  //       redirect: '/system-management/device-info/',
  //       children_count: 1,
  //       children: [
  //         // 设备信息
  //         {
  //           path: '/',
  //           component: () => import('@/views/system-management/device-info/device-info/index'),
  //           name: 'DeviceInfo',
  //           meta: { title: 'DeviceInfo', label: 'deviceInfo', activeMenu: '/system-management/device-info', role_type: 'system', number: '4-1-1' },
  //           hidden: true,
  //         },
  //       ]
  //     },

  //     // 授权信息
  //     {
  //       path: 'authorize-info',
  //       component: () => import('@/views/system-management/authorize-info/index'),
  //       // name: 'AuthorizeInfo',
  //       meta: { title: 'authorizeInfo', role_type: 'system', number: '4-2', },
  //       disabled: true,
  //       children_count: 1,
  //       children: [
  //         // 授权信息
  //         {
  //           path: '/',
  //           component: () => import('@/views/system-management/authorize-info/authorize-info/index'),
  //           name: 'AuthorizeInfo',
  //           meta: { title: 'AuthorizeInfo', label: 'authorizeInfo', activeMenu: '/system-management/authorize-info', role_type: 'system', number: '4-2-1' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //       ]
  //     },
  //     // 系统时间
  //     {
  //       path: 'system-time',
  //       component: () => import('@/views/system-management/system-time/index'),
  //       // name: 'SystemTime',
  //       meta: { title: 'systemTime', role_type: 'system', number: '4-3' },
  //       disabled: true,
  //       children_count: 1,
  //       children: [
  //         // 系统时间
  //         {
  //           path: '/',
  //           component: () => import('@/views/system-management/system-time/system-time/index'),
  //           name: 'SystemTime',
  //           meta: { title: 'SystemTime', label: 'systemTime', activeMenu: '/system-management/system-time', role_type: 'system', number: '4-3-1' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //       ]
  //     },
  //     // 日志管理
  //     {
  //       path: 'log-management',
  //       component: () => import('@/views/system-management/log-management/index'),
  //       // name: 'LogManagement',
  //       meta: { title: 'logManagement', role_type: 'system', number: '4-4' },
  //       disabled: true,
  //       children_count: 1,
  //       children: [
  //         // 系统时间
  //         {
  //           path: '/',
  //           component: () => import('@/views/system-management/log-management/log-management/index'),
  //           name: 'LogManagement',
  //           meta: { title: 'LogManagement', label: 'logManagement', activeMenu: '/system-management/log-management', role_type: 'system', number: '4-4-1' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //       ]
  //     },

  //     // 系统安全
  //     {
  //       path: 'system-safety',
  //       component: () => import('@/views/system-management/system-safety/index'),
  //       name: 'SystemSafety',
  //       meta: { title: 'systemSafety', role_type: 'system', number: '4-5' },
  //       disabled: false,
  //       redirect: '/system-management/system-safety/policy-update',
  //       children_count: 4,
  //       children: [
  //         // 规则更新
  //         {
  //           path: 'policy-update',
  //           component: () => import('@/views/system-management/system-safety/policy-update/index'),
  //           name: 'PolicyUpdate',
  //           meta: { title: 'PolicyUpdate', label: 'policyUpdate', activeMenu: '/system-management/system-safety', role_type: 'system', number: '4-5-1' },
  //           hidden: true,
  //         },
  //         // 邮件告警
  //         {
  //           path: 'email-alert',
  //           component: () => import('@/views/system-management/system-safety/email-alert/index'),
  //           name: 'EmailAlert',
  //           meta: { title: 'EmailAlert', label: 'emailAlert', activeMenu: '/system-management/system-safety', role_type: 'system', number: '4-5-2' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //         // 备份恢复
  //         {
  //           path: 'backup-restore',
  //           component: () => import('@/views/system-management/system-safety/backup-restore/index'),
  //           name: 'BackupRestore',
  //           meta: { title: 'BackupRestore', label: 'backupRestore', activeMenu: '/system-management/system-safety', role_type: 'system', number: '4-5-3' },
  //           hidden: true,
  //           disabled: true,
  //         },
  //         // 登录安全
  //         {
  //           path: 'login-safety',
  //           component: () => import('@/views/system-management/system-safety/login-safety/index'),
  //           name: 'LoginSafety',
  //           meta: { title: 'LoginSafety', label: 'loginSafety', activeMenu: '/system-management/system-safety', role_type: 'system', number: '4-5-4' },
  //           hidden: true,
  //         },
  //       ]
  //     },

  //   ]
  // },

  // // 对象管理
  // {
  //   path: '/object-management',
  //   component: Layout,
  //   redirect: '/object-management/host-domain',
  //   meta: { title: 'objectManagement', icon: 'object', role_type: 'system', number: '5' },
  //   disabled: false,
  //   children_count: 2,
  //   children: [
  //     // 主机域名
  //     {
  //       path: 'host-domain',
  //       component: () => import('@/views/object-management/host-domain/index'),
  //       // name: 'HostDomain',
  //       meta: { title: 'hostDomain', role_type: 'system', number: '5-1' },
  //       disabled: false,
  //       redirect: '/object-management/host-domain/',
  //       children_count: 1,
  //       children: [
  //         // 主机域名-列表页
  //         {
  //           path: '/',
  //           component: () => import('@/views/object-management/host-domain/host-domain/index'),
  //           name: 'HostDomain',
  //           meta: { title: 'HostDomain', label: 'hostDomain', activeMenu: '/object-management/host-domain', role_type: 'system', number: '5-1-1' },
  //           hidden: true,
  //         },
  //         // 主机域名- 新增页
  //         {
  //           path: 'new',
  //           component: () => import('@/views/object-management/host-domain/components/InputForm'),
  //           name: 'HostDomainNew',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- 编辑页
  //         {
  //           path: 'edit/:id',
  //           component: () => import('@/views/object-management/host-domain/components/InputForm'),
  //           name: 'HostDomainEdit',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- 防护规则
  //         {
  //           path: 'sec-rule/:id',
  //           component: () => import('@/components/SecRule'),
  //           name: 'SecRule',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- 缓存规则
  //         {
  //           path: 'cache-rule/:id',
  //           component: () => import('@/components/CacheRule'),
  //           name: 'CacheRule',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- CC规则
  //         {
  //           path: 'anti-cc/:id',
  //           component: () => import('@/components/AntiCC'),
  //           name: 'AntiCC',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- 攻击响应
  //         {
  //           path: 'attack-response/:id',
  //           component: () => import('@/components/AttackResponse'),
  //           name: 'AttackResponse',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 主机域名- IP规则
  //         {
  //           path: 'ip-rule/:id',
  //           component: () => import('@/components/IPRule'),
  //           name: 'IPRule',
  //           meta: { title: 'HostDomain', activeMenu: '/object-management/host-domain', role_type: 'system' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //     // 证书管理
  //     {
  //       path: 'certificate-management',
  //       component: () => import('@/views/object-management/certificate-management/index'),
  //       meta: { title: 'certificateManagement', role_type: 'system', number: '5-2' },
  //       disabled: false,
  //       children_count: 1,
  //       children: [
  //         // 证书管理列表页
  //         {
  //           path: '',
  //           component: () => import('@/views/object-management/certificate-management/certificate-management/index'),
  //           name: 'CertificateManagement',
  //           meta: { title: 'CertificateManagement', label: 'certificateManagement', activeMenu: '/object-management/certificate-management', role_type: 'system', number: '5-2-1' },
  //           hidden: true,
  //         },
  //         // 证书管理-新增
  //         {
  //           path: 'new',
  //           component: () => import('@/views/object-management/certificate-management/components/InputForm'),
  //           name: 'CertificateManagementNew',
  //           meta: { title: 'CertificateManagement', activeMenu: '/object-management/certificate-management', role_type: 'system' },
  //           hidden: true,
  //         },
  //         // 证书管理-新增
  //         {
  //           path: 'edit/:id',
  //           component: () => import('@/views/object-management/certificate-management/components/InputForm'),
  //           name: 'CertificateManagementEdit',
  //           meta: { title: 'CertificateManagement', activeMenu: '/object-management/certificate-management', role_type: 'system' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //   ]
  // },

  // // 安全策略
  // {
  //   path: '/safety-policy',
  //   component: Layout,
  //   redirect: '/safety-policy/global-param',
  //   meta: { title: 'safetyPolicy', icon: 'StrategySet', role_type: 'system', number: '6' },
  //   disabled: false,
  //   children_count: 2,
  //   children: [
  //     // 全局参数
  //     {
  //       path: 'global-param',
  //       component: () => import('@/views/safety-policy/global-param/index'),
  //       name: 'GlobalParam',
  //       meta: { title: 'globalParam', role_type: 'system', number: '6-1' },
  //       disabled: false,
  //       redirect: '/safety-policy/global-param/global-sec-rule',
  //       children_count: 1,
  //       children: [
  //         {
  //           path: 'global-sec-rule',
  //           component: () => import('@/views/safety-policy/global-param/sec-rule/index'),
  //           name: 'GlobalSecRule',
  //           meta: { title: 'GlobalSecRule', label: 'protectionRule', activeMenu: '/safety-policy/global-param', role_type: 'system', number: '6-1-1' },
  //           hidden: true,
  //         },
  //         {
  //           path: 'global-sec-rule/new',
  //           component: () => import('@/views/safety-policy/global-param/sec-rule/components/InputForm'),
  //           name: 'GlobalSecRuleNew',
  //           meta: { title: 'GlobalSecRule', activeMenu: '/safety-policy/global-param', role_type: 'system' },
  //           hidden: true,
  //         },
  //         {
  //           path: 'global-sec-rule/edit/:id',
  //           component: () => import('@/views/safety-policy/global-param/sec-rule/components/InputForm'),
  //           name: 'GlobalSecRuleEdit',
  //           meta: { title: 'GlobalSecRule', activeMenu: '/safety-policy/global-param', role_type: 'system' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //     // 访问控制
  //     {
  //       path: 'access-control',
  //       component: () => import('@/views/safety-policy/access-control/index'),
  //       meta: { title: 'accessControl', role_type: 'system', number: '6-2' },
  //       disabled: true,
  //       redirect: '/safety-policy/access-control/',
  //       children_count: 1,
  //       children: [
  //         {
  //           path: '/',
  //           component: () => import('@/views/safety-policy/access-control/access-control/index'),
  //           name: 'AccessControl',
  //           meta: { title: 'AccessControl', label: 'accessControl', activeMenu: '/safety-policy/access-control', role_type: 'system', number: '6-2-1' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //   ]
  // },

  // // 网络配置
  // {
  //   path: '/network-config',
  //   component: Layout,
  //   redirect: '/network-config/network-interface',
  //   meta: { title: 'networkConfig', icon: 'Network', role_type: 'system', number: '7' },
  //   disabled: false,
  //   children_count: 1,
  //   children: [
  //     // 网络接口
  //     {
  //       path: 'network-interface',
  //       component: () => import('@/views/network-config/network-interface/index'),
  //       meta: { title: 'networkInterface', role_type: 'system', number: '7-1' },
  //       disabled: false,
  //       redirect: '/network-config/network-interface/',
  //       children_count: 1,
  //       children: [
  //         {
  //           path: '/',
  //           component: () => import('@/views/network-config/network-interface/network-interface/index'),
  //           name: 'NetworkInterface',
  //           meta: { title: 'NetworkInterface', label: 'networkInterface', activeMenu: '/network-config/network-interface', role_type: 'system', number: '7-1-1' },
  //           hidden: true,
  //         },
  //       ]
  //     },
  //   ]
  // },
]

export default systemRouter
