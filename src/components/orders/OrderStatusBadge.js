export default {
  name: 'OrderStatusBadge',
  props: { status: { type: String, required: true } },
  computed: {
    cls() {
      if (['paid', 'fulfilled', 'partially_fulfilled'].includes(this.status)) return 'badge success';
      if (['pending_payment', 'reviewing', 'fulfilling'].includes(this.status)) return 'badge warn';
      if (['cancelled', 'expired', 'refunded'].includes(this.status)) return 'badge danger';
      return 'badge';
    }
  },
  template: `<span :class="cls">{{ status }}</span>`
};
