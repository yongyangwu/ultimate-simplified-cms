<template>
  <div>
    <component :is="layouts.layoutDefaults" />
  </div>
</template>

<script setup lang="ts">
  import { defineAsyncComponent } from 'vue'
  // import { storeToRefs } from 'pinia'

  // const themeStore = useThemeConfig()
  // const { layoutType } = storeToRefs(themeStore)

  // 引入组件-异步组件
  const layouts: any = {
    layoutDefaults: defineAsyncComponent(
      () => import('@/layout/layout-defaults/index.vue')
    ),
    // layoutHead: defineAsyncComponent(() => import("@/layout/layout-head/index.vue")),
    // layoutMixing: defineAsyncComponent(() => import("@/layout/layout-mixing/index.vue"))
  }
</script>

<style lang="scss" scoped></style>
