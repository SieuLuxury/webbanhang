import { formatCurrency } from '../../lib/utils.js';

export default {
  name: 'CartItem',
  props: { item: { type: Object, required: true } },
  emits: ['inc', 'dec', 'remove'],
  methods: { formatCurrency },
  template: `
    <div class="surface-card p-4 flex items-center justify-between gap-3">
      <div>
        <div class="font-medium">{{ item.productName }}</div>
        <div class="muted text-xs">{{ item.sku }}</div>
      </div>
      <div class="text-right">
        <div class="text-cyan-300">{{ formatCurrency(item.unitPrice * item.quantity, item.currencyCode) }}</div>
        <div class="mt-2 flex gap-2 justify-end">
          <button class="btn btn-outline" @click="$emit('dec', item)">-</button>
          <button class="btn btn-outline" @click="$emit('inc', item)">+</button>
          <button class="btn btn-outline" @click="$emit('remove', item)">Xoa</button>
        </div>
      </div>
    </div>
  `
};
