export default {
  name: 'SecretReveal',
  props: {
    value: { type: String, required: true }
  },
  data() {
    return { shown: false };
  },
  computed: {
    masked() {
      if (this.shown) return this.value;
      return '*'.repeat(Math.min(12, this.value.length || 8));
    }
  },
  template: `
    <div class="surface-card p-3">
      <div class="font-mono break-all">{{ masked }}</div>
      <button class="btn btn-outline mt-2" @click="shown = !shown">{{ shown ? 'An' : 'Hien' }}</button>
    </div>
  `
};
