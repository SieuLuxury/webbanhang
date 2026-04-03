export default {
  name: 'CryptoTransferInstructions',
  props: { payment: { type: Object, required: true } },
  template: `
    <div class="surface-card p-4">
      <div class="muted text-sm">Wallet</div>
      <div class="font-mono mt-1 break-all">{{ payment.crypto_wallet_address }}</div>
      <div class="muted mt-2">{{ payment.crypto_network }} / {{ payment.crypto_token }}</div>
    </div>
  `
};
