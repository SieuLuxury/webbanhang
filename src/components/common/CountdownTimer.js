export default {
  name: 'CountdownTimer',
  props: {
    expiresAt: { type: String, required: true }
  },
  data() {
    return { remaining: 0, timer: null };
  },
  computed: {
    isExpired() {
      return this.remaining <= 0;
    },
    display() {
      const m = String(Math.floor(this.remaining / 60)).padStart(2, '0');
      const s = String(this.remaining % 60).padStart(2, '0');
      return `${m}:${s}`;
    }
  },
  mounted() {
    this.tick();
    this.timer = setInterval(this.tick, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    tick() {
      const diff = Math.floor((new Date(this.expiresAt).getTime() - Date.now()) / 1000);
      this.remaining = Math.max(0, diff);
      if (this.remaining === 0 && this.timer) {
        clearInterval(this.timer);
        this.$emit('expired');
      }
    }
  },
  template: `<span :class="isExpired ? 'text-red-400' : 'text-emerald-300'" class="font-mono font-semibold">{{ isExpired ? 'Da het han' : display }}</span>`
};
