import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.js';

export function useAuth() {
  const auth = useAuthStore();
  return {
    auth,
    customer: computed(() => auth.customer),
    isAuthenticated: computed(() => auth.isAuthenticated),
    loading: computed(() => auth.loading)
  };
}
