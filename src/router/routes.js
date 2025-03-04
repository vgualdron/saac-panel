const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Iniciar Sesión', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/validate-card/:id',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Validar asociado', component: () => import('pages/ValidateCard.vue') },
    ],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Inicio', component: () => import('pages/Home.vue') },
    ],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Roles',
        component: () => import('pages/Role.vue'),
        meta: { permissions: ['role.list'] },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Usuarios',
        component: () => import('pages/User.vue'),
        meta: { permissions: ['user.list'] },
      },
    ],
  },
  {
    path: '/new',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Nuevos asociados',
        component: () => import('pages/New.vue'),
        meta: { permissions: ['new.list'] },
      },
    ],
  },
  {
    path: '/param',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Parametros',
        component: () => import('pages/Configuration.vue'),
        meta: { permissions: ['parameter.list'] },
      },
    ],
  },
  {
    path: '/shop',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Convenios',
        component: () => import('src/pages/ApprovedPoints.vue'),
        meta: { permissions: [] },
      },
    ],
  },
  {
    path: '/report-dinamic',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Reportes Dinamicos',
        component: () => import('pages/ReportDinamic.vue'),
        meta: { permissions: ['reportsDinamic.list'] },
      },
    ],
  },
  {
    path: '/approved-points',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Aprobar progrepuntos',
        component: () => import('pages/ApprovedPoints.vue'),
        meta: { permissions: ['approvedPoints.list'] },
      },
    ],
  },
  {
    path: '/statuses',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Gestionar estados',
        component: () => import('pages/Statuses.vue'),
        meta: { permissions: ['statuses.list'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('pages/Error404.vue'),
  },
  {
    path: '/unauthorized',
    component: () => import('pages/Error401.vue'),
  },
];

export default routes;
