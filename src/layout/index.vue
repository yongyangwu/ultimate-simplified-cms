<template>
  <div>
    <component :is="layouts.layoutDefaults" />
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  // 引入组件-异步组件
  const layouts: any = {
    layoutDefaults: defineAsyncComponent(
      () => import('@/layout/layout-defaults/index.vue')
    ),
  }
</script>

<style lang="scss" scoped></style>
