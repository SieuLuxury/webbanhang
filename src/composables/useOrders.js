import { ref } from 'vue';
import api from '../lib/api.js';

export function useOrders(initialParams = {}) {
  const loading = ref(false);
  const error = ref('');
  const orders = ref({ items: [], total: 0, page: 1, page_size: 20, total_pages: 0 });

  async function load(params = initialParams, customerEmail = '') {
    const email = String(customerEmail || '').trim().toLowerCase();
    if (!email) {
      orders.value = { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
      error.value = '';
      return;
    }

    loading.value = true;
    error.value = '';
    try {
      const { data } = await api.get('/orders', { params: { ...params, email } });
      orders.value = data;
    } catch (err) {
      error.value = err?.response?.data?.detail || err?.message || 'Cannot load orders';
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, orders, load };
}
