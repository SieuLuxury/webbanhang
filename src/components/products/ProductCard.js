import InventoryBadge from './InventoryBadge.js';
import { formatCurrency } from '../../lib/utils.js';

export default {
  name: 'ProductCard',
  components: { InventoryBadge },
  props: {
    product: { type: Object, required: true }
  },
  emits: ['add'],
  methods: {
    formatCurrency,
    onImageError(event) {
      const target = event?.target;
      if (!target) return;
      target.onerror = null;
      target.src = '/assets/images/placeholder.svg';
    }
  },
  template: `
    <article class="surface-card p-5">
      <div class="rounded-xl overflow-hidden border border-slate-700/70 bg-slate-900 mb-3">
        <img
          :src="product.image_url || '/assets/images/placeholder.svg'"
          :alt="product.name"
          class="w-full h-40 object-cover"
          loading="lazy"
          @error="onImageError"
        />
      </div>
      <div class="flex items-center justify-between gap-2">
        <h3 class="font-semibold">{{ product.name }}</h3>
        <InventoryBadge :available-count="product.available_count" />
      </div>
      <p class="muted text-xs mt-1">
        {{ product.available_count > 0 ? ('Con lai: ' + product.available_count) : 'Het hang' }}
      </p>
      <p class="muted text-sm mt-2">{{ product.description || 'No description' }}</p>
      <div class="text-cyan-300 font-semibold mt-3">{{ formatCurrency(product.base_price_amount, product.currency_code) }}</div>
      <button class="btn btn-primary mt-3" @click="$emit('add', product)">Them vao gio</button>
    </article>
  `
};
