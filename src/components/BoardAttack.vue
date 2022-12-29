<template>
  <section id="attack">
    <h4>ENEMY SHIPS [ATTACK]</h4>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardAttack"
        class="cell"
        :class="[this.boardAttack[index], this.toggled ? 'toggled' : '', store.sunkShips.player.includes(this.boardAttack[index].slice(0, -4)) ? 'sunk' : '']"
        @click="[this.handleTileAttackClick(index), $emit('emit-attack-announcement', this.attackAnnouncement)]"
      >
        <span v-if="this.toggled">{{ index }}</span>
      </div>
    </div>
    <ToggleCoordinatesButton @toggle-coordinates="() => (this.toggled = !this.toggled)" />
  </section>
</template>
<script>
import { ANNOUNCEMENTS, BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import * as HELPERS from '../assets/Helpers.js';
import { store } from '../store.js';
import ToggleCoordinatesButton from './ToggleCoordinatesButton.vue';
export default {
  components: { ToggleCoordinatesButton },
  emits: ['emit-attack-announcement', 'switch-to-enemy', 'toggle-coordinates'],
  props: ['isPlayersTurn'],
  data() {
    return {
      store,
      attackAnnouncement: 'test',
      boardAttack: [...BLANK_BOARD],
      toggled: false,
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
  },
  created() {
    HELPERS.placeShips(SHIP_SPECS, this.boardAttack);
  },
};
</script>
<style scoped lang="scss">
@use '../scss/modules/_colors' as *;
.cell {
  cursor: crosshair;
}
.cell:hover {
  filter: brightness(85%);
  background-image: radial-gradient($yellow 0.5px, #242424 0);
  background-size: 2px 2px;
}
.cell.toggled:hover {
  background: $yellow;
  color: $grey;
}
</style>
