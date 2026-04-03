import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'RegisterView',
  components: { RouterLink },
  setup() {
    const auth = useAuthStore();
    const router = useRouter();

    const form = reactive({
      email: '',
      password: '',
      display_name: ''
    });
    const submitting = ref(false);

    async function submit() {
      submitting.value = true;
      try {
        await auth.register(form);
        notify('Dang ky thanh cong. Vui long nhap OTP de xac thuc email.');
        router.push({ path: '/verify-email', query: { email: form.email } });
      } catch (error) {
        notify(toApiError(error, 'Dang ky that bai'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    return { form, submitting, submit };
  },
  template: `
    <div class="max-w-md mx-auto surface-card p-6 md:p-8">
      <h2 class="text-2xl font-semibold">Dang ky tai khoan</h2>
      <p class="muted mt-2 text-sm">Email se duoc dung de dang nhap va nhan delivery link.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm muted">Email</label>
          <input v-model="form.email" class="input mt-1" type="email" placeholder="you@example.com" />
        </div>
        <div>
          <label class="text-sm muted">Ten hien thi</label>
          <input v-model="form.display_name" class="input mt-1" type="text" placeholder="Nguyen Van A" />
        </div>
        <div>
          <label class="text-sm muted">Mat khau</label>
          <input v-model="form.password" class="input mt-1" type="password" placeholder="Toi thieu 8 ky tu" />
        </div>

        <button class="btn btn-primary w-full" :disabled="submitting" @click="submit">
          {{ submitting ? 'Dang xu ly...' : 'Tao tai khoan' }}
        </button>
      </div>

      <div class="mt-4 text-sm">
        <RouterLink to="/login" class="text-cyan-300">Da co tai khoan? Dang nhap</RouterLink>
      </div>
    </div>
  `
};
