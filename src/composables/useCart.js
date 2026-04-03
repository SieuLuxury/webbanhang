import { computed } from 'vue';
import { useCartStore } from '../stores/cart.js';

export function useCart() {
  const cart = useCartStore();
  return {
    cart,
    items: computed(() => cart.items),
    itemCount: computed(() => cart.itemCount),
    subtotal: computed(() => cart.subtotal)
  };
}
