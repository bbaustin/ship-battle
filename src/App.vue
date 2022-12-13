<template>
  <Modal :gameStatus="this.gameStatus" />
  <main>
    <h1 v-if="gameStatus === 'placeShips'">Welcome to Ship Battle. Place your ships!</h1>
    <template v-else>
      <h1 v-if="isPlayersTurn">Player's Turn</h1>
      <h1 v-else>Computer's Turn</h1>
    </template>
    <section>
      <ShipPlacer
        v-if="this.gameStatus === 'placeShips'"
        @set-player-ships="handleSetPlayerShips"
      />
      <div
        class="boards"
        v-show="this.gameStatus === 'play'"
      >
        <BoardDefense
          ref="boardDefense"
          :gameStatus="this.gameStatus"
          :boardShipPlacement="this.boardShipPlacement"
          @emit-defense-announcement="handleEmittedAnnouncement"
        />
        <BoardAttack
          :isPlayersTurn="this.isPlayersTurn"
          @emit-attack-announcement="handleEmittedAnnouncement"
          @emit-game-status-change="handleGameStatusChange"
          @switch-to-enemy="switchPlayers"
        />
      </div>
    </section>
    <Announcement :announcement="this.announcement" />
  </main>
</template>
<script>
import Announcement from './components/Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
import Modal from './components/Modal.vue';
import ShipPlacer from './components//ShipPlacer.vue';
export default {
  components: { Announcement, BoardDefense, BoardAttack, Modal, ShipPlacer },
  data() {
    return {
      announcement: '',
      boardShipPlacement: [], // TODO: Does this need to be data in App? Can I pass this without changing
      gameStatus: 'placeShips', // options are 'placeShips', 'play', 'playerWin', 'enemyWin'
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
    handleSetPlayerShips(boardShipPlacement) {
      this.boardShipPlacement = [...boardShipPlacement];
      this.gameStatus = 'play';
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
}
.boards {
  display: flex;
  gap: 100px;
  margin-left: 5%;
}
.boards section {
  width: 50%;
}
</style>
