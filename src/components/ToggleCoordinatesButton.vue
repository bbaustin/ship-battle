<template>
  <button @click="$emit('toggleCoordinates')">Toggle Coordinates</button>
</template>
<style scoped>
button {
  border-top: none;
  display: inherit;
  font-size: 10px;
  margin: 0 auto 30px;
}
@media screen and (min-width: 1020px) {
  button {
    margin: 0 0 0 -1px; /* -1px is due to outline/border difference  */
  }
}
</style>
