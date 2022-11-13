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
      console.log('placing enemy ships');
      this.randomizeAlignment();
      this.enemyShips.forEach((ship) => {
        if (ship.alignment === 'horizontal') {
          let row = Math.floor(Math.random() * 10).toString();
          let col = Math.floor(Math.random() * (10 - ship.size)).toString();
          let num = parseInt(row + col, 10);
          for (let i = 0; i < ship.size; i++) {
            this.enemyBoard.push(num + i);
            // TODO: check for overlap
          }
        } else {
          let row = Math.floor(Math.random() * (10 - ship.size)).toString();
          let col = Math.floor(Math.random() * 10).toString();
          let num = parseInt(row + col, 10);
          for (let i = 0; i < ship.size * 10; i += 10) {
            this.enemyBoard.push(num + i);
          }
        }
      });
    },
    randomizeAlignment() {
      if (Math.floor(Math.random() * 2) === 1) {
        return 'vertical';
        console.log('vert');
      } else {
        return 'horizontal';
        console.log('hor');
      }
    },
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
