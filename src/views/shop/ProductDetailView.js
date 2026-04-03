import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import api from '../../lib/api.js';
import { formatCurrency, notify, toApiError } from '../../lib/utils.js';
import { useCartStore } from '../../stores/cart.js';

export default {
  name: 'ProductDetailView',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const cart = useCartStore();

    const loading = ref(false);
    const product = ref(null);

    async function load() {
      loading.value = true;
      try {
        const { data } = await api.get(`/products/${route.params.publicId}`);
        product.value = data;
      } catch (error) {
        notify(toApiError(error, 'Khong tai duoc san pham'), 'error');
      } finally {
        loading.value = false;
      }
    }

    function addToCart() {
      if (!product.value) return;
      try {
        cart.addItem(product.value, 1);
        notify('Da them vao gio hang');
      } catch (error) {
        notify(error.message || 'Khong the them vao gio', 'error');
      }
    }

    function buyNow() {
      if (!product.value) return;
      try {
        cart.clearCart();
        cart.addItem(product.value, 1);
        router.push('/checkout');
      } catch (error) {
        notify(error.message || 'Khong the mua ngay', 'error');
      }
    }

    onMounted(load);

    return {
      loading,
      product,
      buyNow,
      addToCart,
      formatCurrency
    };
  },
  template: `
    <section>
      <div v-if="loading" class="surface-card p-8 muted">Dang tai chi tiet san pham...</div>
      <article v-else-if="product" class="surface-card p-6 md:p-8 grid md:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-slate-700 bg-slate-900/60 h-72 md:h-full overflow-hidden flex items-center justify-center">
          <img :src="product.image_url || '/assets/images/placeholder.svg'" class="w-full h-full object-cover" alt="product" />
        </div>

        <div>
          <p class="text-cyan-300 text-sm">{{ product.item_kind.toUpperCase() }}</p>
          <h1 class="text-3xl font-semibold mt-2">{{ product.name }}</h1>
          <p class="muted mt-3">{{ product.description || 'Khong co mo ta.' }}</p>

          <div class="mt-6 space-y-2 text-sm">
            <div>SKU: <span class="text-slate-200">{{ product.sku }}</span></div>
            <div>Ton kho kha dung: <span class="text-slate-200">{{ product.available_count }}</span></div>
            <div class="text-2xl font-bold text-cyan-300 mt-4">{{ formatCurrency(product.base_price_amount, product.currency_code) }}</div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button class="btn btn-outline" :disabled="product.available_count <= 0" @click="buyNow">Mua ngay</button>
            <button class="btn btn-primary" :disabled="product.available_count <= 0" @click="addToCart">Them vao gio hang</button>
          </div>
        </div>
      </article>
      <div v-else class="surface-card p-8 text-red-300">Khong tim thay san pham.</div>
    </section>
  `
};
