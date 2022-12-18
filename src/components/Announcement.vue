<template>
  <div id="announcement">
    <!-- <p>{{ Date.now() }}</p> -->
    <p>{{ this.scrollingAnnouncement }}</p>
    <p v-for="announcement in this.announcementArray">{{ announcement }}</p>
  </div>
</template>
<script>
export default {
  props: ['announcement'],
  data() {
    return {
      announcementArray: ['Welcome to Ship Battle. Please place your ships.'],
      scrollingAnnouncement: '',
    };
  },
  watch: {
    // TODO: There's probably some better way to do this
    announcement() {
      // Add previous announcement to list of other previous announcements
      this.announcementArray.unshift(this.scrollingAnnouncement);
      // Get ready for a new scrolling announcement
      this.scrollingAnnouncement = '';
      // Split the incoming announcement (from props) into each character
      let annArr = this.announcement.split('');
      let current = 0;
      setInterval(() => {
        if (current < annArr.length) {
          this.scrollingAnnouncement += annArr[current++];
        } // TODO: Add some code here to recognize when the scrolling is finished to avoid garbled text
      }, 10);
      clearInterval();
    },
  },
};
</script>
<style lang="scss">
@import '../scss/modules/colors.scss';
#announcement {
  border: 1px solid $green;
  font-size: 16px;
  min-height: 50px;
  padding: 0px 20px;
}
#announcement p:first-child {
  color: $tng_green;
}
</style>
