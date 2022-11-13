<template>
  <main>
    <BoardDefense />
    <BoardAttack :enemyBoard="this.enemyBoard" />
  </main>
</template>
<script>
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
export default {
  components: { BoardDefense, BoardAttack },
  data() {
    return {
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
      gameStatus: 'play', // options are 'finish', 'placeShips', 'play'
      whoseTurn: 1,
    };
  },
  methods: {
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
      if (Math.floor(Math.random() * 2) === 1) {
        return 'vertical';
      } else {
        return 'horizontal';
      }
    },
    aiRandom() {
      // let possibleChoices = this.board.filter((tile) => !tile.value);
    },
    aiTarget() {},
  },
  created() {
    this.placeEnemyShips();
  },
};
</script>
<style>
main {
  display: flex;
  gap: 100px;
}
</style>
