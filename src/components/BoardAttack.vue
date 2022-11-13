<template>
  <section id="attack">
    <h1>attack!</h1>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardAttack"
        class="cell"
        :class="this.boardAttack[index]"
        @click="this.handleTileAttackClick(index)"
      ></div>
    </div>
  </section>
  <h2>{{ this.clickedTile }}</h2>
</template>
<script>
import { BLANK_BATTLESHIP_ATTACK_BOARD } from '../assets/Constants.js';
export default {
  props: ['enemyBoard'],
  data() {
    return {
      boardAttack: BLANK_BATTLESHIP_ATTACK_BOARD,
      boardEnemyAttack: [],
      boardEnemyDefense: [],
      clickedTile: '',
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      if (this.boardAttack[tileIndex]) {
        return;
      }
      this.clickedTile = tileIndex;
      if (this.enemyBoard.includes(tileIndex)) {
        this.boardAttack[tileIndex] = 'hit';
        // checkWinner
        // send "HIT!!! Go again!" to Announcement
      } else {
        this.boardAttack[tileIndex] = 'miss';
        // send "Miss..." to Announcement
        // emit whoseTurn to switch
      }
    },
  },
};
</script>
<style scoped>
.cell {
  cursor: pointer;
}
.cell:hover {
  filter: brightness(85%);
}
</style>
