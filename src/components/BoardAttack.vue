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
import { BLANK_BATTLESHIP_ATTACK_BOARD } from '../assets/Constants.js';
export default {
  emits: ['emit-attack-announcement', 'switchToEnemy'],
  props: ['isPlayersTurn'],
  data() {
    return {
      attackAnnouncement: 'test',
      boardAttack: BLANK_BATTLESHIP_ATTACK_BOARD,
      boardEnemyAttack: [],
      boardEnemyDefense: [],
      clickedTile: '',
      enemyBoard: [],
      enemyShips: [
        {
          name: 'Carrier',
          size: 5,
          alignment: this.randomizeAlignment(),
        },
        {
          name: 'Battleship',
          size: 4,
          alignment: this.randomizeAlignment(),
        },
        {
          name: 'Destroyer',
          size: 3,
          alignment: this.randomizeAlignment(),
        },
        {
          name: 'Submarine',
          size: 3,
          alignment: this.randomizeAlignment(),
        },
        {
          name: 'Patrol Boat',
          size: 2,
          alignment: this.randomizeAlignment(),
        },
      ],
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      if (!this.isPlayersTurn) return;
      this.$emit('switchToEnemy');
      if (this.boardAttack[tileIndex]) {
        return;
      }
      this.clickedTile = tileIndex;
      if (this.enemyBoard.includes(tileIndex)) {
        this.boardAttack[tileIndex] = 'hit';
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
      this.randomizeAlignment();
      this.enemyShips.forEach((ship) => {
        let rowOrCol = Math.floor(Math.random() * 10).toString();
        let rowOrColConstrained = Math.floor(Math.random() * (10 - ship.size)).toString();
        if (ship.alignment === 'horizontal') {
          let num = parseInt(rowOrCol + rowOrColConstrained, 10);
          for (let i = 0; i < ship.size; i++) {
            this.enemyBoard.push(num + i);
            // TODO: check for overlap
          }
        } else {
          let num = parseInt(rowOrColConstrained + rowOrCol, 10);
          for (let i = 0; i < ship.size * 10; i += 10) {
            this.enemyBoard.push(num + i);
            //TODO: check for overlap
          }
        }
      });
    },
    randomizeAlignment() {
      if (Math.floor(Math.random() * 2) === 1) return 'vertical';
      return 'horizontal';
    },
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
