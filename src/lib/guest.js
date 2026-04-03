const CHECKOUT_EMAIL_STORAGE_KEY = 'storefront_checkout_email';
const CHECKOUT_EMAIL_UPDATED_EVENT = 'checkout-email-updated';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function isValidEmail(value) {
  const normalized = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export function getCheckoutEmail() {
  try {
    return normalizeEmail(localStorage.getItem(CHECKOUT_EMAIL_STORAGE_KEY));
  } catch {
    return '';
  }
}

export function setCheckoutEmail(value) {
  const normalized = normalizeEmail(value);
  try {
    if (normalized) {
      localStorage.setItem(CHECKOUT_EMAIL_STORAGE_KEY, normalized);
    } else {
      localStorage.removeItem(CHECKOUT_EMAIL_STORAGE_KEY);
    }
    window.dispatchEvent(new Event(CHECKOUT_EMAIL_UPDATED_EVENT));
  } catch {
    return normalized;
  }
  return normalized;
}

export function onCheckoutEmailUpdated(handler) {
  window.addEventListener(CHECKOUT_EMAIL_UPDATED_EVENT, handler);
  return () => window.removeEventListener(CHECKOUT_EMAIL_UPDATED_EVENT, handler);
}

