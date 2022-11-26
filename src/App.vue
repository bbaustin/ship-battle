<template>
  <main>
    <h1 v-if="isPlayersTurn">Player's Turn</h1>
    <h1 v-else>Computer's Turn</h1>
    <section id="boards">
      <BoardDefense
        ref="boardDefense"
        :gameStatus="this.gameStatus"
        @emit-defense-announcement="handleEmittedAnnouncement"
      />
      <BoardAttack
        :isPlayersTurn="this.isPlayersTurn"
        @emit-attack-announcement="handleEmittedAnnouncement"
        @switch-to-enemy="switchPlayers"
      />
    </section>
    <Announcement :announcement="this.announcement" />
  </main>
</template>
<script>
import Announcement from './components/Announcement.vue';
import BoardDefense from './components/BoardDefense.vue';
import BoardAttack from './components/BoardAttack.vue';
export default {
  components: { Announcement, BoardDefense, BoardAttack },
  data() {
    return {
      announcement: '',
      gameStatus: 'play', // options are 'finish', 'placeShips', 'play'
      isPlayersTurn: true,
    };
  },
  methods: {
    handleEmittedAnnouncement(emittedAnnouncement) {
      this.announcement = emittedAnnouncement;
    },
    switchPlayers() {
      this.isPlayersTurn = !this.isPlayersTurn;
      if (this.isPlayersTurn) {
        // TODO: ? Nothing? Idk haha
      } else {
        setTimeout(() => {
          this.$refs.boardDefense.aiAttack(); // NOTE: Could also do this via props (might be better practice, but more convoluted): https://stackoverflow.com/questions/55316490/vue-best-practice-for-calling-a-method-in-a-child-component
          this.isPlayersTurn = !this.isPlayersTurn;
        }, 500);
      }
    },
  },
};
</script>
<style>
main {
  display: flex;
  flex-direction: column;
  gap: 100px;
}
#boards {
  display: flex;
  gap: 100px;
  margin-left: 5%;
}
</style>
