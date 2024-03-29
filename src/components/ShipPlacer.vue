<template>
  <div class="boards">
    <section id="placement">
      <h4>PLACE YOUR SHIPS</h4>
      <div class="board">
        <div
          v-for="(cell, index) in this.boardShipPlacement"
          class="cell"
          :class="[this.getTileClass(cell), this.toggled ? 'toggled' : '']"
        >
          <span v-if="this.toggled">{{ index }}</span>
        </div>
      </div>
      <ToggleCoordinatesButton @toggle-coordinates="() => (this.toggled = !this.toggled)" />
    </section>
    <form>
      <div>
        <div class="ship-buttons">
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
          <button
            type="button"
            @click="handleAlignmentChange"
          >
            <span :class="this.alignment === 'horizontal' ? 'active' : ''">horizontal</span> /
            <span :class="this.alignment === 'vertical' ? 'active' : ''">vertical</span>
          </button>
        </div>
        <div class="movement-buttons">
          <div>
            <button
              class="direction-button"
              @click.prevent="handleMovement('n')"
            >
              U
            </button>
          </div>
          <button
            class="direction-button"
            @click.prevent="handleMovement('w')"
          >
            L
          </button>
          <button
            class="direction-button"
            @click.prevent="handleMovement('e')"
          >
            R
          </button>
          <div>
            <button
              class="direction-button"
              @click.prevent="handleMovement('s')"
            >
              D
            </button>
          </div>
        </div>
      </div>
      <button
        class="special"
        @click.prevent="confirmPosition"
      >
        Confirm Ship Positions
      </button>
    </form>
  </div>
