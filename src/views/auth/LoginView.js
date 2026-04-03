import { reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'LoginView',
  components: { RouterLink },
  setup() {
    const auth = useAuthStore();
    const route = useRoute();
    const router = useRouter();

    const form = reactive({ email: '', password: '' });
    const submitting = ref(false);

    async function submit() {
      submitting.value = true;
      try {
        await auth.login(form.email, form.password);
        notify('Dang nhap thanh cong');
        const redirect = route.query.redirect || '/products';
        router.push(String(redirect));
      } catch (error) {
        notify(toApiError(error, 'Dang nhap that bai'), 'error');
      } finally {
        submitting.value = false;
      }
    }

    return { form, submitting, submit };
  },
  template: `
    <div class="max-w-md mx-auto surface-card p-6 md:p-8">
      <h2 class="text-2xl font-semibold">Dang nhap</h2>
      <p class="muted mt-2 text-sm">Dang nhap de thanh toan va quan ly don hang cua ban.</p>

      <div class="mt-6 space-y-4">
        <div>
          <label class="text-sm muted">Email</label>
          <input v-model="form.email" class="input mt-1" type="email" placeholder="you@example.com" />
        </div>
        <div>
          <label class="text-sm muted">Mat khau</label>
          <input v-model="form.password" class="input mt-1" type="password" placeholder="********" />
        </div>

        <button class="btn btn-primary w-full" :disabled="submitting" @click="submit">
          {{ submitting ? 'Dang xu ly...' : 'Dang nhap' }}
        </button>
      </div>

      <div class="mt-4 text-sm flex items-center justify-between">
        <RouterLink to="/forgot-password" class="text-cyan-300">Quen mat khau?</RouterLink>
        <RouterLink to="/register" class="text-slate-300">Chua co tai khoan?</RouterLink>
      </div>
    </div>
  `
};
