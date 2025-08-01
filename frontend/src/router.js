import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Dashboard from './components/Dashboard.vue';
import Duenos from './components/Duenos.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/duenos',
    name: 'Duenos',
    component: Duenos
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 