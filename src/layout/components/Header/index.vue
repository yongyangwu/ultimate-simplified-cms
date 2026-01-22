<template>
  <div class="header">
    <ToolBarLeft />
    <ToolBarRight />
  </div>
</template>
<script setup lang="ts">
  import ToolBarLeft from './ToolBarLeft.vue'
  import ToolBarRight from './ToolBarRight.vue'
</script>
<style scoped lang="scss">
  .header {
    box-sizing: border-box;

    height: 55px;
    width: 100%;
    background-color: #f5f7fa;
  }
</style>
