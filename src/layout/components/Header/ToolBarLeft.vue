<template>
  <div class="tool-bar-lf">
    <CollapseIcon id="collapseIcon" />
  </div>
</template>

<script setup lang="ts">
  import CollapseIcon from './components/CollapseIcon.vue'
</script>

<style scoped lang="scss">
  .tool-bar-lf {
    margin-left: 12px;
    display: flex;
    height: 100%;
    align-items: center;
  }
</style>
