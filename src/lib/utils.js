import Toastify from 'toastify-js';

export function formatCurrency(amount, currency = 'VND') {
  const value = Number(amount || 0);
  if (currency === 'USDT') {
    return `${value.toFixed(2)} USDT`;
  }
  return new Intl.NumberFormat('vi-VN').format(value) + ' VND';
}

export function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('vi-VN');
}

export function notify(message, type = 'success') {
  const bg =
    type === 'error'
      ? 'linear-gradient(135deg, #dc2626, #ef4444)'
      : type === 'warn'
        ? 'linear-gradient(135deg, #d97706, #f59e0b)'
        : 'linear-gradient(135deg, #0284c7, #22d3ee)';

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    style: { background: bg }
  }).showToast();
}

export function toApiError(error, fallback = 'Request failed') {
  return (
    error?.response?.data?.detail ||
    error?.message ||
    fallback
  );
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
