export default {
  name: 'CartDrawer',
  props: {
    open: { type: Boolean, default: false }
  },
  emits: ['close'],
  template: `
    <div v-if="open" class="fixed inset-0 z-50 bg-black/40" @click.self="$emit('close')">
      <aside class="absolute right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Gio hang</h3>
          <button class="btn btn-outline" @click="$emit('close')">Dong</button>
        </div>
        <slot />
      </aside>
    </div>
  `
};