</template>
<script>
import * as HELPERS from '../assets/Helpers.js';
import { BLANK_BOARD, SHIP_SPECS } from '../assets/Constants.js';
import ToggleCoordinatesButton from './ToggleCoordinatesButton.vue';
export default {
  components: { ToggleCoordinatesButton },
  emits: ['set-player-ships', 'emit-ship-placer-announcement', 'toggle-coordinates'],
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
    // Compute the alignment of the just-placed activeShip
    this.alignment = this.getAlignment();
  },
  data() {
    return {
      activeShip: SHIP_SPECS[0].name,
      alignment: '',
      boardShipPlacement: [...BLANK_BOARD], //TODO: Arguably, you sort of don't need this, in the same way that you're only relying on "board" in other components. But it's OK to have, I guess.
      placement: {},
      ships: [...SHIP_SPECS],
      toggled: true,
    };
  },
  methods: {
    // TODO: Maybe you want this, but idk
    getAlignment() {
      let coordinates = [...this.placement[this.activeShip].coordinates];
      return coordinates[0] + 1 === coordinates[1] ? 'horizontal' : 'vertical';
    },
    handleActiveShip() {
      this.alignment = this.getAlignment();
    },
    handleAlignmentChange() {
      this.alignment === 'horizontal' ? (this.alignment = 'vertical') : (this.alignment = 'horizontal');
      let coordinates = [...this.placement[this.activeShip].coordinates];
      let alignment = coordinates[0] + 1 === coordinates[1] ? 'horizontal' : 'vertical';
      // If we're horizontal, we'll be turning vertical (hence addend is +-10.)
      let addend = alignment === 'horizontal' ? 10 : 1;
      // console.log(`addend: ${addend}`);
      let shipLength = this.placement[this.activeShip].coordinates.length;

      let didRotate = false;
      // This will loop through each coordinate (duh)
      // If we have a submarine on 63, 64, 65, 66 it will simply loop through those coordinates.
      for (let i = 0; i < coordinates.length; i++) {
        let availableCoordinates = [];
        // If it rotated, we don't want to run this anymore.
        if (!didRotate) {
          for (let mod = shipLength * -addend; mod < shipLength * addend; mod += addend) {
            let attemptedCoordinate = coordinates[i] + mod;
            // console.table({ coordinate: coordinates[i], mod: mod, attemptedCoordinate: attemptedCoordinate, shipLength: shipLength, addend: addend });
            if (attemptedCoordinate > 99 || attemptedCoordinate < 0) {
              // console.log(`${attemptedCoordinate} is an illegal value!`);
            }

            // Check if the tile is occupied by a ship (other than your own, because you'll cross your own pivot point)
            else if (this.boardShipPlacement[attemptedCoordinate] && this.boardShipPlacement[attemptedCoordinate] !== this.activeShip) {
              availableCoordinates = [];
            } else {
              availableCoordinates.push(attemptedCoordinate);
              // console.log(`just pushed to availableCoordnates for ${this.activeShip}`);
              // console.log(availableCoordinates);
            }

            let checksPassed;
            // Check if we should run the next tile, or if it's OOB
            if (coordinates[i] === attemptedCoordinate) checksPassed = true;
            if (addend === 1 && coordinates[i] > attemptedCoordinate) checksPassed = !!HELPERS.checkW(coordinates[i]);
            if (addend === 1 && coordinates[i] < attemptedCoordinate) checksPassed = !!HELPERS.checkE(coordinates[i]);
            if (addend === 10 && coordinates[i] > attemptedCoordinate) checksPassed = !!HELPERS.checkN(coordinates[i]);
            if (addend === 10 && coordinates[i] < attemptedCoordinate) checksPassed = !!HELPERS.checkS(coordinates[i]);
            // console.table({
            //   coordinate: coordinates[i],
            //   mod: mod,
            //   attemptedCoordinate: attemptedCoordinate,
            //   checksPassed: checksPassed,
            //   shipLength: shipLength,
            //   addend: addend,
            // });
            if (!checksPassed) {
              // console.log('checks did not pass');
              availableCoordinates = [];
            }
            if (availableCoordinates.length === shipLength) {
              // console.log(`We have a match of length ${shipLength}`);
              if (!this.areHorizontalTilesInSameRow(availableCoordinates)) {
                console.log('not all in same row');
                this.alignment = 'vertical';
                return false;
              }
              this.updateShipAlignment(availableCoordinates, coordinates, addend);
              didRotate = true;
              return availableCoordinates;
            }
          }
        }
      }
      // if you've made it this far, you've failed, so revert the alignment, as it could not rotate.
      return this.alignment === 'horizontal' ? (this.alignment = 'vertical') : (this.alignment = 'horizontal');
    },
    areHorizontalTilesInSameRow(availableCoordinates) {
      if (this.alignment === 'vertical') return true;
      // if (this.alignment === 'vertical') return;
      let stringCoordinates = availableCoordinates.map((coordinate) => coordinate.toString());
      console.log(stringCoordinates);
      let singleDigitCounter,
        firstDigitCounter = 0;
      let firstDigit = stringCoordinates[0]?.slice(0, 1);
      console.log(`firstDigit: ${firstDigit}`);
      stringCoordinates.forEach((coordinate) => {
        if (coordinate.length === 1) singleDigitCounter++;
        if (coordinate.slice(0, 1) === firstDigit) firstDigitCounter++;
      });
      console.log(singleDigitCounter, firstDigitCounter, availableCoordinates.length);
      if (singleDigitCounter === availableCoordinates.length) return true;
      if (firstDigitCounter === availableCoordinates.length) return true;
      return false;
    },
    handleMovement(direction) {
      let coordinates = [...this.placement[this.activeShip].coordinates];
      let dir = HELPERS.DIR_REL[direction];
      let attemptedCoordinate = dir.addend > 0 ? dir.check(Math.max(...coordinates)) : dir.check(Math.min(...coordinates));
      if (attemptedCoordinate !== 0 && !attemptedCoordinate) return;
      if (direction === 'n' || direction === 's') {
        if (this.alignment === 'vertical') {
          return this.handleStraightMovement(dir, coordinates, attemptedCoordinate);
        }
        return this.handleLateralMovement(dir, coordinates, attemptedCoordinate);
      } else {
        if (this.alignment === 'vertical') {
          return this.handleLateralMovement(dir, coordinates, attemptedCoordinate);
        }
        return this.handleStraightMovement(dir, coordinates, attemptedCoordinate);
      }
    },
    handleStraightMovement(dir, coordinates, attemptedCoordinate) {
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
    handleLateralMovement(dir, coordinates, attemptedCoordinate) {
      let newCoordinates = [];
      coordinates.forEach((coordinate) => {
        if (this.boardShipPlacement[coordinate + dir.addend]) return;
        newCoordinates.push(coordinate + dir.addend);
      });
      // Only continue if you could successfully access each coordinate
      if (newCoordinates.length === this.placement[this.activeShip].coordinates.length) {
        this.updateShipPositionLateral(newCoordinates, coordinates, dir.addend);
      }
    },
    updateShipPositionLateral(arrayOfCoordinates, existingCoordinates, addend) {
      this.placement[this.activeShip].coordinates = arrayOfCoordinates;
      existingCoordinates.forEach((coordinate) => {
        this.boardShipPlacement[coordinate] = '';
        this.boardShipPlacement[coordinate + addend] = this.activeShip;
      });
    },
    updateShipAlignment(arrayOfCoordinates, existingCoordinates, addend) {
      this.placement[this.activeShip].coordinates = arrayOfCoordinates;
      existingCoordinates.forEach((coordinate) => {
        this.boardShipPlacement[coordinate] = '';
      });
      arrayOfCoordinates.forEach((coordinate) => {
        this.boardShipPlacement[coordinate] = this.activeShip;
      });
    },
    confirmPosition() {
      // TODO: This should prboably pop up a confirmation modal, and THEN that modal would do the following. But it's ok for now
      this.$emit('set-player-ships', this.boardShipPlacement);
      this.$emit('emit-ship-placer-announcement', 'Ships placement confirmed. Make your first attack!');
    },
    getTileClass(tileContent) {
      if (this.activeShip && tileContent === this.activeShip) return 'selected';
      if (tileContent) return 'boat';
      return '';
    },
    handleCoordinatesToggle() {
      return (this.toggled = !this.toggled);
    },
  },
};
</script>
<style scoped lang="scss">
@use '../scss/modules/_colors' as *;
form {
  align-items: center;
  align-self: center;
  border: 1px solid $green;
  display: flex;
  flex-direction: column;
  height: fit-content;
  padding: 10px;
}
form > div:first-child {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
  margin-bottom: 5px;
}
form div.ship-buttons {
  display: flex;
  flex-direction: column;
}
.selected {
  background-image: radial-gradient($orange 0.5px, #242424 0);
  background-size: 2px 2px;
  color: $grey;
}
.selected.toggled {
  background: $dim_orange;
  color: $grey;
}
.movement-buttons {
  margin-bottom: 10px;
  width: fit-content;
}
.movement-buttons div {
  text-align: center;
}
.direction-button {
  padding: 6px 10px;
  margin: 5px;
}
.submit {
  color: $grey;
  background: $green;
}
</style>
