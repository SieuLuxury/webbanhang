export default {
  name: 'OrderTimeline',
  props: {
    events: { type: Array, default: () => [] }
  },
  template: `
    <ul class="space-y-2">
      <li v-for="(event, idx) in events" :key="idx" class="surface-card p-3 text-sm">
        <div class="font-medium">{{ event.title }}</div>
        <div class="muted text-xs mt-1">{{ event.time || '-' }}</div>
      </li>
    </ul>
  `
};
