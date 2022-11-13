<template>
  <section id="defense">
    <h1>my ships</h1>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardDefense"
        class="cell"
      ></div>
    </div>
  </section>
</template>
<script>
import { BLANK_BATTLESHIP_BOARD } from '../assets/Constants.js';
export default {
  data() {
    return {
      boardAttack: BLANK_BATTLESHIP_BOARD,
      boardDefense: BLANK_BATTLESHIP_BOARD,
    };
  },
};
</script>
<style></style>
