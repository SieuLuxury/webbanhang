export default {
  name: 'BankTransferInstructions',
  props: { payment: { type: Object, required: true } },
  template: `
    <div class="surface-card p-4">
      <div class="muted text-sm">Ma chuyen khoan</div>
      <div class="font-mono mt-1">{{ payment.bank_reference_code }}</div>
    </div>
  `
};
