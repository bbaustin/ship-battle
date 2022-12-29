<template>
  <Modal v-if="store.gameStatus === 'enemyWin' || store.gameStatus === 'playerWin'" />
  <!-- PC -->
  <ResponsiveLayout v-if="this.windowWidth >= 1020">
    <template #main>
      <section>
        <ShipPlacer
          v-if="store.gameStatus === 'placeShips'"
          @emit-ship-placer-announcement="handleEmittedAnnouncement"
          @set-player-ships="handleSetPlayerShips"
        />
        <div
          class="boards"
          v-show="store.gameStatus !== 'placeShips'"
        >
          <BoardDefense
            ref="boardDefense"
            :boardShipPlacement="this.boardShipPlacement"
            @emit-defense-announcement="handleEmittedAnnouncement"
            @emit-enemy-intel="handleEmittedEnemyIntel"
          />
          <SunkShipsDisplay />
          <BoardAttack
            :isPlayersTurn="this.isPlayersTurn"
            @emit-attack-announcement="handleEmittedAnnouncement"
            @switch-to-enemy="switchPlayers"
          />
        </div>
      </section>
      <section>
        <Announcement :announcement="this.announcement" />
      </section>
    </template>
  </ResponsiveLayout>
  <!-- MOBILE -->
  <ResponsiveLayout v-else>
    <template #main>
      <ShipPlacer
        v-if="store.gameStatus === 'placeShips'"
        @emit-ship-placer-announcement="handleEmittedAnnouncement"
        @set-player-ships="handleSetPlayerShips"
      />
      <BoardAttack
        v-else
        :isPlayersTurn="this.isPlayersTurn"
        @emit-attack-announcement="handleEmittedAnnouncement"
        @switch-to-enemy="switchPlayers"
      />
    </template>
    <template #secondary>
      <HUD v-show="store.gameStatus !== 'placeShips'">
        <template #0>
          <BoardDefense
            ref="boardDefense"
            :boardShipPlacement="this.boardShipPlacement"
            @emit-defense-announcement="handleEmittedAnnouncement"
            @emit-enemy-intel="handleEmittedEnemyIntel"
          />
        </template>
        <template #1>
          <Announcement :announcement="this.announcement" />
        </template>
        <template #2>
          <SunkShipsDisplay />
        </template>
      </HUD>
    </template>
  </ResponsiveLayout>
</template>
<script>
import { store } from './store.js';
import Announcement from './components/Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
import EnemyIntelDisplay from './components/EnemyIntelDisplay.vue';
import HUD from './components/HUD.vue';
import Modal from './components/Modal.vue';
import ResponsiveLayout from './components/ResponsiveLayout.vue';
import ShipPlacer from './components/ShipPlacer.vue';
import SunkShipsDisplay from './components/SunkShipsDisplay.vue';
export default {
  components: {
    Announcement,
    BoardDefense,
    BoardAttack,
    EnemyIntelDisplay,
    HUD,
    Modal,
    ResponsiveLayout,
    ShipPlacer,
    SunkShipsDisplay,
  },
  created() {
    this.windowWidth = window.innerWidth;
  },
  data() {
    return {
      store,
      announcement: '',
      boardShipPlacement: [], // TODO: Does this need to be data in App? Can I pass this without changing
      enemyIntel: undefined,
      isPlayersTurn: true,
      windowWidth: undefined,
    };
  },
  methods: {
    handleEmittedAnnouncement(emittedAnnouncement) {
      this.announcement = emittedAnnouncement;
    },
    handleEmittedEnemyIntel(emittedEnemyIntel) {
      this.enemyIntel = emittedEnemyIntel;
    },
    handleSetPlayerShips(boardShipPlacement) {
      this.boardShipPlacement = [...boardShipPlacement];
      store.gameStatus = 'play';
    },
    switchPlayers() {
      this.isPlayersTurn = !this.isPlayersTurn;
      if (!this.isPlayersTurn && store.gameStatus === 'play') {
        setTimeout(() => {
          // To access a child function, you can use ref. Can also do this via props, which might be better practice, but it's more convoluted): https://stackoverflow.com/questions/55316490/vue-best-practice-for-calling-a-method-in-a-child-component
          this.$refs.boardDefense.aiAttack();
          this.isPlayersTurn = !this.isPlayersTurn;
        }, 750);
      }
    },
  },
};
</script>
<style lang="scss">
@use './scss/modules/_colors' as *;
@media screen and (min-width: 1020px) {
  main {
    align-items: center;
    display: flex;
    flex-direction: column;
    min-width: 1000px;
  }
  main > section:first-child {
    min-height: 50vh;
  }
  main > section:last-child {
    border: 1px solid $green;
    max-height: 45vh;
    overflow-y: scroll;
  }
}
</style>
