<template>
  <form>
    <!-- SHIP -->
    <!--NOTE: could also use regex in the value. str.replace(/\s+/g, '');-->
    <select v-model="this.activeShip">
      <option
        disabled
        selected
      >
        -- Choose a ship --
      </option>
      <option
        v-for="(ship, index) in ships"
        :value="ship.name"
        key="i"
      >
        {{ ship.name }} ({{ ship.size }})
      </option>
    </select>

    <!-- ORIENTATION/ALIGNMENT -->
    <select v-model="this.alignment">
      <option
        disabled
        selected
      >
        -- Choose an orientation --
      </option>
      <!-- NOTE: I guess value isn't needed with v-model? -->
      <option>horizontal</option>
      <option>vertical</option>
    </select>

    <!-- ROW -->
    <select>
      <option
        disabled
        selected
      >
        -- Choose a starting row --
      </option>
      <template v-if="this.alignment === 'vertical'">
        <option v-for="n in 10">{{ n }}</option>
      </template>
      <template v-else>
        <option>TODO</option>
      </template>
    </select>

    <!-- COLUMN -->
    <select>
      <option
        disabled
        selected
      >
        -- Choose a starting column --
      </option>
      <template v-if="this.alignment === 'horizontal'">
        <option v-for="n in 10">{{ n }}</option>
      </template>
      <template v-else>
        <option>TODO</option>
      </template>
    </select>
  </form>
</template>
<script>
import { SHIP_SPECS } from '../assets/Constants.js';
export default {
  data() {
    return {
      activeShip: '',
      alignment: '',
      placement: {
        // TODO: Add this data dynamically :)
        // Well, and on page load due to initial randomization
        // But it's nice not to hardcode it, in case you ever want to add additional ships, etc.
        // Randomize in beginning
        // Move randomizeAlignment and randomizePlacement into helpers???? [Arguably big task]
        AircraftCarrier: {
          startCoordinate: 56, // or [56, 66, 76]
        },
        Battleship: {
          startCoordinate: 3,
        },
        Destroyer: {
          startCoordinate: 5,
        },
        Submarine: {
          startCoordinate: 56, // or [56, 66, 76]
        },
        Tanker: {
          startCoordinate: 88,
        },
      },
      ships: [...SHIP_SPECS], // NOTE: Getting error if I try to use this directly. Why?
    };
  },
  methods: {
    // TODO: Don't need this!!
    shortenShipName(shipName) {
      return shipName.slice(0, -4).split(' ').join('');
    },
  },
};
</script>
<style></style>
