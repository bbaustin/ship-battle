<template>
  <section id="defense">
    <h1>my ships</h1>
    <div
      class="board"
      @click="this.aiAttack()"
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
import * as HELPERS from '../assets/Helpers.js';
export default {
  data() {
    return {
      boardDefense: BLANK_BATTLESHIP_DEFENSE_BOARD,
      enemyAttacks: [],
      enemyAttackPlan: [],
      enemyStrategy: 'random', // random, seek, destroy
      lastSuccessfulEnemyAttack: undefined,
      playerShipPositions: [0, 1, 2, 3, 4, 8, 9, 41, 51, 61, 58, 68, 78, 88, 90, 91, 92, 98, 99], // NOTE: Do you need this and boardDefense? Can't you just add 'boat' class directly to boardDefense? Think about it
    };
  },
  methods: {
    aiRandom() {
      let attackLocation = Math.floor(Math.random() * 100);
      if (this.enemyAttacks.includes(attackLocation)) return this.aiRandom();
      this.enemyAttacks.push(attackLocation);
      if (this.playerShipPositions.includes(attackLocation)) {
        this.enemyStrategy = 'seek';
        this.createSeekTargets(attackLocation);
        this.lastSuccessfulEnemyAttack = attackLocation; // TODO: Is this helpful?
        return (this.boardDefense[attackLocation] = 'hit');
      }
      return (this.boardDefense[attackLocation] = 'miss');
    },
    createSeekTargets(initialAttackLocation) {
      const attackOptionN = HELPERS.checkN(initialAttackLocation);
      const attackOptionE = HELPERS.checkE(initialAttackLocation);
      const attackOptionS = HELPERS.checkS(initialAttackLocation);
      const attackOptionW = HELPERS.checkW(initialAttackLocation);
      if (attackOptionN) if (!this.enemyAttacks.includes(attackOptionN)) this.enemyAttackPlan.push({ coordinate: attackOptionN, direction: 'n' });
      if (attackOptionE) if (!this.enemyAttacks.includes(attackOptionE)) this.enemyAttackPlan.push({ coordinate: attackOptionE, direction: 'e' });
      if (attackOptionS) if (!this.enemyAttacks.includes(attackOptionS)) this.enemyAttackPlan.push({ coordinate: attackOptionS, direction: 's' });
      if (attackOptionW) if (!this.enemyAttacks.includes(attackOptionW)) this.enemyAttackPlan.push({ coordinate: attackOptionW, direction: 'w' });
    },
    aiSeek() {
      // To DO! Continue on strategy for this
      // Attack first element. Unless in top row, this is N.
      let thisTurnsAttackCoordinate = this.enemyAttackPlan[0].coordinate; // number
      let thisTurnsAttackDirection = this.enemyAttackPlan[0].direction; //n, s, e, w
      // this.enemyAttacks.push(thisTurnsAttack)  // NOTE: I think I only need this during aiRandom?
      if (this.playerShipPositions.includes(thisTurnsAttackCoordinate)) {
        this.boardDefense[thisTurnsAttackCoordinate] = 'hit';
        // Reset attack plan (to get rid of unrelated directions)
        this.enemyAttackPlan = [];
        // Loop through HELPERS.DIRECTIONAL_RELATION using Object.keys [I think] and return the related direction
        let directions = Object.keys(HELPERS.DIRECTIONAL_RELATION);
        directions.forEach((direction) => {
          if (direction === thisTurnsAttackDirection) {
            // If it's available, set the attack plan to it (reset array), and also push check[thisdirection]
            this.enemyAttackPlan.push(HELPERS.DIRECTIONAL_RELATION.check(thisTurnsAttackCoordinate));
            this.enemyAttackPlan.push(HELPERS.DIRECTIONAL_RELATION.oppositeCheck(thisTurnsAttackCoordinate));
          }
        });
      } else {
        this.boardDefense[thisTurnsAttackCoordinate] = 'miss';
        // Remove first element in Attack Plan
        this.enemyAttackPlan.splice(0, 1);
      }
      // unshift afterwards
      // If length = 0, (i.e. no south) push further North
      // Else try South
      // This will be kind of hard to program efficiently haha
      // Is above DESTROY? <-- a little unclear what seek vs destroy is
      // I guess you need to keep doing checkN/checkS
    },
    aiDestroy() {},
    aiAttack() {
      if (this.enemyStrategy === 'random') return this.aiRandom();
      if (this.enemyStrategy === 'seek') return this.aiSeek();
      if (this.enemyStrategy === 'destroy') return this.aiDestroy();
    },
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
