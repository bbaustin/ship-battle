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
    <p>
      DESTROYED ENEMY SHIPS:<span v-if="this.sunkShips.length">{{ this.sunkShips }}</span
      ><span v-else> n/a</span>
    </p>
  </section>
</template>
<script>
import { ANNOUNCEMENTS, BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
export default {
  emits: ['emit-attack-announcement', 'emit-game-status-change', 'switch-to-enemy'],
  props: ['isPlayersTurn'],
  data() {
    return {
      attackAnnouncement: 'test',
      boardAttack: [...BLANK_BOARD],
      canSeeCoordinates: false,
      sunkShips: [],
    };
  },
  methods: {
    handleTileAttackClick(tileIndex) {
      // return so that your click doesn't do anything.
      if (!this.isPlayersTurn) {
        // TODO: Mashing will create garbled text. Kind of feels like a pain to troubleshoot this ha
        // this.attackAnnouncement = HELPERS.randomizeAnnouncement('NOT_PLAYERS_TURN');
        return;
      }
      // don't let player click an already-clicked tile
      if (this.boardAttack[tileIndex] === 'miss' || this.boardAttack[tileIndex].includes(' hit')) {
        this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'SAME_TILE_CLICKED', '');
        return;
      }
      if (this.boardAttack[tileIndex]) {
        this.boardAttack[tileIndex] += ' hit';
        if (this.didWin()) return;
        this.didSink(tileIndex);
        this.$emit('switch-to-enemy');
      } else {
        this.boardAttack[tileIndex] = 'miss';
        this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_MISS', '');
        this.$emit('switch-to-enemy');
      }
    },
    didWin() {
      // NOTE: This is assuming that you'll always use the all the ships in SHIP_SPECS once.
      // This might not be the case if you ever change up game modes, etc.
      if (this.sunkShips.length === SHIP_SPECS.length) {
        setTimeout(() => {
          this.$emit('emit-game-status-change', 'playerWin');
        }, 750);
      }
    },
    didSink(tileIndex) {
      //TODO: Do you want to move this in HELPERS? By adding board in the passed thing
      let shipName = this.boardAttack[tileIndex].slice(0, -4); // Removing ' hit'
      let shipSize;
      // Get the ship's size
      SHIP_SPECS.forEach((ship) => {
        if (ship.name === shipName) shipSize = ship.size; // TODO: This seems not great. Can't you access by ship name, instead of looping?
      });
      let shipHitCount = 0;
      //TODO: Could do better logic here; you don't need to loop through the entire array...
      // Kind of difficult, but you actually want to mimic attacking?
      this.boardAttack.forEach((tile) => {
        if (tile === `${shipName} hit`) shipHitCount++;
      });
      if (shipHitCount === shipSize) {
        this.sunkShips.push(shipName);
        if (this.didWin()) return;
        this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_SINK_SHIP', shipName);
        return;
      }
      this.attackAnnouncement = HELPERS.generateAnnouncement(true, tileIndex, 'PLAYER_HIT', shipName);
      return;
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
