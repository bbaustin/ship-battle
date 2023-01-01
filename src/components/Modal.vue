<template>
  <section>
    <dialog open>
      <h1 v-if="store.gameStatus === 'enemyWin'">All of our ships were sunk!</h1>
      <h1 v-else>Congratulations! We've won!</h1>
      <!-- TODO: Reset a bunch of stuff on button click -->
      <button
        @click.prevent="$emit('handle-game-reset')"
        class="special"
      >
        Play again?
      </button>
    </dialog>
  </section>
</template>
<script>
import { store } from '../store.js';
export default {
  emits: ['handle-game-reset'],
  data() {
    return {
      store,
    };
  },
};
</script>
<style scoped lang="scss">
@use '../scss/modules/_colors' as *;
section {
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(0.5rem);
  display: flex;
  height: 100vh;
  justify-content: center;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 5;
}
dialog {
  align-items: center;
  background: $grey;
  border: 1px solid $green;
  color: $green;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20%;
  padding: 50px 70px;
  width: 50%;
  z-index: 10;
}
</style>
