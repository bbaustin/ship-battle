<template>
  <section id="defense">
    <h1>my ships</h1>
    <div>{{ enemyAttacks }}</div>
    <div>{{ enemyStrategy }}</div>
    <div>{{ enemyAttackPlan }}</div>
    <div>{{ lastSuccessfulEnemyAttack }}</div>
    <div
      class="board"
      @click="[this.aiAttack(), $emit('emit-defense-announcement', this.defenseAnnouncement)]"
    >
      <div
        v-for="(cell, index) in this.boardDefense"
        class="cell"
        :class="[this.boardDefense[index], this.enemyAttacks.at(-1) === index ? 'last-attack' : '']"
      >
        {{ index }}
      </div>
    </div>
  </section>
</template>
<script>
import { BLANK_BATTLESHIP_DEFENSE_BOARD } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
export default {
  emits: ['emit-defense-announcement'],
  data() {
    return {
      boardDefense: BLANK_BATTLESHIP_DEFENSE_BOARD,
      defenseAnnouncement: '',
      destroyDirection: undefined,
      enemyAttacks: [],
      enemyAttackPlan: [],
      enemyAttackPlanMemory: {
        initialSuccessfulAttackCoordinate: undefined,
        initialSuccessfulAttackDirection: undefined,
        backupAttackDirection: undefined,
      },
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
        this.createSeekTargets(attackLocation);
        // It's possible there are no targets. In which case, please stay 'random'
        if (this.enemyAttackPlan.length) {
          this.enemyStrategy = 'seek';
        }
        this.lastSuccessfulEnemyAttack = attackLocation;
        this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate = attackLocation;
        this.defenseAnnouncement = "Man your stations. We're under attack!";
        return (this.boardDefense[attackLocation] = 'hit');
      }
      this.defenseAnnouncement = 'The enemy missed our ship.';
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
      // Attack first element. Unless in top row, this is N.
      if (!this.enemyAttackPlan.length) {
        this.enemyStrategy = 'random';
        return this.aiRandom();
      }
      let thisTurnsAttackCoordinate = this.enemyAttackPlan[0].coordinate; // number
      let thisTurnsAttackDirection = this.enemyAttackPlan[0].direction; //n, s, e, w
      this.enemyAttacks.push(thisTurnsAttackCoordinate);
      if (this.playerShipPositions.includes(thisTurnsAttackCoordinate)) {
        // Reset your attack plan (to avoid attacking wrong directions)
        this.enemyAttackPlan = [];
        // Set to hit (obvi)
        this.defenseAnnouncement = 'The enemy is locked on.';
        this.boardDefense[thisTurnsAttackCoordinate] = 'hit';
        // Keep track of the last successful attack always
        this.lastSuccessfulEnemyAttack = thisTurnsAttackCoordinate;
        // Remember the direction that you are going to continue to attack in
        this.enemyAttackPlanMemory.initialSuccessfulAttackDirection = thisTurnsAttackDirection;
        // Remember the opposite direction, in case you have a missed attack in the near future
        this.enemyAttackPlanMemory.backupAttackDirection = HELPERS.DIR_REL[thisTurnsAttackDirection].oppositeDirection;
        // Change your strategy. Now you are doing a strafing run, not poking around the perimeter.
        this.enemyStrategy = 'destroy';
        this.destroyDirection = thisTurnsAttackDirection;
      } else {
        this.defenseAnnouncement = "The enemy's shot was wide.";
        this.boardDefense[thisTurnsAttackCoordinate] = 'miss';
        // Remove first element (i.e. this missed attack) in Attack Plan
        this.enemyAttackPlan.splice(0, 1);
      }
    },
    aiDestroy() {
      let nextAttack = HELPERS.DIR_REL[this.destroyDirection].check(this.lastSuccessfulEnemyAttack);
      // is nextAttack false (i.e. OOB)? 0 is falsy, so make a check for that.
      if ((!nextAttack && nextAttack !== 0) || this.enemyAttacks.includes(nextAttack)) {
        // check opposite direction
        if (this.tryOppositeDirection()) {
          // go back to the first successful attack location and check the opposite direction
          let oppositeDirectionAttack = HELPERS.DIR_REL[this.destroyDirection].check(this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate);
          console.log(oppositeDirectionAttack);
          // This if is probably unneeded, due to the tryOppositeDirection fx
          if (oppositeDirectionAttack) {
            this.enemyAttacks.push(oppositeDirectionAttack);
            if (this.playerShipPositions.includes(oppositeDirectionAttack)) {
              // this.lastSuccessfulEnemyAttack = oppositeDirectionAttack; // NOTE: I just added this 11/22. I think I forgot it before?
              this.defenseAnnouncement = "The enemy's onslaught is relentless.";
              return (this.boardDefense[oppositeDirectionAttack] = 'hit');
            } else {
              this.defenseAnnouncement = "Thankfully, there was a reprieve in the enemy's attack.";
              this.boardDefense[oppositeDirectionAttack] = 'miss';
              this.enemyStrategy = 'random';
            }
          }
        }
        // Either keep this line here, OR do it in tryOppositeDirection. Not both. Probably here.
        this.enemyStrategy = 'random';
        return this.aiRandom();
      }
      // if (this.enemyAttacks.includes(nextAttack)) {
      //   this.enemyStrategy = 'random';
      //   return this.aiRandom();
      // }
      // If it hits, set a hit. No futher action needed?
      if (this.playerShipPositions.includes(nextAttack)) {
        this.lastSuccessfulEnemyAttack = nextAttack;
        this.enemyAttacks.push(nextAttack);
        this.defenseAnnouncement = 'Steel yourselves! The attack continues!';
        return (this.boardDefense[nextAttack] = 'hit');
      }
      this.enemyAttacks.push(nextAttack);
      this.defenseAnnouncement = "What's this? The enemy failed to connect.";
      this.boardDefense[nextAttack] = 'miss';
      this.tryOppositeDirection();
    },
    tryOppositeDirection() {
      this.lastSuccessfulEnemyAttack = this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate; //TODO: Why do I do this
      this.destroyDirection = HELPERS.DIR_REL[this.destroyDirection].oppositeDirection;
      // Could use shorter state defined above. Make sure to check for 0, which is falsy.
      let thisOppAtt = HELPERS.DIR_REL[this.destroyDirection].check(this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate);
      if (this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate === 1) thisOppAtt = 0; // TODO: I thought this would solve an error, but it might not. If not, delete.
      let isOppDirAttempted = false;
      let isOppDirOOB = false;
      // if the opposite direction attack is out of bounds
      if (!thisOppAtt) {
        isOppDirOOB = true;
        this.enemyStrategy = 'random';
        return false;
      }
      // If you've already shot the spot in the opposite direction, give up and shoot randomly
      if (this.enemyAttacks.includes(thisOppAtt)) {
        this.enemyStrategy = 'random';
        return false;
      }
      // if you've already tried this direction, give up and shoot randomly
      if (this.destroyDirection === this.enemyAttackPlanMemory.initialSuccessfulAttackDirection) {
        isOppDirAttempted = true;
        this.enemyStrategy = 'random';
        return false;
      }
      return true;
    },
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
