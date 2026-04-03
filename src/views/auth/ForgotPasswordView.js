import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'ForgotPasswordView',
  components: { RouterLink },
  setup() {
    const auth = useAuthStore();
    const form = reactive({ email: '' });
    const submitting = ref(false);

    async function submit() {
      submitting.value = true;
      try {
        const { data } = await auth.forgotPassword(form.email);
        notify(data.message || 'Da gui huong dan reset neu email ton tai');
      } catch (error) {
        notify(toApiError(error, 'Khong the gui yeu cau'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    return { form, submitting, submit };
  },
  template: `
    <div class="max-w-md mx-auto surface-card p-6 md:p-8">
      <h2 class="text-2xl font-semibold">Quen mat khau</h2>
      <p class="muted mt-2 text-sm">Nhap email de nhan reset token.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm muted">Email</label>
          <input v-model="form.email" class="input mt-1" type="email" />
        </div>
        <button class="btn btn-primary w-full" :disabled="submitting" @click="submit">
          {{ submitting ? 'Dang gui...' : 'Gui yeu cau' }}
        </button>
      </div>

      <div class="mt-4 text-sm">
        <RouterLink to="/reset-password" class="text-cyan-300">Da co token reset?</RouterLink>
      </div>
    </div>
  `
};
