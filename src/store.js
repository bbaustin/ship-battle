import { reactive } from 'vue';

export const store = reactive({
  gameStatus: 'placeShips', // options are 'placeShips', 'play', 'playerWin', 'enemyWin', 'pending'
  sunkShips: {
    player: [],
    enemy: [],
  },
});
