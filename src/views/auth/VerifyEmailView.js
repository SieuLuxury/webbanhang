import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'VerifyEmailView',
  setup() {
    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const form = reactive({
      email: String(route.query.email || ''),
      otp_code: ''
    });
    const submitting = ref(false);

    async function submit() {
      submitting.value = true;
      try {
        await auth.verifyEmail(form);
        notify('Xac thuc email thanh cong. Ban co the dang nhap.');
        router.push('/login');
      } catch (error) {
        notify(toApiError(error, 'Xac thuc that bai'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    return { form, submitting, submit };
  },
  template: `
    <div class="max-w-md mx-auto surface-card p-6 md:p-8">
      <h2 class="text-2xl font-semibold">Xac thuc email</h2>
      <p class="muted mt-2 text-sm">Nhap ma OTP 6 so da duoc gui vao email cua ban.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm muted">Email</label>
          <input v-model="form.email" class="input mt-1" type="email" placeholder="you@example.com" />
        </div>
        <div>
          <label class="text-sm muted">OTP</label>
          <input v-model="form.otp_code" class="input mt-1" type="text" maxlength="6" placeholder="123456" />
        </div>
        <button class="btn btn-primary w-full" :disabled="submitting" @click="submit">
          {{ submitting ? 'Dang xu ly...' : 'Xac thuc' }}
        </button>
      </div>
    </div>
  `
};
