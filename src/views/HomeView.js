import { RouterLink } from 'vue-router';

import ProductListView from './shop/ProductListView.js';

export default {
  name: 'HomeView',
  components: { RouterLink, ProductListView },
  template: `
    <section class="space-y-8">
      <div class="surface-card p-8 md:p-12">
        <p class="text-cyan-300 text-sm uppercase tracking-[0.3em]">Web Storefront</p>
        <h1 class="hero-title mt-3">Mua Digital Goods nhanh, an toan, tu dong giao ngay</h1>
        <p class="muted mt-4 max-w-3xl">
          Tai khoan, key va cac goi digital duoc quan ly ton kho realtime. Thanh toan linh hoat,
          nhan hang bang secure delivery token sau khi thanh toan thanh cong.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <a href="#home-products" class="btn btn-primary">Xem san pham ngay</a>
          <RouterLink to="/cart" class="btn btn-outline">Mo gio hang</RouterLink>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="surface-card p-5">
          <div class="text-cyan-300 font-semibold">Realtime inventory</div>
          <p class="muted mt-2 text-sm">Hien thi so luong kha dung theo tung san pham.</p>
        </div>
        <div class="surface-card p-5">
          <div class="text-cyan-300 font-semibold">Secure checkout</div>
          <p class="muted mt-2 text-sm">Don hang giu tam thoi va thanh toan co countdown ro rang.</p>
        </div>
        <div class="surface-card p-5">
          <div class="text-cyan-300 font-semibold">Instant delivery</div>
          <p class="muted mt-2 text-sm">Nhan secret ngay khi package duoc phat hanh.</p>
        </div>
      </div>

      <section id="home-products" class="space-y-4">
        <div>
          <p class="text-cyan-300 text-sm uppercase tracking-[0.28em]">San pham</p>
          <h2 class="text-2xl md:text-3xl font-semibold mt-2">Tat ca san pham dang ban</h2>
          <p class="muted mt-2">Khach vao trang chu la xem duoc san pham va mua ngay.</p>
        </div>
        <ProductListView />
      </section>
    </section>
  `
};
