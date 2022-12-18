<template>
  <section id="attack">
    <h1>attack!</h1>
    <button @click.prevent="this.handleCoordinatesToggle">toggle coordinates</button>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardAttack"
        class="cell"
        :class="this.boardAttack[index]"
        @click="[this.handleTileAttackClick(index), $emit('emit-attack-announcement', this.attackAnnouncement)]"
      >
        <span v-if="this.canSeeCoordinates">{{ index }}</span>
      </div>
    </div>
  </section>
</template>
<script>
import { ANNOUNCEMENTS, BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
import { store } from '../store.js';
export default {
  emits: ['emit-attack-announcement', 'switch-to-enemy'],
  props: ['isPlayersTurn'],
  data() {
    return {
      store,
      attackAnnouncement: 'test',
      boardAttack: [...BLANK_BOARD],
      canSeeCoordinates: false,
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      // return so that your click doesn't do anything.
      if (!this.isPlayersTurn || store.gameStatus === 'pending') {
        // TODO: Mashing will create garbled text. Kind of feels like a pain to troubleshoot this ha
        // this.attackAnnouncement = HELPERS.randomizeAnnouncement('NOT_PLAYERS_TURN');
        return;
      }
      // don't let player click an already-clicked tile
      if (this.boardAttack[tileIndex] === 'miss' || this.boardAttack[tileIndex].includes(' hit')) {
        // TODO: If you mash, this will create garbled text. I would have thought the return above would stop this.
        this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'SAME_TILE_CLICKED', '');
        return;
      }
      if (this.boardAttack[tileIndex]) {
        this.boardAttack[tileIndex] += ' hit';
        // didSink() will return the ship name (string) if it sunk. Otherwise it returns false.
        let sunkShip = HELPERS.didSink(this.boardAttack, this.boardAttack[tileIndex]);
        if (sunkShip) {
          store.sunkShips.player.push(sunkShip);
          if (HELPERS.didWin(this.isPlayersTurn)) return;
          this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_SINK_SHIP', sunkShip);
        } else {
          this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_HIT', this.boardAttack[tileIndex].slice(0, -4));
        }
      } else {
        this.boardAttack[tileIndex] = 'miss';
        this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_MISS', '');
      }
      this.$emit('switch-to-enemy');
    },
    handleCoordinatesToggle() {
      return (this.canSeeCoordinates = !this.canSeeCoordinates);
    },
  },
  created() {
    HELPERS.placeShips(SHIP_SPECS, this.boardAttack);
  },
};
</script>
<style scoped>
.cell {
  cursor: pointer;
}
.cell:hover {
  filter: brightness(85%);
  background-image: radial-gradient(yellow 0.5px, transparent 0);
  background-size: 2px 2px;
}
</style>
