<template>
  <section id="defense">
    <h1>my ships</h1>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardDefense"
        class="cell"
        :class="this.boardDefense[index]"
      ></div>
    </div>
  </section>
</template>
<script>
import { BLANK_BATTLESHIP_DEFENSE_BOARD } from '../assets/Constants.js';
export default {
  data() {
    return {
      boardDefense: BLANK_BATTLESHIP_DEFENSE_BOARD,
      shipPositions: [2, 3, 4, 8, 9, 41, 51, 61, 58, 68, 78, 88],
    };
  },
  created() {
    this.shipPositions.forEach((position) => {
      this.boardDefense[position] = 'boat';
    });
  },
};
</script>
<style scoped>
.boat {
  background: green;
}
</style>
