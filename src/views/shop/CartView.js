import { computed, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import api from '../../lib/api.js';
import { useCartStore } from '../../stores/cart.js';
import { formatCurrency, notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'CartView',
  components: { RouterLink },
  setup() {
    const cart = useCartStore();
    const router = useRouter();

    const preview = ref(null);
    const previewLoading = ref(false);
    const couponCode = ref(cart.appliedCoupon?.code || '');

    const hasItems = computed(() => cart.items.length > 0);

    async function refreshPreview() {
      if (!hasItems.value) {
        preview.value = null;
        return;
      }

      previewLoading.value = true;
      try {
        const payload = {
          items: cart.items.map((item) => ({
            product_public_id: item.productPublicId,
            quantity: item.quantity
          })),
          coupon_code: couponCode.value || null
        };
        const { data } = await api.post('/cart/preview', payload);
        preview.value = data;
        if (couponCode.value) {
          cart.applyCoupon(couponCode.value, Number(data.discount_amount || 0));
        } else {
          cart.removeCoupon();
        }
      } catch (error) {
        notify(toApiError(error, 'Khong preview duoc gio hang'), 'error');
      } finally {
        previewLoading.value = false;
      }
    }

    function updateQuantity(item, diff) {
      cart.updateQuantity(item.productPublicId, item.quantity + diff);
      refreshPreview();
    }

    function removeItem(item) {
      cart.removeItem(item.productPublicId);
      refreshPreview();
    }

    function goCheckout() {
      router.push('/checkout');
    }

    refreshPreview();

    return {
      cart,
      preview,
      previewLoading,
      couponCode,
      hasItems,
      updateQuantity,
      removeItem,
      refreshPreview,
      goCheckout,
      formatCurrency
    };
  },
  template: `
    <section class="grid lg:grid-cols-[1fr_360px] gap-5">
      <div class="surface-card p-5">
        <h2 class="text-xl font-semibold">Gio hang</h2>
        <p class="muted text-sm mt-1">Quan ly san pham truoc khi thanh toan.</p>

        <div v-if="!hasItems" class="mt-8 muted">
          Gio hang rong. <RouterLink to="/products" class="text-cyan-300">Kham pha san pham</RouterLink>
        </div>

        <div v-else class="mt-5 space-y-3">
          <article v-for="item in cart.items" :key="item.productPublicId" class="surface-card p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="font-medium">{{ item.productName }}</div>
                <div class="muted text-xs">SKU: {{ item.sku }}</div>
                <div class="text-cyan-300 font-semibold mt-2">{{ formatCurrency(item.unitPrice, item.currencyCode) }}</div>
              </div>

              <div class="flex items-center gap-2">
                <button class="btn btn-outline" @click="updateQuantity(item, -1)">-</button>
                <span class="px-2">{{ item.quantity }}</span>
                <button class="btn btn-outline" @click="updateQuantity(item, 1)">+</button>
                <button class="btn btn-outline" @click="removeItem(item)">Xoa</button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="surface-card p-5 h-fit sticky top-24">
        <h3 class="text-lg font-semibold">Tong ket</h3>

        <div class="mt-4">
          <label class="text-sm muted">Ma giam gia</label>
          <div class="flex gap-2 mt-1">
            <input v-model="couponCode" class="input" placeholder="VD: WELCOME10" />
            <button class="btn btn-outline" @click="refreshPreview">Ap dung</button>
          </div>
        </div>

        <div class="mt-5 space-y-2 text-sm">
          <div class="flex justify-between"><span class="muted">Tam tinh</span><span>{{ preview ? formatCurrency(preview.subtotal_amount, preview.currency_code) : '-' }}</span></div>
          <div class="flex justify-between"><span class="muted">Giam gia</span><span>{{ preview ? formatCurrency(preview.discount_amount, preview.currency_code) : '-' }}</span></div>
          <div class="border-t border-slate-700 pt-2 flex justify-between text-base font-semibold">
            <span>Thanh tien</span>
            <span class="text-cyan-300">{{ preview ? formatCurrency(preview.total_amount, preview.currency_code) : '-' }}</span>
          </div>
        </div>

        <button class="btn btn-primary w-full mt-5" :disabled="!hasItems || previewLoading" @click="goCheckout">
          {{ previewLoading ? 'Dang cap nhat...' : 'Tiep tuc thanh toan' }}
        </button>
      </aside>
    </section>
  `
};
