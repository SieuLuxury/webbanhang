import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import CountdownTimer from '../../components/common/CountdownTimer.js';
import api from '../../lib/api.js';
import { formatDate, notify, toApiError } from '../../lib/utils.js';

function formatDurationFromSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const parts = [];
  if (days) parts.push(`${days} ngay`);
  if (hours) parts.push(`${hours} gio`);
  if (minutes) parts.push(`${minutes} phut`);
  if (!parts.length || seconds) parts.push(`${seconds} giay`);
  return parts.slice(0, 3).join(' ');
}

export default {
  name: 'DeliveryView',
  components: { CountdownTimer, RouterLink },
  setup() {
    const route = useRoute();
    const loading = ref(false);
    const delivery = ref(null);
    const tokenExpired = ref(false);

    const itemCount = computed(() => delivery.value?.items?.length || 0);
    const ttlLabel = computed(() => {
      if (!delivery.value?.created_at || !delivery.value?.expires_at) return '-';
      const createdAt = new Date(delivery.value.created_at).getTime();
      const expiresAt = new Date(delivery.value.expires_at).getTime();
      if (!Number.isFinite(createdAt) || !Number.isFinite(expiresAt) || expiresAt <= createdAt) {
        return '-';
      }
      return formatDurationFromSeconds((expiresAt - createdAt) / 1000);
    });

    const accessPolicyLabel = computed(() => {
      if (!delivery.value) return '-';
      return tokenExpired.value ? 'Link da het han' : 'Ai co link cung co the xem trong thoi han token';
    });

    const viewCountLabel = computed(() => {
      if (!delivery.value) return '-';
      return String(delivery.value.view_count || 0);
    });

    const tokenStateLabel = computed(() => {
      if (!delivery.value) return '-';
      if (tokenExpired.value) return 'Da het han';
      return 'Dang hoat dong';
    });

    const copyAllText = computed(() => {
      if (!delivery.value?.items?.length) return '';
      return delivery.value.items
        .map((item, index) => {
          const headerParts = [item.product_name];
          if (item.product_sku) headerParts.push(`SKU ${item.product_sku}`);
          if (item.line_number) headerParts.push(`Dong ${item.line_number}`);
          return `${index + 1}. ${headerParts.join(' | ')}\n${item.secret_value}`;
        })
        .join('\n\n');
    });

    async function load() {
      loading.value = true;
      try {
        const { data } = await api.get(`/delivery/${route.params.token}`);
        delivery.value = data;
        tokenExpired.value = Date.now() >= new Date(data.expires_at).getTime();
      } catch (error) {
        notify(toApiError(error, 'Khong truy cap duoc delivery token'), 'error');
      } finally {
        loading.value = false;
      }
    }

    async function copySecret(value) {
      await navigator.clipboard.writeText(value);
      notify('Da copy secret');
    }

    async function copyAllSecrets() {
      if (!copyAllText.value) return;
      await navigator.clipboard.writeText(copyAllText.value);
      notify('Da copy toan bo thong tin');
    }

    function markExpired() {
      tokenExpired.value = true;
    }

    onMounted(load);

    return {
      loading,
      delivery,
      itemCount,
      ttlLabel,
      accessPolicyLabel,
      viewCountLabel,
      tokenStateLabel,
      copyAllText,
      copySecret,
      copyAllSecrets,
      markExpired,
      tokenExpired,
      formatDate
    };
  },
  template: `
    <section class="max-w-5xl mx-auto">
      <article v-if="delivery" class="surface-card p-6 md:p-8 space-y-6">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div class="text-cyan-300 text-sm uppercase tracking-[0.28em]">Nhan hang</div>
            <h2 class="text-3xl font-semibold mt-2">Thong tin giao hang da san sang</h2>
            <p class="muted text-sm mt-2 max-w-2xl">
              Luu lai thong tin ngay. Link nay hoat dong trong thoi han token va co the mo lai nhieu lan truoc khi het han.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary" @click="copyAllSecrets" :disabled="!copyAllText">Copy tat ca</button>
            <RouterLink to="/" class="btn btn-outline">Quay lai trang chu</RouterLink>
          </div>
        </div>

        <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div class="surface-card p-4">
            <div class="muted text-sm">Ma don hang</div>
            <div class="font-mono text-sm mt-2 break-all">{{ delivery.order_public_id }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Ma goi giao hang</div>
            <div class="font-mono text-sm mt-2 break-all">{{ delivery.package_public_id }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">So item</div>
            <div class="font-semibold text-cyan-300 mt-2">{{ itemCount }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Thoi han link</div>
            <div class="font-semibold mt-2">{{ ttlLabel }}</div>
            <div class="muted text-xs mt-1">Lay theo cau hinh delivery token hien tai.</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Het han luc</div>
            <div class="font-semibold mt-2">{{ formatDate(delivery.expires_at) }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Con lai den khi het han</div>
            <div class="font-semibold mt-2">
              <CountdownTimer :expires-at="delivery.expires_at" @expired="markExpired" />
            </div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Quyen truy cap</div>
            <div class="font-semibold mt-2">{{ accessPolicyLabel }}</div>
          </div>
          <div class="surface-card p-4">
            <div class="muted text-sm">Luot mo da ghi nhan</div>
            <div class="font-semibold mt-2">{{ viewCountLabel }}</div>
          </div>
          <div class="surface-card p-4 md:col-span-2 xl:col-span-2">
            <div class="muted text-sm">Trang thai token</div>
            <div class="font-semibold mt-2" :class="tokenExpired ? 'text-amber-300' : 'text-emerald-300'">
              {{ tokenStateLabel }}
            </div>
            <div class="muted text-xs mt-2">
              Link nay duoc xem lai nhieu lan cho den khi het han. Neu muon ngung truy cap som hon, can revoke hoac tao token moi.
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Day la thong tin nhay cam. Khong chia se link hoac secret cho nguoi khac. Neu da xem du lieu, hay doi mat khau hoac luu vao noi an toan.
        </div>

        <div class="space-y-4">
          <article v-for="(item, idx) in delivery.items" :key="idx" class="surface-card p-5 space-y-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div class="text-lg font-semibold">{{ item.product_name }}</div>
                <div class="muted text-sm mt-1 flex flex-wrap gap-3">
                  <span v-if="item.product_sku">SKU: {{ item.product_sku }}</span>
                  <span v-if="item.line_number">Dong: {{ item.line_number }}</span>
                </div>
              </div>
              <button class="btn btn-outline" @click="copySecret(item.secret_value)">Copy item</button>
            </div>

            <div class="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <div class="muted text-xs uppercase tracking-[0.24em] mb-3">Secret</div>
              <pre class="font-mono text-sm whitespace-pre-wrap break-all leading-7">{{ item.secret_value }}</pre>
            </div>
          </article>
        </div>
      </article>

      <div v-else-if="loading" class="surface-card p-8 muted">Dang tai du lieu delivery...</div>
      <div v-else class="surface-card p-8 text-red-300">Delivery khong ton tai hoac da het han.</div>
    </section>
  `
};
