import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { useProducts } from '../../composables/useProducts.js';
import { useCartStore } from '../../stores/cart.js';
import { formatCurrency, notify } from '../../lib/utils.js';

export default {
  name: 'ProductListView',
  setup() {
    const router = useRouter();
    const filters = reactive({
      search: '',
      currency_code: '',
      page: 1,
      page_size: 24
    });

    const { loading, error, data, load } = useProducts(filters);
    const cart = useCartStore();

    const products = computed(() => data.value.items || []);

    async function applyFilters() {
      filters.page = 1;
      await load(filters);
    }

    function addToCart(product) {
      try {
        cart.addItem(product, 1);
        notify('Da them vao gio hang');
      } catch (error) {
        notify(error.message || 'Khong the them san pham', 'error');
      }
    }

    function buyNow(product) {
      try {
        cart.clearCart();
        cart.addItem(product, 1);
        router.push('/checkout');
      } catch (error) {
        notify(error.message || 'Khong the mua ngay', 'error');
      }
    }

    function openProductDetail(productPublicId) {
      router.push(`/products/${productPublicId}`);
    }

    function onImageError(event) {
      const target = event?.target;
      if (!target) return;
      target.onerror = null;
      target.src = '/assets/images/placeholder.svg';
    }

    return {
      filters,
      loading,
      error,
      products,
      data,
      applyFilters,
      addToCart,
      buyNow,
      openProductDetail,
      onImageError,
      formatCurrency
    };
  },
  template: `
    <section class="space-y-5">
      <div class="surface-card p-4 md:p-5">
        <div class="grid md:grid-cols-4 gap-3">
          <input v-model="filters.search" class="input md:col-span-2" placeholder="Tim theo ten hoac SKU" @keyup.enter="applyFilters" />
          <select v-model="filters.currency_code" class="select">
            <option value="">Tat ca currency</option>
            <option value="VND">VND</option>
            <option value="USDT">USDT</option>
          </select>
          <button class="btn btn-primary" @click="applyFilters">Loc san pham</button>
        </div>
      </div>

      <div v-if="loading" class="surface-card p-8 text-center muted">Dang tai san pham...</div>
      <div v-else-if="error" class="surface-card p-8 text-red-300">{{ error }}</div>
      <div v-else-if="products.length === 0" class="surface-card p-8 muted">Khong co san pham phu hop.</div>

      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="product in products"
          :key="product.public_id"
          class="surface-card p-5 flex flex-col cursor-pointer transition hover:shadow-[0_0_0_1px_rgba(34,211,238,0.28),0_12px_24px_rgba(2,6,23,0.35)]"
          @click="openProductDetail(product.public_id)"
        >
          <div class="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-900 mb-4">
            <img
              :src="product.image_url || '/assets/images/placeholder.svg'"
              :alt="product.name"
              class="w-full h-44 object-cover"
              loading="lazy"
              @error="onImageError"
            />
          </div>

          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-semibold text-lg">{{ product.name }}</h3>
              <p class="text-xs muted mt-1">SKU: {{ product.sku }}</p>
            </div>
            <span class="badge" :class="product.available_count > 0 ? 'success' : 'danger'">
              {{ product.available_count > 0 ? ('Con ' + product.available_count) : 'Het hang' }}
            </span>
          </div>

          <p class="muted text-sm mt-3 min-h-[40px]">{{ product.description || 'Khong co mo ta' }}</p>

          <div class="mt-4 font-semibold text-cyan-300">
            {{ formatCurrency(product.base_price_amount, product.currency_code) }}
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <button
              class="btn btn-outline text-center"
              :disabled="product.available_count <= 0"
              @click.stop="buyNow(product)"
            >
              Mua ngay
            </button>
            <button
              class="btn btn-primary"
              :disabled="product.available_count <= 0"
              @click.stop="addToCart(product)"
            >
              Them vao gio hang
            </button>
          </div>
        </article>
      </div>
    </section>
  `
};
