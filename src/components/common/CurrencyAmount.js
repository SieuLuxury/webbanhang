import { formatCurrency } from '../../lib/utils.js';

export default {
  name: 'CurrencyAmount',
  props: {
    amount: { type: [Number, String], required: true },
    currency: { type: String, default: 'VND' }
  },
  methods: { formatCurrency },
  template: `<span>{{ formatCurrency(amount, currency) }}</span>`
};
