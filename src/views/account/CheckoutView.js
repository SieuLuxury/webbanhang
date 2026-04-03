import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import api from '../../lib/api.js';
import { useCartStore } from '../../stores/cart.js';
import { getCheckoutEmail, isValidEmail, setCheckoutEmail } from '../../lib/guest.js';
import { formatCurrency, notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'CheckoutView',
  setup() {
    const cart = useCartStore();
    const router = useRouter();

    const preview = ref(null);
    const loadingPreview = ref(false);
    const submitting = ref(false);

    const form = reactive({
      customer_email: getCheckoutEmail(),
      customer_display_name: '',
      payment_method: 'bank_transfer'
    });

    const hasItems = computed(() => cart.items.length > 0);

    async function loadPreview() {
      if (!hasItems.value) {
        preview.value = null;
        return;
      }

      loadingPreview.value = true;
      try {
        const payload = {
          items: cart.items.map((item) => ({
            product_public_id: item.productPublicId,
            quantity: item.quantity
          })),
          coupon_code: cart.appliedCoupon?.code || null
        };
        const { data } = await api.post('/cart/preview', payload);
        preview.value = data;
      } catch (error) {
        notify(toApiError(error, 'Khong load duoc checkout preview'), 'error');
      } finally {
        loadingPreview.value = false;
      }
    }

    async function submitOrder() {
      if (!preview.value) return;
      if (!isValidEmail(form.customer_email)) {
        notify('Vui long nhap email hop le', 'error');
        return;
      }

      const normalizedEmail = setCheckoutEmail(form.customer_email);
      form.customer_email = normalizedEmail;
      submitting.value = true;
      try {
        const payload = {
          customer_email: normalizedEmail,
          customer_display_name: form.customer_display_name || null,
          items: cart.items.map((item) => ({
            product_public_id: item.productPublicId,
            quantity: item.quantity
          })),
          coupon_code: cart.appliedCoupon?.code || null,
          payment_method: form.payment_method
        };

        const { data } = await api.post('/orders/checkout', payload);
        cart.clearCart();
        notify('Dat hang thanh cong, chuyen den trang thanh toan');
        router.push({
          path: `/payment/${data.payment_attempt_public_id}`,
          query: { email: normalizedEmail }
        });
      } catch (error) {
        notify(toApiError(error, 'Dat hang that bai'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    onMounted(async () => {
      if (!hasItems.value) {
        router.push('/cart');
        return;
      }
      await loadPreview();
    });

    return {
      cart,
      form,
      preview,
      hasItems,
      loadingPreview,
      submitting,
      submitOrder,
      formatCurrency
    };
  },
  template: `
    <section class="grid lg:grid-cols-[1fr_360px] gap-5">
      <div class="surface-card p-5">
        <h2 class="text-xl font-semibold">Checkout</h2>
        <p class="muted text-sm mt-1">Xac nhan gio hang va chon phuong thuc thanh toan.</p>

        <div class="mt-5 space-y-3">
          <article v-for="item in cart.items" :key="item.productPublicId" class="surface-card p-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="font-medium">{{ item.productName }}</div>
                <div class="muted text-xs">{{ item.sku }}</div>
              </div>
              <div class="text-right">
                <div>x{{ item.quantity }}</div>
                <div class="text-cyan-300 font-semibold">{{ formatCurrency(item.unitPrice * item.quantity, item.currencyCode) }}</div>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-6">
          <label class="text-sm muted">Email nhan don hang</label>
          <input
            v-model.trim="form.customer_email"
            class="input mt-1"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
          <p class="muted text-xs mt-1">Email nay duoc dung de mo lai trang thanh toan va nhan giao hang.</p>
        </div>

        <div class="mt-4">
          <label class="text-sm muted">Ten hien thi (tuy chon)</label>
          <input
            v-model.trim="form.customer_display_name"
            class="input mt-1"
            type="text"
            maxlength="120"
            placeholder="Nguyen Van A"
            autocomplete="name"
          />
        </div>

        <div class="mt-4">
          <label class="text-sm muted">Phuong thuc thanh toan</label>
          <select v-model="form.payment_method" class="select mt-1">
            <option value="bank_transfer">Bank transfer (VND)</option>
            <option value="crypto_transfer">Crypto transfer (USDT)</option>
            <option value="binance_pay">Binance pay</option>
          </select>
        </div>
      </div>

      <aside class="surface-card p-5 h-fit sticky top-24">
        <h3 class="text-lg font-semibold">Tong thanh toan</h3>
        <div v-if="!preview" class="muted mt-4">Dang tinh toan...</div>
        <div v-else class="space-y-2 text-sm mt-4">
          <div class="flex justify-between"><span class="muted">Tam tinh</span><span>{{ formatCurrency(preview.subtotal_amount, preview.currency_code) }}</span></div>
          <div class="flex justify-between"><span class="muted">Giam gia</span><span>{{ formatCurrency(preview.discount_amount, preview.currency_code) }}</span></div>
          <div class="border-t border-slate-700 pt-2 flex justify-between text-base font-semibold"><span>Tong</span><span class="text-cyan-300">{{ formatCurrency(preview.total_amount, preview.currency_code) }}</span></div>
        </div>

        <button class="btn btn-primary w-full mt-5" :disabled="submitting || loadingPreview || !preview" @click="submitOrder">
          {{ submitting ? 'Dang tao don...' : 'Dat hang ngay' }}
        </button>
      </aside>
    </section>
  `
};
