<template>
  <el-aside>
    <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div
        class="logo flx-center"
        style="height: 55px; font-size: 12px; background-color: aliceblue"
      >
        当前系统的名称和logo
        <!-- <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" /> -->
        <!-- <span v-show="!isCollapse" class="logo-text">{{ 'CMS' }}</span> -->
      </div>
      <el-scrollbar class="scroll-container">
        <!-- 这个位置可以根据项目需要替换成自定义下拉菜单，当前采用的是element plus的菜单 -->
        <Menu />
      </el-scrollbar>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import Menu from './menu/index.vue'
  import { useGlobalStore } from '@/store/modules/global'
  const globalStore = useGlobalStore()
  const isCollapse = computed(() => globalStore.isCollapse)
</script>

<style lang="scss" scoped>
  .aside-box {
    transition: width 0.3s ease;
  }
  .el-aside {
    height: 100vh;
    width: auto;
    border-right: 1px solid rgb(227, 225, 225);
  }
  .scroll-container {
    height: calc(100vh - 55px);
  }
</style>
