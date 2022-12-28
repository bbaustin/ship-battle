<template>
  <section id="HUD">
    <slot name="first"></slot>
    <h1>other thing</h1>
    <slot></slot>
  </section>
</template>
<script>
import { useSlots } from 'vue';

const slots = useSlots() || '';

const children = slots.default()[0].children;
export default {
  data() {
    return {
      slots: slots,
      children: children,
      mySlots: this.$slots,
    };
  },
};
</script>
<style lang="scss">
.active {
  color: red;
  font-size: 100px;
}
section#HUD {
  width: 100%;
}
section#HUD > section:first-child {
  background: pink;
}
</style>
