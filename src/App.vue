<template>
  <Modal :gameStatus="this.gameStatus" />
  <main>
    <h1 v-if="isPlayersTurn">Player's Turn</h1>
    <h1 v-else>Computer's Turn</h1>
    <section id="boards">
      <BoardDefense
        ref="boardDefense"
        @emit-defense-announcement="handleEmittedAnnouncement"
      />
      <BoardAttack
        :isPlayersTurn="this.isPlayersTurn"
        @emit-attack-announcement="handleEmittedAnnouncement"
        @emit-game-status-change="handleGameStatusChange"
        @switch-to-enemy="switchPlayers"
      />
    </section>
    <Announcement :announcement="this.announcement" />
  </main>
</template>
<script>
import Announcement from './components/Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
import Modal from './components/Modal.vue';
export default {
  components: { Announcement, BoardDefense, BoardAttack, Modal },
  data() {
    return {
      announcement: '',
      gameStatus: 'play', // options are 'placeShips', 'play', 'playerWin', 'enemyWin'
      isPlayersTurn: true,
    };
  },
  methods: {
    handleEmittedAnnouncement(emittedAnnouncement) {
      this.announcement = emittedAnnouncement;
    },
    handleGameStatusChange(emittedStatus) {
      this.gameStatus = emittedStatus;
    },
    switchPlayers() {
      this.isPlayersTurn = !this.isPlayersTurn;
      if (!this.isPlayersTurn && this.gameStatus === 'play') {
        setTimeout(() => {
          this.$refs.boardDefense.aiAttack(); // NOTE: Could also do this via props (might be better practice, but more convoluted): https://stackoverflow.com/questions/55316490/vue-best-practice-for-calling-a-method-in-a-child-component
          this.isPlayersTurn = !this.isPlayersTurn;
        }, 750);
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
