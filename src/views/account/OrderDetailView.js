import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import api from '../../lib/api.js';
import { getCheckoutEmail, isValidEmail, setCheckoutEmail } from '../../lib/guest.js';
import { formatCurrency, formatDate, notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'OrderDetailView',
  components: { RouterLink },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const order = ref(null);
    const email = ref('');

    function resolveEmail() {
      if (!isValidEmail(email.value)) {
        notify('Vui long nhap email hop le de xem don hang', 'error');
        return '';
      }
      const normalized = setCheckoutEmail(email.value);
      email.value = normalized;
      return normalized;
    }

    async function load() {
      const normalizedEmail = resolveEmail();
      if (!normalizedEmail) return;

      loading.value = true;
      try {
        const { data } = await api.get(`/orders/${route.params.publicId}`, {
          params: { email: normalizedEmail }
        });
        order.value = data;
      } catch (error) {
        order.value = null;
        notify(toApiError(error, 'Khong tai duoc chi tiet don'), 'error');
      } finally {
        loading.value = false;
      }
    }

    async function cancelOrder() {
      if (!order.value) return;
      const normalizedEmail = resolveEmail();
      if (!normalizedEmail) return;
      try {
        await api.post(`/orders/${order.value.public_id}/cancel`, null, {
          params: { email: normalizedEmail }
        });
        notify('Da huy don hang');
        await load();
      } catch (error) {
        notify(toApiError(error, 'Khong the huy don'), 'error');
      }
    }

    onMounted(() => {
      const fromQuery = typeof route.query.email === 'string' ? route.query.email : '';
      const initial = fromQuery || getCheckoutEmail();
      if (initial) {
        email.value = setCheckoutEmail(initial);
        load();
      }
    });

    return {
      loading,
      order,
      email,
      load,
      cancelOrder,
      formatCurrency,
      formatDate
    };
  },
  template: `
    <section class="space-y-4">
      <article class="surface-card p-5">
        <h2 class="text-xl font-semibold">Tra cuu chi tiet don hang</h2>
        <div class="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            v-model.trim="email"
            type="email"
            class="input flex-1"
            placeholder="you@example.com"
            autocomplete="email"
          />
          <button class="btn btn-primary" @click="load">Tai don hang</button>
        </div>
      </article>

      <div v-if="loading" class="surface-card p-8 muted">Dang tai don hang...</div>
      <article v-else-if="order" class="surface-card p-6 space-y-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-2xl font-semibold">Order #{{ order.public_id.slice(0, 8) }}</h2>
            <div class="muted text-sm mt-1">Tao luc {{ formatDate(order.created_at) }}</div>
          </div>
          <div class="text-right">
            <div class="badge">{{ order.status }}</div>
            <div class="text-cyan-300 text-xl font-semibold mt-2">{{ formatCurrency(order.total_amount, order.currency_code) }}</div>
          </div>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>San pham</th>
                <th>So luong</th>
                <th>Don gia</th>
                <th>Thanh tien</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.public_id">
                <td>{{ item.product_name_snapshot }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatCurrency(item.unit_price_amount, item.currency_code) }}</td>
                <td>{{ formatCurrency(item.total_amount, item.currency_code) }}</td>
                <td>{{ item.status }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex gap-3">
          <RouterLink class="btn btn-outline" :to="{ path: '/orders', query: { email } }">Quay lai danh sach</RouterLink>
          <button class="btn btn-primary" v-if="order.status === 'pending_payment' || order.status === 'draft'" @click="cancelOrder">Huy don</button>
        </div>
      </article>
      <div v-else class="surface-card p-8 muted">Nhap email de tai thong tin don hang.</div>
    </section>
  `
};
