<template>
  <form>
    <!-- SHIP -->
    <!--NOTE: could also use regex in the value. str.replace(/\s+/g, '');-->
    <select
      v-model="this.activeShip"
      @change="handleActiveShip"
    >
      <option
        v-for="(ship, index) in ships"
        :value="ship.name"
        key="i"
      >
        {{ ship.name }} ({{ ship.size }})
      </option>
    </select>

    <!-- ORIENTATION/ALIGNMENT -->
    <select
      v-model="this.alignment"
      @change="handleAlignment"
    >
      <!-- NOTE: I guess value isn't needed with v-model? -->
      <option>horizontal</option>
      <option>vertical</option>
    </select>
    <button @click.prevent="handleUp">U</button>
    <button @click.prevent="handleRight">R</button>
    <button @click.prevent="handleLeft">L</button>
    <button @click.prevent="handleDown">D</button>

    <button @click.prevent="confirmPosition">Confirm Ship Positions</button>
  </form>

  <h1 v-if="this.placement[this.activeShip]">{{ this.placement[this.activeShip].coordinates }}</h1>

  <section id="placement">
    <h1>choose your ship placement</h1>
    <div class="board">
      <div
        v-for="(cell, index) in this.boardShipPlacement"
        class="cell"
        :class="this.getTileClass(cell)"
      >
        {{ index }}
      </div>
    </div>
  </section>
</template>
<script>
import * as HELPERS from '../assets/Helpers.js';
import { BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
export default {
  created() {
    // randomize placement of your ships
    HELPERS.placeShips(this.ships, this.boardShipPlacement);
    // Add each ship to your state (this could be hardcoded, but in case you ever want to change up number/size of ships, it's easier now)
    this.ships.forEach((ship) => {
      // Need key name in square brackets --> https://stackoverflow.com/a/2462810
      this.placement = { ...this.placement, [ship.name]: { coordinates: [] } };
    });
    // Add coordinates to each ship added above
    this.boardShipPlacement.forEach((tile, index) => {
      if (tile) {
        this.placement[tile].coordinates.push(index);
      }
    });
  },
  data() {
    return {
      // store,
      activeShip: '',
      alignment: '',
      boardShipPlacement: [...BLANK_BOARD], //TODO: Arguably, you sort of don't need this, in the same way that you're only relying on "board" in other components. But it's OK to have, I guess.
      placement: {},
      ships: [...SHIP_SPECS],
    };
  },
  methods: {
    handleAlignment() {},
    // NOTE: This would be slightly easier if you could grab the alignment from HELPERS.placeShips. It might be worth having it return that..?
    handleDown() {
      let coordinates = [...this.placement[this.activeShip].coordinates];
      let attemptedSouthCoordinate = HELPERS.checkS(Math.max(...coordinates));
      // NOTE: Probably controlled by state later?
      let alignment = coordinates[0] + 1 === coordinates[1] ? 'horizontal' : 'vertical';
      if (!attemptedSouthCoordinate) return;

      ////////////////////
      // VERTICAL ///////
      ///////////////////
      if (alignment === 'vertical') {
        // If attempted spot is occupied by another ship, return
        if (this.boardShipPlacement[attemptedSouthCoordinate]) return;

        // Otherwise, the first spot of the ship, and add to the intended new spot
        this.boardShipPlacement[coordinates[0]] = '';
        this.boardShipPlacement[coordinates.at(-1) + 10] = this.activeShip;

        // Update temp coordinates accordingly
        coordinates.shift();
        coordinates.push(coordinates.at(-1) + 10);

        // Set actual coordinates to the updated coordinates
        this.placement[this.activeShip].coordinates = coordinates;
      }

      ///////////////////
      // HORIZONTAL /////
      //////////////////
      if (alignment === 'horizontal') {
        let newCoordinates = [];
        coordinates.forEach((coordinate) => {
          if (this.boardShipPlacement[coordinate + 10]) return;
          newCoordinates.push(coordinate + 10);
        });

        // Only continue if you could successfully access each coordinate
        if (newCoordinates.length === this.placement[this.activeShip].coordinates.length) {
          this.placement[this.activeShip].coordinates = newCoordinates;
          coordinates.forEach((coordinate) => {
            this.boardShipPlacement[coordinate] = '';
            this.boardShipPlacement[coordinate + 10] = this.activeShip;
          });
        }
      }
    },

    handleLeft() {
      let coordinates = [...this.placement[this.activeShip].coordinates];
      let attemptedWestCoordinate = HELPERS.checkW(Math.min(...coordinates));
      if (attemptedWestCoordinate && !this.boardShipPlacement[attemptedWestCoordinate]) {
        coordinates.forEach((coordinate) => {
          this.boardShipPlacement[coordinate] = '';
          this.boardShipPlacement[coordinate - 1] = this.activeShip;
        });
        let newCoordinates = [];
        this.placement[this.activeShip].coordinates.forEach((coordinate) => {
          newCoordinates.push(coordinate - 1);
        });
        this.placement[this.activeShip].coordinates = newCoordinates;
      }
    },
    handleRight() {},
    handleUp() {},
    confirmPosition() {
      // emit boardShipPlacement (to boardDefense)
    },
    getTileClass(tileContent) {
      if (this.activeShip && tileContent === this.activeShip) return 'selected';
      if (tileContent) return 'boat';
      return '';
    },
  },
};
</script>
<style scoped>
.selected {
  background: orange;
}
</style>
