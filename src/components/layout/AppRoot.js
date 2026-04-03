import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { gsap } from 'gsap';

import AppHeader from './AppHeader.js';
import AppFooter from './AppFooter.js';
import MobileNav from './MobileNav.js';

export default {
  name: 'AppRoot',
  components: {
    RouterView,
    AppHeader,
    AppFooter,
    MobileNav
  },
  setup() {
    onMounted(() => {
      gsap.from('.app-shell', { opacity: 0, y: 8, duration: 0.5, ease: 'power2.out' });
    });
    return {};
  },
  template: `
    <div class="app-shell">
      <AppHeader />
      <main class="py-8 pb-24 md:pb-8">
        <div class="page-container">
          <RouterView />
        </div>
      </main>
      <AppFooter />
      <MobileNav />
    </div>
  `
};
