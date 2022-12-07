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
    <button @click.prevent="handleDirectionClick('n')">U</button>
    <button @click.prevent="handleDirectionClick('e')">R</button>
    <button @click.prevent="handleDirectionClick('w')">L</button>
    <button @click.prevent="handleDirectionClick('s')">D</button>

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
    handleDirectionClick(direction) {
      let coordinates = [...this.placement[this.activeShip].coordinates];
      let dir = HELPERS.DIR_REL[direction];
      let attemptedCoordinate = dir.addend > 0 ? dir.check(Math.max(...coordinates)) : dir.check(Math.min(...coordinates));
      // NOTE: Probably controlled by state later?
      let alignment = coordinates[0] + 1 === coordinates[1] ? 'horizontal' : 'vertical';
      if (attemptedCoordinate !== 0 && !attemptedCoordinate) return;

      if (direction === 'n' || direction === 's') {
        if (alignment === 'vertical') {
          return this.handleStraightMovement(alignment, dir, coordinates, attemptedCoordinate);
        }
        return this.handleLateralMovement(alignment, dir, coordinates, attemptedCoordinate);
      } else {
        if (alignment === 'vertical') {
          return this.handleLateralMovement(alignment, dir, coordinates, attemptedCoordinate);
        }
        return this.handleStraightMovement(alignment, dir, coordinates, attemptedCoordinate);
      }
    },

    handleStraightMovement(alignment, dir, coordinates, attemptedCoordinate) {
      // If attempted spot is occupied by another ship, return
      if (this.boardShipPlacement[attemptedCoordinate]) return;
      // Otherwise, the first spot of the ship, and add to the intended new spot
      if (dir.addend > 0) {
        this.boardShipPlacement[coordinates[0]] = '';
        this.boardShipPlacement[coordinates.at(-1) + dir.addend] = this.activeShip;
        // Remove the first element
        coordinates.shift();
        // Add (at the end) the value of the last element + addend
        coordinates.push(coordinates.at(-1) + dir.addend);
      } else {
        this.boardShipPlacement[coordinates[0] + dir.addend] = this.activeShip;
        this.boardShipPlacement[coordinates.at(-1)] = '';
        // Remove the last element
        coordinates.pop();
        // Add (at the beginning) the value of the first element + addend
        coordinates.unshift(coordinates[0] + dir.addend);
      }

      // Set actual coordinates to the updated coordinates
      this.placement[this.activeShip].coordinates = coordinates;
    },
    handleLateralMovement(alignment, dir, coordinates, attemptedCoordinate) {
      let newCoordinates = [];
      coordinates.forEach((coordinate) => {
        if (this.boardShipPlacement[coordinate + dir.addend]) return;
        newCoordinates.push(coordinate + dir.addend);
      });

      // Only continue if you could successfully access each coordinate
      if (newCoordinates.length === this.placement[this.activeShip].coordinates.length) {
        this.placement[this.activeShip].coordinates = newCoordinates;
        coordinates.forEach((coordinate) => {
          this.boardShipPlacement[coordinate] = '';
          this.boardShipPlacement[coordinate + dir.addend] = this.activeShip;
        });
      }
    },
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
