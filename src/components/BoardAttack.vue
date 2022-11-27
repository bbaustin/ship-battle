<template>
  <section id="attack">
    <h1>attack!</h1>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardAttack"
        class="cell"
        :class="this.boardAttack[index]"
        @click="[this.handleTileAttackClick(index), $emit('emit-attack-announcement', this.attackAnnouncement)]"
      ></div>
    </div>
  </section>
  <h2>{{ this.sunkShips }}</h2>
</template>
<script>
import { BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
export default {
  emits: ['emit-attack-announcement', 'emit-game-status-change', 'switch-to-enemy'],
  props: ['isPlayersTurn'],
  data() {
    return {
      attackAnnouncement: 'test',
      boardAttack: [...BLANK_BOARD],
      hitCount: 0,
      sunkShips: [],
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      // return so that your click doesn't do anything.
      if (!this.isPlayersTurn) {
        this.attackAnnouncement = 'We must wait for our turn';
        return;
      }
      // don't let player click an already-clicked tile
      if (this.boardAttack[tileIndex] === 'miss' || this.boardAttack[tileIndex].includes(' hit')) {
        this.attackAnnouncement = 'This space has already been attempted!';
        return;
      }
      if (this.boardAttack[tileIndex]) {
        this.hitCount++;
        this.boardAttack[tileIndex] += ' hit';
        if (this.didWin()) return;
        this.didSink(tileIndex);
        this.$emit('switch-to-enemy');
      } else {
        this.boardAttack[tileIndex] = 'miss';
        this.attackAnnouncement = "The player's missile landed harmlessly in the water."; //TODO: randomize these!
        this.$emit('switch-to-enemy');
      }
    },
    didWin() {
      if (this.hitCount === 17) {
        this.$emit('emit-game-status-change', 'playerWin');
      }
    },
    didSink(tileIndex) {
      //TODO: Do you want to move this in HELPERS? By adding board in the passed thing
      let shipName = this.boardAttack[tileIndex].slice(0, -4); // Removing ' hit'
      let shipSize;
      // Get the ship's size
      SHIP_SPECS.forEach((ship) => {
        if (ship.name === shipName) shipSize = ship.size; // TODO: This seems not great
      });
      let shipHitCount = 0;
      //TODO: Could do better logic here; you don't need to loop through the entire array...
      this.boardAttack.forEach((tile) => {
        if (tile === `${shipName} hit`) shipHitCount++;
      });
      if (shipHitCount === shipSize) {
        this.sunkShips.push(shipName);
        this.attackAnnouncement = `You sunk the enemy's ${shipName}`;
        return;
      }
      this.attackAnnouncement = `You hit an enemy ship!`;
      return;
    },
    placeEnemyShips() {
      SHIP_SPECS.forEach((ship) => {
        let alignment = this.randomizeAlignment(); // 'horizontal' or 'vertical'
        let position = this.randomizePosition(ship, alignment); // Array<number>
        position.forEach((coordinate) => {
          this.boardAttack[coordinate] = ship.name;
        });
      });
    },
    randomizeAlignment() {
      if (Math.floor(Math.random() * 2) === 1) return 'vertical';
      return 'horizontal';
    },
    randomizePosition(ship, alignment) {
      // Randomize a starting row/col
      // There are ten rows/cols, so to make sure the ship doesn't go OOB, subtract the ship's size from 10.
      let rowOrCol = Math.floor(Math.random() * 10).toString();
      let rowOrColConstrained = Math.floor(Math.random() * (10 - ship.size)).toString();
      let attemptedPosition = [];
      let num, addend;
      if (alignment === 'horizontal') {
        num = parseInt(rowOrCol + rowOrColConstrained, 10);
        addend = 1;
      } else {
        // vertical
        num = parseInt(rowOrColConstrained + rowOrCol, 10);
        addend = 10;
      }
      for (let i = 0; i < ship.size * addend; i += addend) {
        let coordinate = num + i;
        if (this.boardAttack[coordinate] !== '') {
          // The position was already taken, so start over. Feel free to log this for debugging: (`${ship.name}: ${coordinate} was already taken`);
          return this.randomizePosition(ship, alignment);
        } else {
          // The position is untaken, so add this to the array to return.
          attemptedPosition.push(num + i);
        }
      }
      return attemptedPosition;
    },
    attemptToPlaceShips() {},
  },
  created() {
    this.placeEnemyShips();
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
