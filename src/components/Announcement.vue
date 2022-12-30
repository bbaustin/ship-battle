<template>
  <section id="announcement">
    <h4>ANNOUNCEMENTS</h4>
    <template v-for="announcement in this.announcementArray">
      <small>Transmission {{ announcementArray.length - announcementArray.indexOf(announcement) }}:</small>
      <p>{{ announcement }}</p>
    </template>
  </section>
</template>
<script>
import { ANNOUNCEMENTS } from '../assets/Constants.js';
export default {
  props: ['announcement'],
  data() {
    return {
      announcementArray: [ANNOUNCEMENTS.WELCOME],
    };
  },
  watch: {
    announcement() {
      this.announcementArray.unshift(this.announcement);
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../scss/modules/_colors' as *;
h4 {
  margin-bottom: 14px;
}
#announcement {
  font-size: 13px;
  padding: 0px 20px;
  width: 770px;
}
#announcement p:first-of-type,
#announcement small:first-of-type {
  color: $tng_green;
}
#announcement p {
  margin-top: 0;
  padding-bottom: 7px;
}

@media screen and (min-width: 1020px) {
  h4 {
    display: none;
  }
}
</style>
