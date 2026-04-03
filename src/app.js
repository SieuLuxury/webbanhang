import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import router from './router.js';
import AppRoot from './components/layout/AppRoot.js';

const messages = {
  vi: {
    common: {
      loading: 'Dang tai...',
      submit: 'Xac nhan'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      submit: 'Submit'
    }
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'vi',
  fallbackLocale: 'en',
  messages
});

const app = createApp(AppRoot);
app.use(createPinia());
app.use(router);
app.use(i18n);
app.mount('#app');
