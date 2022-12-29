<template>
  <button @click="$emit('toggleCoordinates')">Toggle Coordinates</button>
</template>
<style scoped>
button {
  display: inherit;
  font-size: 10px;
  margin: 1px auto 30px; /* TODO: Why is this one pixel needed..? */
}
@media screen and (min-width: 1020px) {
  button {
    margin: 1px 0 0 0;
  }
}
</style>
