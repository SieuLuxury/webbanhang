export default {
  name: 'InventoryBadge',
  props: {
    availableCount: { type: Number, default: 0 }
  },
  computed: {
    badgeClass() {
      if (this.availableCount <= 0) return 'badge danger';
      if (this.availableCount < 5) return 'badge warn';
      return 'badge success';
    },
    label() {
      if (this.availableCount <= 0) return 'Out of stock';
      if (this.availableCount < 5) return 'Low stock';
      return 'In stock';
    }
  },
  template: `<span :class="badgeClass">{{ label }}</span>`
};
