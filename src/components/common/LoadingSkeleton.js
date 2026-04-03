export default {
  name: 'LoadingSkeleton',
  props: {
    lines: { type: Number, default: 3 }
  },
  template: `
    <div class="space-y-2 animate-pulse">
      <div v-for="line in lines" :key="line" class="h-3 rounded bg-slate-700/60"></div>
    </div>
  `
};
