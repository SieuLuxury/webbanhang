export default {
  name: 'PaymentMethodSelector',
  props: { modelValue: { type: String, default: 'bank_transfer' } },
  emits: ['update:modelValue'],
  template: `
    <div>
      <label class="text-sm muted">Phuong thuc thanh toan</label>
      <select class="select mt-1" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
        <option value="bank_transfer">Bank transfer</option>
        <option value="crypto_transfer">Crypto transfer</option>
        <option value="binance_pay">Binance pay</option>
      </select>
    </div>
  `
};
