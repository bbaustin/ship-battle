<template>
  <h4>ENEMY INTEL DISPLAY</h4>
  <p>
    Last attempted enemy attack: <span class="recentShot">{{ lastAttemptedEnemyAttack }}</span>
  </p>
  <p>
    Last successful enemy attack: <span>{{ lastSuccessfulEnemyAttack }}</span>
  </p>
  <p>
    Current enemy attack pattern: <span>{{ currentEnemyAttackPattern }}</span>
  </p>
</template>
<script>
export default {
  props: ['enemyIntel'],
  computed: {
    lastAttemptedEnemyAttack() {
      return this.enemyIntel?.enemyAttacks.at(-1) || 'N/A';
    },
    lastSuccessfulEnemyAttack() {
      return this.enemyIntel?.lastSuccessfulEnemyAttack || 'N/A';
    },
    currentEnemyAttackPattern() {
      return this.enemyIntel?.enemyStrategy || 'N/A';
    },
  },
};
</script>
<style lang="scss" scoped>
@use '../scss/modules/_colors' as *;
p {
  margin: 0;
}
span.recentShot {
  color: $yellow;
}
</style>
