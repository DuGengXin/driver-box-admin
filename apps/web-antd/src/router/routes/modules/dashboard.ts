import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: -1,
      title: $t('page.dashboard.devices'),
    },
    name: 'Dashboard',
    path: '/',
    children: [
      {
        name: 'DeviceList',
        path: '/devices',
        component: () => import('#/views/dashboard/devices/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:area-chart',
          title: $t('page.dashboard.devices'),
          hideInMenu: true,
        },
      },
    ],
  },
];

export default routes;
