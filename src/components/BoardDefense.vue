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
  </section>
</template>
<script>
import { BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
import { store } from '../store.js';
export default {
  emits: ['emit-defense-announcement'],
  props: ['boardShipPlacement'],
  updated() {
    this.boardDefense = this.boardShipPlacement;
  },
  data() {
    return {
      store,
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
    };
  },
  methods: {
    didHit(attackLocation) {
      return !!(this.boardDefense[attackLocation] && this.boardDefense[attackLocation] !== 'miss');
    },
    handleMiss(attackLocation, announcementType) {
      this.enemyAttacks.push(attackLocation);
      if (this.enemyStrategy === 'random') this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_MISS', '');
      if (this.enemyStrategy === 'seek' || this.enemyStrategy === 'destroy')
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_REPRIEVE', '');
      this.$emit('emit-defense-announcement', this.defenseAnnouncement);
      this.boardDefense[attackLocation] = 'miss';
    },
    handleHit(attackLocation) {
      this.enemyAttacks.push(attackLocation);
      this.boardDefense[attackLocation] += ' hit';
      this.lastSuccessfulEnemyAttack = attackLocation;
      // didSink returns shipName (sliced) or false
      let sunkShip = HELPERS.didSink(this.boardDefense, this.boardDefense[attackLocation]);
      if (sunkShip) {
        // NOTE: You might consider breaking this into another function, handleSink(sunkShip, attackLocation). Doesn't seem incredibly necessary, though
        store.sunkShips.enemy.push(sunkShip);
        // didWin(isPlayersTurn: boolean)
        if (HELPERS.didWin(false)) return;
        // If ship is sunk, you don't want to continue in the same direction. Attack randomly.
        this.enemyStrategy = 'random';
        this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_SINK_SHIP', sunkShip);
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
      } else {
        if (this.enemyStrategy === 'random')
          this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_HIT', this.boardDefense[attackLocation].slice(0, -4));
        if (this.enemyStrategy === 'seek' || this.enemyStrategy === 'destroy')
          this.defenseAnnouncement = HELPERS.generateAnnouncement(false, attackLocation, 'ENEMY_HIT_CONTINUED', this.boardDefense[attackLocation].slice(0, -4));
        this.$emit('emit-defense-announcement', this.defenseAnnouncement);
      }
    },
    aiRandom() {
      let attackLocation = Math.floor(Math.random() * 100);
      if (this.enemyAttacks.includes(attackLocation)) return this.aiRandom();
      if (this.didHit(attackLocation)) {
        this.handleHit(attackLocation);
        this.createSeekTargets(attackLocation);
        // It's possible there are no targets. In which case, please stay 'random'
        if (this.enemyAttackPlan.length) {
          this.enemyStrategy = 'seek';
        }
        this.enemyAttackPlanMemory.initialSuccessfulAttackCoordinate = attackLocation;
        return;
      }
      this.handleMiss(attackLocation, 'ENEMY_MISS');
      return;
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
      if (this.didHit(thisTurnsAttackCoordinate)) {
        // Reset your attack plan (to avoid attacking wrong directions)
        this.enemyAttackPlan = [];
        // Handles hit. If you sunk a ship, it 'returns', which should break you out of the rest.
        this.handleHit(thisTurnsAttackCoordinate);
        // Remember the direction that you are going to continue to attack in
        this.enemyAttackPlanMemory.initialSuccessfulAttackDirection = thisTurnsAttackDirection;
        // Remember the opposite direction, in case you have a missed attack in the near future
        this.enemyAttackPlanMemory.backupAttackDirection = HELPERS.DIR_REL[thisTurnsAttackDirection].oppositeDirection;
        // Change your strategy. Now you are doing a strafing run, not poking around the perimeter.
        // If the strategy is 'random', that suggests that a ship was sunk (coming from handleHit)
        if (this.enemyStrategy !== 'random') this.enemyStrategy = 'destroy';
        this.destroyDirection = thisTurnsAttackDirection;
      } else {
        this.handleMiss(thisTurnsAttackCoordinate, 'ENEMY_MISS');
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
            if (this.didHit(oppositeDirectionAttack)) {
              this.handleHit(oppositeDirectionAttack);
              return;
            }
            console.log('check here'); //TODO: Not sure if this is needed anymore but don't wanna delete yet
            // this.defenseAnnouncement = HELPERS.generateAnnouncement(
            //   false,
            //   oppositeDirectionAttack,
            //   'ENEMY_HIT_CONTINUED',
            //   this.boardDefense[oppositeDirectionAttack]
            // );
            // this.$emit('emit-defense-announcement', this.defenseAnnouncement);
            // return;
          } else {
            this.handleMiss(oppositeDirectionAttack, 'ENEMY_REPRIEVE');
            this.enemyStrategy = 'random';
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
        this.handleHit(nextAttack); //NOTE: This one is intended to be 'ENEMY_HIT_CONTINUED'
        return;
      }
      this.handleMiss(nextAttack, 'ENEMY_REPRIEVE'); //TODO: Should this be miss or reprieve?
      this.tryOppositeDirection();
    },
    // TODO: You can do some check of sunkShip in here for improved AI. As-is, if there are two adjacent ships and the enemy attacks them laterally, it will give up before killing either of them.
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
