import { formatCurrency, formatDate } from '../../lib/utils.js';
import OrderStatusBadge from './OrderStatusBadge.js';

export default {
  name: 'OrderCard',
  components: { OrderStatusBadge },
  props: { order: { type: Object, required: true } },
  methods: { formatCurrency, formatDate },
  template: `
    <article class="surface-card p-4">
      <div class="flex items-start justify-between">
        <div>
          <div class="font-medium">#{{ order.public_id.slice(0, 8) }}</div>
          <div class="muted text-xs">{{ formatDate(order.created_at) }}</div>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>
      <div class="text-cyan-300 font-semibold mt-2">{{ formatCurrency(order.total_amount, order.currency_code) }}</div>
    </article>
  `
};
