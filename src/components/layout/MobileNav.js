import { RouterLink } from 'vue-router';

export default {
  name: 'MobileNav',
  components: { RouterLink },
  template: `
    <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 md:hidden z-40 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-2 flex items-center gap-4">
      <RouterLink to="/" class="text-sm">Home</RouterLink>
      <RouterLink to="/products" class="text-sm">Products</RouterLink>
      <RouterLink to="/cart" class="text-sm">Cart</RouterLink>
    </nav>
  `
};
