<template>
  <el-container class="layout">
    <Aside v-if="isPc" />
    <el-container>
      <el-header>
        <Header />
      </el-header>

      <Main />
      <!-- <Footer v-if="isFooter" /> -->
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import Aside from '@/layout/components/Aside/index.vue'
  import Header from '@/layout/components/Header/index.vue'
  import Main from '@/layout/components/Main/index.vue'
  import { useDevicesSize } from '@/hooks/useDevicesSize'
  defineOptions({ name: 'LayoutDefaults' })
  const { isPc } = useDevicesSize()
</script>

<style lang="scss" scoped>
  .layout {
    height: 100vh;
    // background-color: red;
  }
  :deep(.el-header) {
    padding: 0;
  }
</style>
<style lang="scss">
  .el-header {
    // padding: 0;
    // box-sizing: border-box;
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    // height: 55px;
    // padding: 0 15px;
    // background-color: var(--el-header-bg-color);
    // border-bottom: 1px solid var(--el-header-border-color);
  }
</style>
