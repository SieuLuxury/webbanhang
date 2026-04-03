import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart_items') || '[]'));
  const appliedCoupon = ref(JSON.parse(localStorage.getItem('cart_coupon') || 'null'));

  function persist() {
    localStorage.setItem('cart_items', JSON.stringify(items.value));
    localStorage.setItem('cart_coupon', JSON.stringify(appliedCoupon.value));
  }

  function addItem(product, quantity = 1) {
    if (
      items.value.length > 0 &&
      items.value[0].currencyCode !== product.currency_code
    ) {
      throw new Error('Khong the tron VND va USDT trong cung gio hang');
    }

    const existing = items.value.find((item) => item.productPublicId === product.public_id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.available_count || 1);
    } else {
      items.value.push({
        productPublicId: product.public_id,
        productName: product.name,
        sku: product.sku,
        unitPrice: Number(product.base_price_amount),
        currencyCode: product.currency_code,
        quantity,
        imageUrl: product.image_url,
        availableCount: product.available_count || 0
      });
    }
    persist();
  }

  function removeItem(productPublicId) {
    items.value = items.value.filter((item) => item.productPublicId !== productPublicId);
    persist();
  }

  function updateQuantity(productPublicId, quantity) {
    const item = items.value.find((entry) => entry.productPublicId === productPublicId);
    if (!item) return;
    if (quantity <= 0) {
      removeItem(productPublicId);
      return;
    }
    item.quantity = Math.min(quantity, item.availableCount || quantity);
    persist();
  }

  function applyCoupon(code, discountAmount = 0) {
    appliedCoupon.value = { code, discountAmount };
    persist();
  }

  function removeCoupon() {
    appliedCoupon.value = null;
    persist();
  }

  function clearCart() {
    items.value = [];
    appliedCoupon.value = null;
    persist();
  }

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() => items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));

  return {
    items,
    appliedCoupon,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart
  };
});
