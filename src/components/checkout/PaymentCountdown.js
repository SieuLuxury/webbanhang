import CountdownTimer from '../common/CountdownTimer.js';

export default {
  name: 'PaymentCountdown',
  components: { CountdownTimer },
  props: { expiresAt: { type: String, required: true } },
  template: `
    <div class="surface-card p-4">
      <div class="muted text-sm">Con lai</div>
      <CountdownTimer :expires-at="expiresAt" />
    </div>
  `
};
