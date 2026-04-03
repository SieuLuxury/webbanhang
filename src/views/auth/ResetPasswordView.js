import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'ResetPasswordView',
  setup() {
    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const form = reactive({
      email: String(route.query.email || ''),
      reset_token: String(route.query.token || ''),
      new_password: ''
    });
    const submitting = ref(false);

    async function submit() {
      submitting.value = true;
      try {
        await auth.resetPassword(form);
        notify('Dat lai mat khau thanh cong');
        router.push('/login');
      } catch (error) {
        notify(toApiError(error, 'Khong the reset mat khau'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    return { form, submitting, submit };
  },
  template: `
    <div class="max-w-md mx-auto surface-card p-6 md:p-8">
      <h2 class="text-2xl font-semibold">Dat lai mat khau</h2>
      <p class="muted mt-2 text-sm">Nhap email, token va mat khau moi.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm muted">Email</label>
          <input v-model="form.email" class="input mt-1" type="email" />
        </div>
        <div>
          <label class="text-sm muted">Reset token</label>
          <input v-model="form.reset_token" class="input mt-1" type="text" />
        </div>
        <div>
          <label class="text-sm muted">Mat khau moi</label>
          <input v-model="form.new_password" class="input mt-1" type="password" />
        </div>
        <button class="btn btn-primary w-full" :disabled="submitting" @click="submit">
          {{ submitting ? 'Dang xu ly...' : 'Cap nhat mat khau' }}
        </button>
      </div>
    </div>
  `
};
