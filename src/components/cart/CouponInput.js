export default {
  name: 'CouponInput',
  props: {
    modelValue: { type: String, default: '' }
  },
  emits: ['update:modelValue', 'apply'],
  template: `
    <div>
      <label class="text-sm muted">Ma giam gia</label>
      <div class="flex gap-2 mt-1">
        <input class="input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
        <button class="btn btn-outline" @click="$emit('apply')">Ap dung</button>
      </div>
    </div>
  `
};
