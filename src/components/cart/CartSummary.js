import { formatCurrency } from '../../lib/utils.js';

export default {
  name: 'CartSummary',
  props: {
    preview: { type: Object, default: null }
  },
  methods: { formatCurrency },
  template: `
    <div class="surface-card p-4" v-if="preview">
      <div class="flex justify-between text-sm"><span class="muted">Tam tinh</span><span>{{ formatCurrency(preview.subtotal_amount, preview.currency_code) }}</span></div>
      <div class="flex justify-between text-sm mt-1"><span class="muted">Giam gia</span><span>{{ formatCurrency(preview.discount_amount, preview.currency_code) }}</span></div>
      <div class="flex justify-between mt-2 pt-2 border-t border-slate-700 font-semibold"><span>Tong</span><span class="text-cyan-300">{{ formatCurrency(preview.total_amount, preview.currency_code) }}</span></div>
    </div>
  `
};
