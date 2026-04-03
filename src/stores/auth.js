import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import api from '../lib/api.js';

export const useAuthStore = defineStore('auth', () => {
  const customer = ref(JSON.parse(localStorage.getItem('customer') || 'null'));
  const accessToken = ref(localStorage.getItem('access_token') || null);
  const loading = ref(false);

  const isAuthenticated = computed(() => Boolean(accessToken.value && customer.value));

  function setAuth(token, profile) {
    accessToken.value = token;
    customer.value = profile;
    localStorage.setItem('access_token', token);
    localStorage.setItem('customer', JSON.stringify(profile));
  }

  function clearAuth() {
    accessToken.value = null;
    customer.value = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('customer');
  }

  async function login(email, password) {
    loading.value = true;
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const token = data.access_token;
      localStorage.setItem('access_token', token);
      accessToken.value = token;
      await refreshProfile();
      return data;
    } finally {
      loading.value = false;
    }
  }

  async function register(payload) {
    return api.post('/auth/register', payload);
  }

  async function verifyEmail(payload) {
    return api.post('/auth/verify-email', payload);
  }

  async function forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  }

  async function resetPassword(payload) {
    return api.post('/auth/reset-password', payload);
  }

  async function refreshProfile() {
    const { data } = await api.get('/customers/me');
    customer.value = data;
    localStorage.setItem('customer', JSON.stringify(data));
    return data;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAuth();
    }
  }

  return {
    customer,
    accessToken,
    loading,
    isAuthenticated,
    setAuth,
    clearAuth,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshProfile,
    logout
  };
});
