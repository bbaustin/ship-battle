<template>
  <section>
    <h4>SUNK SHIPS</h4>
    <div
      v-for="ship in ships"
      class="ship-row"
    >
      <div
        v-if="store.sunkShips.enemy.includes(ship.name)"
        class="sunk"
      ></div>
      <div
        v-else
        class="sunk-not"
      ></div>
      <div class="middle-column">
        <p>{{ ship.name }}</p>
        <div class="cell-display">
          <div
            v-for="unit in ship.size"
            class="cell mini"
          ></div>
        </div>
        <!-- <small>{{ ship.size }}</small> -->
      </div>
      <div
        v-if="store.sunkShips.player.includes(ship.name)"
        class="sunk"
      ></div>
      <div
        v-else
        class="sunk-not"
      ></div>
    </div>
  </section>
</template>
<script>
import { SHIP_SPECS } from '../assets/Constants.js';
import { store } from '../store.js';
export default {
  data() {
    return {
      store,
      ships: [...SHIP_SPECS], //TODO: Doesn't work unless I do this. Don't quite understand
    };
  },
};
</script>
<style lang="scss" scoped>
@use '../scss/modules/_colors' as *;
section {
  display: flex;
  flex-direction: column;
}
h4 {
  border-bottom: 1px solid $green;
  margin: 0;
  padding: 18px 0;
  text-align: center;
}
div.ship-row:first-child {
  border-top: 1px solid $green;
}
.ship-row {
  align-items: center;
  border: 1px solid $green;
  border-top: none;
  display: flex;
  justify-content: space-between;
  width: 120px;
  padding: 10px;
}
.ship-row:first-child {
  border-top: 1px solid $green; //TODOO: Make work
}
.sunk {
  background: $tng_green;
  border-radius: 100%;
  height: 8px;
  width: 8px;
}
.sunk-not {
  border: 1px solid $green;
  border-radius: 100%;
  height: 5px;
  width: 5px;
}
.middle-column {
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.middle-column p {
  margin: 0 0 5px 0;
}
.cell-display {
  border-top: 1px solid $green;
  border-left: 1px solid $green;
  display: flex;
  width: fit-content;
}
.cell.mini {
  height: 12.5px;
  width: 12.5px;
}
</style>
