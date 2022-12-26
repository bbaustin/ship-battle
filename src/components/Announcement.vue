<template>
  <div id="announcement">
    <p v-if="this.scrollingAnnouncement">{{ this.scrollingAnnouncement }}</p>
    <p v-for="announcement in this.announcementArray">{{ announcement }}</p>
  </div>
</template>
<script>
import { ANNOUNCEMENTS } from '../assets/Constants.js';
export default {
  props: ['announcement'],
  data() {
    return {
      announcementArray: [ANNOUNCEMENTS.WELCOME],
      // scienceyNumberArray: [],
      scrollingAnnouncement: '',
    };
  },
  watch: {
    // TODO: There's probably some better way to do this
    announcement() {
      // Add previous announcement to list of other previous announcements
      if (this.scrollingAnnouncement !== '') this.announcementArray.unshift(this.scrollingAnnouncement);
      // Get ready for a new scrolling announcement
      this.scrollingAnnouncement = '';
      // NOTE: If you want arbitrary sci-fi-looking numbers you can use something like this
      // this.scienceyNumberArray.push(`#${this.announcementArray.length}-${Date.now().toString().slice(-4)}: `);
      // Split the incoming announcement (from props) into each character
      // this.announcement = `${scienceyNumber} ${this.announcement}`;
      let individualCharacters = this.announcement.split('');
      let current = 0;
      setInterval(() => {
        if (current < individualCharacters.length) {
          this.scrollingAnnouncement += individualCharacters[current++];
        } // TODO: Add some code here to recognize when the scrolling is finished to avoid garbled text
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
