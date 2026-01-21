<template>
  <el-aside>
    <div class="aside-box" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo flx-center">
        <!-- <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" /> -->
        <!-- <span v-show="!isCollapse" class="logo-text">{{ title }}</span> -->
      </div>
      <el-scrollbar>
        <el-menu
          :router="false"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <!-- <SubMenu :menu-list="menuList" /> -->
        </el-menu>
      </el-scrollbar>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useGlobalStore } from '@/store/modules/global'
  const globalStore = useGlobalStore()

  const isCollapse = computed(() => globalStore.isCollapse)
  //   const menuList = computed(() => auhStor Daa as unknown as Menu.MenuOs[]
</script>

<style lang="scss" scoped></style>
