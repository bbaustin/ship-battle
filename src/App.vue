<template>
  <main>
    <!-- @emit-attack-announcement="()=>return"  TODO: -->
    <section id="boards">
      <BoardDefense @emit-defense-announcement="handleEmittedAnnouncement" />
      <BoardAttack @emit-attack-announcement="handleEmittedAnnouncement" />
    </section>
    <Announcement :announcement="this.announcement" />
  </main>
</template>
<script>
import Announcement from './components//Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
import { BLANK_ENEMY_ATTACK_BOARD } from './assets/Constants';
export default {
  components: { Announcement, BoardDefense, BoardAttack },
  data() {
    return {
      announcement: '',
      gameStatus: 'play', // options are 'finish', 'placeShips', 'play'
      isPlayersTurn: true,
    };
  },
  methods: {
    handleEmittedAnnouncement(emittedAnnouncement) {
      this.announcement = emittedAnnouncement;
    },
    switchPlayers() {
      this.isPlayersTurn = !this.isPlayersTurn;
      if (this.isPlayersTurn) {
        // TODO: allow for clicking [see tic tac toe]
      } else {
        setTimeout(() => {
          // TODO: trigger aiAttack();
        }, 500);
      }
    },
  },
};
</script>
<style>
main {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
#boards {
  display: flex;
  gap: 100px;
  margin-left: 5%;
}
</style>
