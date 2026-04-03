import ProductCard from './ProductCard.js';

export default {
  name: 'ProductGrid',
  components: { ProductCard },
  props: {
    items: { type: Array, default: () => [] }
  },
  emits: ['add'],
  template: `
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProductCard v-for="item in items" :key="item.public_id" :product="item" @add="$emit('add', $event)" />
    </div>
  `
};
