<template>
  <section v-if="store.gameStatus === 'enemyWin' || store.gameStatus === 'playerWin'">
    <dialog open>
      <h1 v-if="store.gameStatus === 'enemyWin'">All of our ships were sunk!</h1>
      <h1 v-else>Congratulations! We've won!</h1>
      <!-- TODO: Reset a bunch of stuff on button click -->
      <button
        @click.prevent="this.resetGame"
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
  data() {
    return {
      store,
    };
  },
  methods: {
    resetGame() {
      // QUESTION: Will simply changing the gameStatus fix most of these?
      // ANSWER: It appears not, using Vue DevTools, at least
      // Reset boardShipPlacement
      // Randomize boardShipPlacement
      // Reset boardEnemy
      // Randomize boardEnemy
      // Reset boardPlayer
      // Set gameStatus = "placeShips"
      // Reset isPlayersTurn? Maybe
      // Reset announcement
    },
  },
};
</script>
<style scoped lang="scss">
@import '../scss/modules/colors.scss';
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
