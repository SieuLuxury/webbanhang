export const APP_NAME = () => window.__ENV?.APP_NAME || 'Digital Store';
export const SUPPORT_EMAIL = () => window.__ENV?.SUPPORT_EMAIL || 'support@example.com';
export const API_URL = () => window.__ENV?.API_URL || 'http://localhost:8001/api/v1';
export const DEFAULT_CURRENCY = () => window.__ENV?.CURRENCY_DEFAULT || 'VND';

export const PAYMENT_TERMINAL_STATUSES = ['paid', 'expired', 'cancelled'];
export const ORDER_TERMINAL_STATUSES = ['fulfilled', 'refunded', 'cancelled', 'expired'];

