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
  <h2>{{ this.clickedTile }}</h2>
</template>
<script>
import { BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
export default {
  emits: ['emit-attack-announcement', 'switchToEnemy'],
  props: ['isPlayersTurn'],
  data() {
    return {
      attackAnnouncement: 'test',
      boardAttack: [...BLANK_BOARD],
      clickedTile: '',
      sunkShips: undefined,
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      if (!this.isPlayersTurn) {
        this.attackAnnouncement = 'We must wait for our turn';
        return;
      }
      if (this.boardAttack[tileIndex] === 'miss' || this.boardAttack[tileIndex].includes(' hit')) {
        // Could also check last three characters
        this.attackAnnouncement = 'This space has already been attempted!';
        return;
      }
      this.$emit('switchToEnemy');
      this.clickedTile = tileIndex;
      if (this.boardAttack[tileIndex]) {
        this.boardAttack[tileIndex] += ' hit';
        // checkWinner
        // if won emit to app that player won and don't switch turns
        // also emit to announcement that player won
        this.attackAnnouncement = "The player's attack hit!";
      } else {
        this.boardAttack[tileIndex] = 'miss';
        // send "Miss..." to Announcement
        // emit whoseTurn to switch
        this.attackAnnouncement = "The player's missile landed harmlessly in the water."; //TODO: randomize these!
      }
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
