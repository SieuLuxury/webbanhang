import { reactive, ref } from 'vue';

import api from '../../lib/api.js';
import { useAuthStore } from '../../stores/auth.js';
import { notify, toApiError } from '../../lib/utils.js';

export default {
  name: 'ProfileView',
  setup() {
    const auth = useAuthStore();

    const profileForm = reactive({
      display_name: auth.customer?.display_name || '',
      preferred_language_code: auth.customer?.preferred_language_code || 'vi'
    });

    const passwordForm = reactive({
      current_password: '',
      new_password: ''
    });

    const savingProfile = ref(false);
    const changingPassword = ref(false);

    async function saveProfile() {
      savingProfile.value = true;
      try {
        await api.patch('/customers/me', profileForm);
        await auth.refreshProfile();
        notify('Da cap nhat thong tin ca nhan');
      } catch (error) {
        notify(toApiError(error, 'Khong cap nhat duoc profile'), 'error');
      } finally {
        savingProfile.value = false;
      }
    }

    async function changePassword() {
      changingPassword.value = true;
      try {
        await api.post('/auth/change-password', passwordForm);
        passwordForm.current_password = '';
        passwordForm.new_password = '';
        notify('Da doi mat khau');
      } catch (error) {
        notify(toApiError(error, 'Khong doi duoc mat khau'), 'error');
      } finally {
        changingPassword.value = false;
      }
    }

    return {
      auth,
      profileForm,
      passwordForm,
      savingProfile,
      changingPassword,
      saveProfile,
      changePassword
    };
  },
  template: `
    <section class="grid md:grid-cols-2 gap-5">
      <article class="surface-card p-5">
        <h2 class="text-xl font-semibold">Thong tin tai khoan</h2>
        <div class="mt-4 space-y-4">
          <div>
            <label class="text-sm muted">Email</label>
            <input class="input mt-1" :value="auth.customer?.email || ''" disabled />
          </div>
          <div>
            <label class="text-sm muted">Ten hien thi</label>
            <input class="input mt-1" v-model="profileForm.display_name" />
          </div>
          <div>
            <label class="text-sm muted">Ngon ngu</label>
            <select class="select mt-1" v-model="profileForm.preferred_language_code">
              <option value="vi">Tieng Viet</option>
              <option value="en">English</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <button class="btn btn-primary" :disabled="savingProfile" @click="saveProfile">
            {{ savingProfile ? 'Dang luu...' : 'Luu thay doi' }}
          </button>
        </div>
      </article>

      <article class="surface-card p-5">
        <h2 class="text-xl font-semibold">Doi mat khau</h2>
        <div class="mt-4 space-y-4">
          <div>
            <label class="text-sm muted">Mat khau hien tai</label>
            <input class="input mt-1" type="password" v-model="passwordForm.current_password" />
          </div>
          <div>
            <label class="text-sm muted">Mat khau moi</label>
            <input class="input mt-1" type="password" v-model="passwordForm.new_password" />
          </div>
          <button class="btn btn-primary" :disabled="changingPassword" @click="changePassword">
            {{ changingPassword ? 'Dang cap nhat...' : 'Doi mat khau' }}
          </button>
        </div>
      </article>
    </section>
  `
};
