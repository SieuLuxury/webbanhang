import { onBeforeUnmount, ref } from 'vue';
import api from '../lib/api.js';
import { PAYMENT_TERMINAL_STATUSES } from '../lib/constants.js';

export function usePaymentPolling() {
  const loading = ref(false);
  const payment = ref(null);
  const error = ref('');
  const intervalRef = ref(null);

  function stop() {
    if (intervalRef.value) {
      clearInterval(intervalRef.value);
      intervalRef.value = null;
    }
  }

  async function fetchPayment(publicId, customerEmail) {
    loading.value = true;
    try {
      const { data } = await api.get(`/payments/${publicId}`, {
        params: { email: customerEmail }
      });
      payment.value = data;
      if (PAYMENT_TERMINAL_STATUSES.includes(data.status)) {
        stop();
      }
    } catch (err) {
      error.value = err?.response?.data?.detail || err?.message || 'Cannot poll payment';
      stop();
    } finally {
      loading.value = false;
    }
  }

  function start(publicId, customerEmail, intervalMs = 10000) {
    stop();
    fetchPayment(publicId, customerEmail);
    intervalRef.value = setInterval(() => fetchPayment(publicId, customerEmail), intervalMs);
  }

  onBeforeUnmount(() => stop());

  return { loading, payment, error, start, stop, fetchPayment };
}
