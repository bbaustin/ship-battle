<template>
  <Modal
    v-if="store.gameStatus === 'enemyWin' || store.gameStatus === 'playerWin'"
    @handle-game-reset="handleGameReset"
  />
  <!-- PC -->
  <ResponsiveLayout v-if="this.windowWidth >= 1020">
    <template #main>
      <h1>Ship Battle</h1>
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
            :gameResetCode="this.gameResetCode"
            @emit-defense-announcement="handleEmittedAnnouncement"
          />
          <SunkShipsDisplay />
          <BoardAttack
            :gameResetCode="this.gameResetCode"
            :isPlayersTurn="this.isPlayersTurn"
            @emit-attack-announcement="handleEmittedAnnouncement"
            @switch-to-enemy="switchPlayers"
          />
        </div>
      </section>
      <section>
        <Announcement
          :announcement="this.announcement"
          :gameResetCode="this.gameResetCode"
        />
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
        :gameResetCode="this.gameResetCode"
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
            :gameResetCode="this.gameResetCode"
            @emit-defense-announcement="handleEmittedAnnouncement"
          />
        </template>
        <template #1>
          <Announcement
            :announcement="this.announcement"
            :gameResetCode="this.gameResetCode"
          />
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
import { ANNOUNCEMENTS } from './assets/Constants.js';
import Announcement from './components/Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
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
      announcement: '', // NOTE: Everything seems to work without this. Investigate how
      boardShipPlacement: [], // TODO: Does this need to be data in App? Can I pass this without changing
      gameResetCode: 0,
      isPlayersTurn: true,
      windowWidth: undefined,
    };
  },
  methods: {
    handleEmittedAnnouncement(emittedAnnouncement) {
      this.announcement = emittedAnnouncement;
    },
    handleSetPlayerShips(boardShipPlacement) {
      this.boardShipPlacement = [...boardShipPlacement];
      store.gameStatus = 'play';
    },
    handleGameReset() {
      this.announcement = store.gameStatus === 'playerWin' ? ANNOUNCEMENTS.NEW_GAME_PLAYER_WON : ANNOUNCEMENTS.NEW_GAME_ENEMY_WON;
      store.gameStatus = 'placeShips';
      store.sunkShips = {
        player: [],
        enemy: [],
      };
      this.isPlayersTurn = true;
      this.gameResetCode++;
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
main {
  margin-top: 10px;
}
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
    height: 35vh;
    overflow-y: scroll;
  }
}
</style>
