import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { getCheckoutEmail, isValidEmail, setCheckoutEmail } from '../../lib/guest.js';
import { useOrders } from '../../composables/useOrders.js';
import { formatCurrency, formatDate, notify } from '../../lib/utils.js';

export default {
  name: 'OrderListView',
  components: { RouterLink },
  setup() {
    const route = useRoute();
    const email = ref('');
    const requested = ref(false);
    const { loading, error, orders, load } = useOrders({ page: 1, page_size: 20 });

    async function loadOrders() {
      if (!isValidEmail(email.value)) {
        notify('Vui long nhap email hop le de tra cuu don hang', 'error');
        return;
      }
      const normalized = setCheckoutEmail(email.value);
      email.value = normalized;
      requested.value = true;
      await load({ page: 1, page_size: 20 }, normalized);
    }

    onMounted(async () => {
      const fromQuery = typeof route.query.email === 'string' ? route.query.email : '';
      const initial = fromQuery || getCheckoutEmail();
      if (initial && isValidEmail(initial)) {
        const normalized = setCheckoutEmail(initial);
        email.value = normalized;
        requested.value = true;
        await load({ page: 1, page_size: 20 }, normalized);
      }
    });

    return {
      email,
      requested,
      loading,
      error,
      orders,
      loadOrders,
      formatCurrency,
      formatDate
    };
  },
  template: `
    <section class="surface-card p-5">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-semibold">Don hang cua ban</h2>
        <RouterLink to="/products" class="btn btn-outline">Mua them</RouterLink>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row gap-2">
        <input
          v-model.trim="email"
          type="email"
          class="input flex-1"
          placeholder="you@example.com"
          autocomplete="email"
        />
        <button class="btn btn-primary" @click="loadOrders">Tra cuu don hang</button>
      </div>

      <div v-if="!requested" class="muted mt-6">Nhap email da checkout de xem lich su don hang.</div>
      <div v-else-if="loading" class="muted mt-6">Dang tai don hang...</div>
      <div v-else-if="error" class="text-red-300 mt-6">{{ error }}</div>
      <div v-else-if="orders.items.length === 0" class="muted mt-6">Chua co don hang nao.</div>

      <div v-else class="mt-5 space-y-3">
        <article v-for="order in orders.items" :key="order.public_id" class="surface-card p-4">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="font-medium">Order #{{ order.public_id.slice(0, 8) }}</div>
              <div class="muted text-sm mt-1">{{ formatDate(order.created_at) }}</div>
            </div>
            <div class="text-right">
              <div class="badge">{{ order.status }}</div>
              <div class="text-cyan-300 font-semibold mt-2">{{ formatCurrency(order.total_amount, order.currency_code) }}</div>
            </div>
          </div>
          <div class="mt-3">
            <RouterLink class="text-cyan-300 text-sm" :to="{ path: '/orders/' + order.public_id, query: { email } }">Xem chi tiet</RouterLink>
          </div>
        </article>
      </div>
    </section>
  `
};
