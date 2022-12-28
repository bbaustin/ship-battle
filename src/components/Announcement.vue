<template>
  <section id="announcement">
    <p v-if="this.scrollingAnnouncement">{{ this.scrollingAnnouncement }}</p>
    <p v-for="announcement in this.announcementArray">{{ announcement }}</p>
  </section>
</template>
<script>
import { ANNOUNCEMENTS } from '../assets/Constants.js';
export default {
  props: ['announcement'],
  data() {
    return {
      announcementArray: [ANNOUNCEMENTS.WELCOME],
      isScrolling: false,
      scrollingAnnouncement: '',
    };
  },
  watch: {
    announcement() {
      // TODO: STILL DOESN'T WORK!!
      // TODO: This could be improved to let multiple messages show
      if (this.isScrolling) return;
      // Add previous announcement to list of other previous announcements, ignoring the initial load
      if (this.scrollingAnnouncement !== '') this.announcementArray.unshift(this.scrollingAnnouncement);
      // Get ready for a new scrolling announcement
      this.scrollingAnnouncement = '';
      // Split the incoming announcement (from props) into each character
      let individualCharacters = this.announcement.split('');
      let index = 0;
      setInterval(() => {
        if (index < individualCharacters.length) {
          this.isScrolling = true;
          this.scrollingAnnouncement += individualCharacters[index++];
        } // TODO: Add some code here to recognize when the scrolling is finished to avoid garbled text
        else {
          this.isScrolling = false;
        }
      }, 10);
      clearInterval();
    },
  },
};
</script>
<style lang="scss">
@use '../scss/modules/_colors' as *;
#announcement {
  font-size: 13px;
  padding: 0px 20px;
  width: 770px;
}
#announcement p:first-child {
  color: $tng_green;
}
#announcement p {
  padding: 10px 0;
}
</style>
