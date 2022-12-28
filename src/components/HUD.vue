<template>
  <section id="HUD">
    <!-- <slot name="0"></slot>
    <slot name="1"></slot>
    <slot name="2"></slot> -->

    <!-- This works, but it won't let your Board update correctly if you swap the board out
    <h1>big one here</h1>
    <slot :name="this.activeSlot"></slot> -->

    <!-- NOTE: Classes don't work on slots, since they're not actually elements -->
    <h2>small ones here</h2>
    <div class="holder">
      <template v-for="(slot, index) in this.$slots">
        <div
          v-if="index == this.activeSlot"
          class="active"
        ></div>
        <slot :name="index"></slot>
      </template>
    </div>

    <button
      type="button"
      @click="this.changeActive"
    >
      button
    </button>
  </section>
</template>
<script>
export default {
  data() {
    return {
      activeSlot: 0,
      slots: this.$slots,
      slot: this.$slots[0],
    };
  },
  methods: {
    changeActive() {
      // TODO: Change this to be any lenght, not just 2
      this.activeSlot === 2 ? (this.activeSlot = 0) : this.activeSlot++;
    },
  },
};
</script>
<style lang="scss">
.holder {
  display: flex;
  flex-direction: row;
}
section#HUD {
  width: 100%;
}
section#HUD section {
  display: none;
}
section#HUD .active + section {
  display: block;
}
</style>
