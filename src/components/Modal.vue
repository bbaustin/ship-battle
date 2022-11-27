<template>
  <section v-if="this.gameStatus === 'enemyWin' || this.gameStatus === 'playerWin'">
    <dialog open>
      <h1 v-if="this.gameStatus === 'enemyWin'">All our ships were sunk!</h1>
      <h1 v-else>Congratulations! We've won!</h1>
      <button>Play again?</button>
    </dialog>
  </section>
</template>
<script>
export default {
  props: ['gameStatus'],
};
</script>
<style scoped>
section {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(0.75rem);
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
  background: white;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 20%;
  padding: 50px 70px;
  width: 50%;
  z-index: 10;
}
</style>
