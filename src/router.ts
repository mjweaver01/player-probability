import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Probability from './pages/Probability.vue';
import History from './pages/History.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Probability',
    component: Probability,
  },
  {
    path: '/history',
    name: 'History',
    component: History,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
