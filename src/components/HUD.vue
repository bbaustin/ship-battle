<template>
  <section id="HUD">
    <!-- NOTE: Classes don't work on slots, since they're not actually elements -->
    <button
      class="change-active-button"
      type="button"
      @click="this.changeActive('prev')"
    >
      prev
    </button>
    <div class="slot-holder">
      <template v-for="(slot, index) in this.$slots">
        <div
          v-if="index == this.activeSlot"
          class="active"
        ></div>
        <slot :name="index"></slot>
      </template>
    </div>
    <button
      class="change-active-button"
      type="button"
      @click="this.changeActive('next')"
    >
      next
    </button>
  </section>
</template>
<script>
export default {
  data() {
    return {
      activeSlot: 0,
      slots: this.$slots,
    };
  },
  methods: {
    changeActive(direction) {
      if (direction === 'next') this.activeSlot === Object.keys(this.$slots).length - 1 ? (this.activeSlot = 0) : this.activeSlot++;
      if (direction === 'prev') this.activeSlot === 0 ? (this.activeSlot = Object.keys(this.$slots).length - 1) : this.activeSlot--;
    },
  },
};
</script>
<style lang="scss">
@use '../scss/modules/_colors' as *;
h4 {
  font-size: 10px;
  margin: 0 0 7px 0;
  padding: 9px 0px 0px 0px;
  text-align: center;
}
section#HUD {
  align-items: center;
  display: flex;
  justify-content: space-around;
  width: 100%;
}
// All sections are invisible...
section#HUD section {
  display: none;
}
// ...except for the one that is active
section#HUD .active + section {
  display: block;
}
.slot-holder {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  outline: 1px solid;
  overflow-y: scroll;
  width: 50%;
}
// Don't show toggle button on mini-screen
.slot-holder .board + button {
  display: none;
}
.slot-holder #defense {
  width: 80%;
}
button.change-active-button {
  height: 40px;
}
@media screen and (min-width: 1020px) {
  h4 {
    border-bottom: 1px solid $green;
    margin: 0;
    padding: 18px 0;
  }
}
</style>
