import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import CountdownTimer from '../../components/common/CountdownTimer.js';
import api from '../../lib/api.js';
import { getCheckoutEmail, isValidEmail, setCheckoutEmail } from '../../lib/guest.js';
import { usePaymentPolling } from '../../composables/usePaymentPolling.js';
import { formatCurrency, notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'PaymentView',
  components: { CountdownTimer, RouterLink },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { loading, payment, error, start, fetchPayment } = usePaymentPolling();
    const customerEmail = ref('');
    const missingEmail = ref(false);
    const expiredNow = ref(false);

    const methodLabel = computed(() => {
      if (!payment.value) return '';
      const value = payment.value.payment_method;
      if (value === 'bank_transfer') return 'Bank transfer';
      if (value === 'crypto_transfer') return 'Crypto transfer';
      return 'Binance pay';
    });

    const bankDisplayName = computed(() => {
      if (!payment.value || !payment.value.bank_code) return '';
      const code = String(payment.value.bank_code).toUpperCase();
      const bankNameMap = {
        MB: 'MBBank',
        '970422': 'MBBank',
        VCB: 'Vietcombank',
        '970436': 'Vietcombank',
        ACB: 'ACB',
        TCB: 'Techcombank'
      };
      const name = bankNameMap[code];
      return name ? `${name} (${code})` : code;
    });

    const bankQrUrl = computed(() => {
      if (!payment.value || payment.value.payment_method !== 'bank_transfer') return '';
      const bankCode = String(payment.value.bank_code || '').trim();
      const bankAccount = String(payment.value.bank_account_number || '').trim();
      if (!bankCode || !bankAccount) return '';

      const params = new URLSearchParams();
      const amountValue = Number(payment.value.amount || 0);
      if (Number.isFinite(amountValue) && amountValue > 0) {
        params.set('amount', String(Math.round(amountValue)));
      }
      if (payment.value.bank_reference_code) {
        params.set('addInfo', payment.value.bank_reference_code);
      }
      if (payment.value.bank_account_name) {
        params.set('accountName', payment.value.bank_account_name);
      }

      return `https://img.vietqr.io/image/${encodeURIComponent(bankCode)}-${encodeURIComponent(bankAccount)}-compact2.png?${params.toString()}`;
    });

    const isExpiredByTime = computed(() => expiredNow.value);

    watch(
      () => payment.value?.expires_at,
      (expiresAt) => {
        if (!expiresAt) {
          expiredNow.value = false;
          return;
        }
        const expiresAtMs = new Date(expiresAt).getTime();
        expiredNow.value = Number.isFinite(expiresAtMs) ? Date.now() > expiresAtMs : false;
      },
      { immediate: true }
    );

    function getNormalizedEmail() {
      if (!isValidEmail(customerEmail.value)) {
        notify('Khong tim thay email checkout hop le', 'error');
        return '';
      }
      const normalized = setCheckoutEmail(customerEmail.value);
      customerEmail.value = normalized;
      return normalized;
    }

    function loadPaymentFromStoredEmail() {
      const normalizedEmail = getNormalizedEmail();
      if (!normalizedEmail) return;
      missingEmail.value = false;
      start(String(route.params.attemptId), normalizedEmail);
    }

    function handlePaymentExpired() {
      expiredNow.value = true;
    }

    async function mockMarkPaid() {
      if (!payment.value) return;
      const normalizedEmail = getNormalizedEmail();
      if (!normalizedEmail) return;
      try {
        const { data } = await api.post('/webhooks/payments/mock-paid', {
          payment_attempt_public_id: payment.value.public_id
        });

        if (data?.delivery_token) {
          notify('Da xac nhan thanh toan test. Dang chuyen den trang nhan hang');
          await router.push(`/delivery/${data.delivery_token}`);
          return;
        }

        notify(data?.message || 'Mock paid webhook da duoc goi');
        await fetchPayment(payment.value.public_id, normalizedEmail);
      } catch (err) {
        notify(toApiError(err, 'Khong mock duoc payment'), 'error');
      }
    }

    onMounted(() => {
      const fromQuery = typeof route.query.email === 'string' ? route.query.email : '';
      const initial = fromQuery || getCheckoutEmail();
      if (initial && isValidEmail(initial)) {
        customerEmail.value = setCheckoutEmail(initial);
        loadPaymentFromStoredEmail();
        return;
      }
      missingEmail.value = true;
    });

    return {
      customerEmail,
      missingEmail,
      loading,
      payment,
      error,
      methodLabel,
      bankDisplayName,
      bankQrUrl,
      isExpiredByTime,
      handlePaymentExpired,
      loadPaymentFromStoredEmail,
      mockMarkPaid,
      formatCurrency
    };
  },
  template: `
    <section class="max-w-3xl mx-auto space-y-4">
      <article v-if="missingEmail" class="surface-card p-5">
        <h2 class="text-xl font-semibold">Khong tim thay email checkout</h2>
        <p class="muted text-sm mt-1">
          Vui long quay lai gio hang va checkout lai de mo trang thanh toan.
        </p>
        <div class="mt-3">
          <RouterLink to="/cart" class="btn btn-primary">Quay lai gio hang</RouterLink>
        </div>
      </article>

      <article class="surface-card p-6 md:p-8" v-if="payment">
        <h2 class="text-2xl font-semibold">Thanh toan don hang</h2>
        <p class="muted text-sm mt-1">Trang thai duoc cap nhat tu dong moi 10 giay.</p>

        <div class="grid md:grid-cols-2 gap-4 mt-6">
          <div class="surface-card p-4">
            <div class="muted text-sm">Phuong thuc</div>
            <div class="font-medium mt-1">{{ methodLabel }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Trang thai</div>
            <div class="font-medium mt-1">
              {{ isExpiredByTime && (payment.status === 'pending' || payment.status === 'reviewing') ? 'expired' : payment.status }}
            </div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">So tien</div>
            <div class="font-medium mt-1 text-cyan-300">{{ formatCurrency(payment.amount, payment.currency_code) }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Con lai</div>
            <div class="font-medium mt-1">
              <CountdownTimer
                :expires-at="payment.expires_at"
                @expired="handlePaymentExpired"
              />
            </div>
          </div>
        </div>

        <div class="mt-5 grid lg:grid-cols-[1.2fr_1fr] gap-4" v-if="payment.payment_method === 'bank_transfer'">
          <div class="surface-card p-4 space-y-3">
            <div>
              <div class="text-sm muted">Ngan hang</div>
              <div class="font-medium mt-1">{{ bankDisplayName || payment.bank_code }}</div>
            </div>
            <div>
              <div class="text-sm muted">So tai khoan</div>
              <div class="font-mono mt-1">{{ payment.bank_account_number || 'Dang cap nhat' }}</div>
            </div>
            <div>
              <div class="text-sm muted">Chu tai khoan</div>
              <div class="font-medium mt-1">{{ payment.bank_account_name || 'Dang cap nhat' }}</div>
            </div>
            <div>
              <div class="text-sm muted">Noi dung chuyen khoan</div>
              <div class="font-mono mt-1">{{ payment.bank_reference_code || 'Dang cap nhat' }}</div>
            </div>
          </div>

          <div class="surface-card p-4 flex flex-col items-center justify-center">
            <img
              v-if="bankQrUrl"
              :src="bankQrUrl"
              alt="Bank transfer QR"
              class="w-full max-w-[260px] bg-white rounded-xl p-2"
            />
            <p v-else class="muted text-sm text-center">
              Chua tao duoc QR. Vui long dung thong tin tai khoan ben trai de chuyen khoan.
            </p>
          </div>
        </div>

        <div class="mt-5 surface-card p-4" v-if="payment.payment_method === 'crypto_transfer'">
          <div class="text-sm muted">Dia chi vi</div>
          <div class="font-mono mt-1 break-all">{{ payment.crypto_wallet_address }}</div>
          <div class="muted mt-1">{{ payment.crypto_network }} / {{ payment.crypto_token }}</div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <button
            class="btn btn-outline"
            @click="mockMarkPaid"
            v-if="(payment.status === 'pending' || payment.status === 'reviewing') && !isExpiredByTime"
          >
            Mock Paid (test)
          </button>
        </div>
      </article>

      <div v-else-if="loading" class="surface-card p-8 muted">Dang tai payment...</div>
      <div v-else-if="error" class="surface-card p-8 text-red-300">{{ error }}</div>
    </section>
  `
};
