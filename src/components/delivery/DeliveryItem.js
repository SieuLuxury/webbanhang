export default {
  name: 'DeliveryItem',
  props: {
    item: { type: Object, required: true }
  },
  emits: ['copy'],
  template: `
    <article class="surface-card p-4">
      <div class="font-medium">{{ item.product_name }}</div>
      <div class="mt-2 p-3 rounded-xl border border-slate-700 bg-slate-950/70 font-mono break-all">{{ item.secret_value }}</div>
      <button class="btn btn-outline mt-3" @click="$emit('copy', item.secret_value)">Copy</button>
    </article>
  `
};
