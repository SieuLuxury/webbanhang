import { onMounted, ref } from 'vue';
import api from '../lib/api.js';

export function useProducts(initialParams = {}) {
  const loading = ref(false);
  const error = ref('');
  const data = ref({ items: [], total: 0, page: 1, page_size: 20, total_pages: 0 });

  async function load(params = initialParams) {
    loading.value = true;
    error.value = '';
    try {
      const { data: payload } = await api.get('/products', { params });
      data.value = payload;
    } catch (err) {
      error.value = err?.response?.data?.detail || err?.message || 'Cannot load products';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    load(initialParams);
  });

  return { loading, error, data, load };
}
