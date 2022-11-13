<template>
  <section id="defense">
    <h1>my ships</h1>
    <div
      class="board"
      @click="this.aiRandom()"
    >
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
      enemyAttacks: [],
      enemyAttackPlan: [],
      enemyStrategy: 'random', // random, seek, target
      lastSuccessfulEnemyAttack: undefined,
      playerShipPositions: [2, 3, 4, 8, 9, 41, 51, 61, 58, 68, 78, 88],
    };
  },
  methods: {
    aiRandom() {
      let attackLocation = Math.floor(Math.random() * 100);
      if (this.enemyAttacks.includes(attackLocation)) return this.aiRandom();
      this.enemyAttacks.push(attackLocation);
      if (this.playerShipPositions.includes(attackLocation)) {
        this.enemyAttackPlan.push(attackLocation);
        return (this.boardDefense[attackLocation] = 'hit');
      }
      return (this.boardDefense[attackLocation] = 'miss');
    },
    aiSeek() {},
  },
  created() {
    this.playerShipPositions.forEach((position) => {
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
