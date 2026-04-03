import { RouterLink } from 'vue-router';

import { useCartStore } from '../../stores/cart.js';

export default {
  name: 'AppHeader',
  components: { RouterLink },
  setup() {
    const cart = useCartStore();

    return {
      cart
    };
  },
  template: `
    <header class="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur">
      <div class="page-container flex items-center justify-between py-4">
        <RouterLink to="/" class="text-xl font-semibold tracking-wide">
          <span class="text-cyan-300">Digital</span>
          <span class="text-slate-200">Store</span>
        </RouterLink>

        <nav class="hidden md:flex items-center gap-4 text-sm">
          <RouterLink to="/products" class="text-slate-300 hover:text-cyan-300">San pham</RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <RouterLink to="/cart" class="btn btn-outline text-sm">Gio hang ({{ cart.itemCount }})</RouterLink>
        </div>
      </div>
    </header>
  `
};
