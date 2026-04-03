export default {
  name: 'EmptyState',
  props: {
    title: { type: String, default: 'Khong co du lieu' },
    description: { type: String, default: '' }
  },
  template: `
    <div class="surface-card p-8 text-center">
      <div class="text-lg font-semibold">{{ title }}</div>
      <div class="muted mt-2">{{ description }}</div>
      <div class="mt-4"><slot /></div>
    </div>
  `
};
