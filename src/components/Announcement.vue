<template>
  <section id="announcements">
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
#announcements {
  font-size: 13px;
  padding: 8px 20px 0px;
  width: 770px;
}
#announcements p:first-of-type,
#announcements small:first-of-type {
  color: $tng_green;
}
#announcements p {
  margin-top: 0;
  padding-bottom: 7px;
}

@media screen and (min-width: 1020px) {
  #announcements {
    padding-top: 15px;
  }
}
</style>
