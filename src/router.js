import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth.js';

const routes = [
  { path: '/', component: () => import('./views/HomeView.js') },
  { path: '/login', component: () => import('./views/auth/LoginView.js') },
  { path: '/register', component: () => import('./views/auth/RegisterView.js') },
  { path: '/forgot-password', component: () => import('./views/auth/ForgotPasswordView.js') },
  { path: '/reset-password', component: () => import('./views/auth/ResetPasswordView.js') },
  { path: '/verify-email', component: () => import('./views/auth/VerifyEmailView.js') },
  { path: '/products', component: () => import('./views/shop/ProductListView.js') },
  { path: '/products/:publicId', component: () => import('./views/shop/ProductDetailView.js') },
  { path: '/cart', component: () => import('./views/shop/CartView.js') },
  {
    path: '/checkout',
    component: () => import('./views/account/CheckoutView.js')
  },
  {
    path: '/payment/:attemptId',
    component: () => import('./views/account/PaymentView.js')
  },
  { path: '/delivery/:token', component: () => import('./views/account/DeliveryView.js') },
  {
    path: '/profile',
    component: () => import('./views/account/ProfileView.js'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
