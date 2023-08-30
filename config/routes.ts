export default [
  {path: '/user', layout: false, routes: [{path: '/user/login', component: './User/Login'}]},
  // { path: '/welcome', icon: 'smile', component: './Welcome' },
  {path: '/add_chart', name: '智能分析（同步）', icon: 'barChart', component: './AddChart'},
  {path: '/add_chart_async', name: '智能分析（异步）', icon: 'barChart', component: './AddChartAsync'},
  {path: '/my_chart', name: '我的图表', icon: 'pieChart', component: './MyChart'},
  {path: '/', redirect: '/add_chart'},

  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {path: '/admin', name: '管理页面', redirect: '/admin/sub-page'},
      {path: '/admin/sub-page', name: '管理页面2', component: './Admin'},
    ],
  },
  {icon: 'table', path: '/list', component: './TableList'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
