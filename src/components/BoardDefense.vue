<template>
  <section id="defense">
    <h1>my ships</h1>
    <button @click.prevent="this.handleCoordinatesToggle">toggle coordinates</button>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardDefense"
        class="cell"
        :class="[
          this.boardDefense[index] && this.boardDefense[index] !== 'miss' ? 'boat' : '',
          this.boardDefense[index] === 'miss' ? 'miss' : '',
          this.boardDefense[index].slice(-3) === 'hit' ? 'hit' : '',
          this.enemyAttacks.at(-1) === index ? 'last-attack' : '',
        ]"
      >
        <span v-if="this.canSeeCoordinates">{{ index }}</span>
      </div>
    </div>
    <div>PAST ENEMY ATTACKS: {{ enemyAttacks }}</div>
    <div>ENEMY ATTACK STRATEGY: {{ enemyStrategy }}</div>
    <div>EXPECTED ENEMY ATTACK: {{ enemyAttackPlan }}</div>
    <div>LAST ON TARGET ATTACK: {{ lastSuccessfulEnemyAttack }}</div>
    <div>NEXT EXPECTED ACCURACY:</div>
    <!-- <div>DESTROYED PLAYER SHIPS:</div> DestroyedShipsList -->
  </section>
</template>
<script>
import { BLANK_BOARD } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';

export default {
  emits: ['emit-defense-announcement'], //'emit-game-status-change'
  props: ['gameStatus', 'boardShipPlacement'],
  updated() {
    this.boardDefense = this.boardShipPlacement;
  },
  data() {
    return {
      boardDefense: [],
      canSeeCoordinates: false,
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
      sunkShips: [],
    };
  },
  methods: {
    didHit(location) {
      return !!(this.boardDefense[location] && this.boardDefense[location] !== 'miss');
    },
    handleHit(board, shipName) {
      if (HELPERS.didSink(board, shipName)) {
      }
    },
    handleSink() {
      console.log('did sink');
      this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_SINK_SHIP', this.boardDefense[attackLocation]);
      this.sunkShips.push(this.boardDefense[attackLocation]);
      this.enemyStrategy = 'random';
      // if you sunk, you don't need to keep attacking this area.
      return;
    },
    aiRandom() {
      let attackLocation = Math.floor(Math.random() * 100);
      if (this.enemyAttacks.includes(attackLocation)) return this.aiRandom();
      this.enemyAttacks.push(attackLocation);
      if (this.didHit(attackLocation)) {
        // NOTE: It's possible that a random attack could sink a ship (I think..?) But unlikely..?
        this.handleHit(this.boardDefense, this.boardDefense[attackLocation]);
        if (HELPERS.didSink(this.boardDefense, this.boardDefense[attackLocation])) {
        }
        this.createSeekTargets(attackLocation);
        // It's possible there are no targets. In which case, please stay 'random'
        if (this.enemyAttackPlan.length) {
          this.enemyStrategy = 'seek';
        }
        this.lastSuccessfulEnemyAttack = attackLocation;
        this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate = attackLocation;
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_HIT', this.boardDefense[attackLocation]);
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
        return (this.boardDefense[attackLocation] += ' hit');
      }
      this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_MISS', '');
      this.$emit('emit-defense-announcement', this.defenseAnnouncement);
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
      if (this.didHit(thisTurnsAttackCoordinate)) {
        // Reset your attack plan (to avoid attacking wrong directions)
        this.enemyAttackPlan = [];
        // Set to hit (obvi)
        this.boardDefense[thisTurnsAttackCoordinate] += ' hit';
        if (HELPERS.didSink(this.boardDefense, this.boardDefense[thisTurnsAttackCoordinate])) {
          console.log('did sink');
          this.defenseAnnouncement = HELPERS.generateAnnouncement(false, thisTurnsAttackCoordinate, 'ENEMY_SINK', this.boardDefense[thisTurnsAttackCoordinate]);
          this.sunkShips.push(this.boardDefense[thisTurnsAttackCoordinate]);
          this.enemyStrategy = 'random';
          // if you sunk, you don't need to keep attacking this area.
          // would return this.aiRandom() create the error of two attacks?
          return;
        }
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, thisTurnsAttackCoordinate, 'ENEMY_HIT', this.boardDefense[thisTurnsAttackCoordinate]);
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
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
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, thisTurnsAttackCoordinate, 'ENEMY_MISS', '');
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
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
            // TODO: I think you're missing some steps right here. Like pushing the attack, setting successful attack. Just create your function to handleHits already haha
            if (this.didHit(oppositeDirectionAttack)) {
              this.boardDefense[oppositeDirectionAttack] += ' hit';
              if (HELPERS.didSink(this.boardDefense, this.boardDefense[oppositeDirectionAttack])) {
                console.log('did sink');
                this.defenseAnnouncement = HELPERS.generateAnnouncement(
                  false,
                  oppositeDirectionAttack,
                  'ENEMY_SINK',
                  this.boardDefense[oppositeDirectionAttack]
                );
                this.sunkShips.push(this.boardDefense[oppositeDirectionAttack]);
                this.enemyStrategy = 'random';
                // if you sunk, you don't need to keep attacking this area.
                // would return this.aiRandom() create the error of two attacks?
                return;
              }
              // this.lastSuccessfulEnemyAttack = oppositeDirectionAttack; // NOTE: I just added this 11/22. I think I forgot it before?
              this.defenseAnnouncement = HELPERS.generateAnnouncement(
                false,
                oppositeDirectionAttack,
                'ENEMY_HIT_CONTINUED',
                this.boardDefense[oppositeDirectionAttack]
              );
              this.$emit('emit-defense-announcement', this.defenseAnnouncement);
              return;
            } else {
              this.defenseAnnouncement = this.defenseAnnouncement = HELPERS.generateAnnouncement(
                false,
                oppositeDirectionAttack,
                'ENEMY_REPRIEVE',
                this.boardDefense[oppositeDirectionAttack]
              );
              this.$emit('emit-defense-announcement', this.defenseAnnouncement);
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
      if (this.didHit(nextAttack)) {
        this.boardDefense[nextAttack] += ' hit';
        if (HELPERS.didSink(this.boardDefense, this.boardDefense[nextAttack])) {
          console.log('did sink');
          this.defenseAnnouncement = HELPERS.generateAnnouncement(false, nextAttack, 'ENEMY_SINK', this.boardDefense[nextAttack]);
          this.sunkShips.push(this.boardDefense[nextAttack]);
          this.enemyStrategy = 'random';
          // if you sunk, you don't need to keep attacking this area.
          // would return this.aiRandom() create the error of two attacks?
          return;
        }
        this.lastSuccessfulEnemyAttack = nextAttack;
        this.enemyAttacks.push(nextAttack);
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, nextAttack, 'ENEMY_HIT_CONTINUED', this.boardDefense[nextAttack]);
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
        return;
      }
      this.enemyAttacks.push(nextAttack);
      this.defenseAnnouncement = HELPERS.generateAnnouncement(false, nextAttack, 'ENEMY_REPRIEVE', ''); //TODO: Should this be miss or reprieve?
      this.$emit('emit-defense-announcement', this.defenseAnnouncement);
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
    handleCoordinatesToggle() {
      return (this.canSeeCoordinates = !this.canSeeCoordinates);
    },
  },
};
</script>
