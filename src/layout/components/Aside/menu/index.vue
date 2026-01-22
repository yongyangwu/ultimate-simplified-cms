<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :unique-opened="true"
    :collapse-transition="false"
  >
    <SubMenu :menu-list="menuList" />
  </el-menu>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { authAuthStore } from '@/store/modules/auth'
  import { useGlobalStore } from '@/store/modules/global'
  import SubMenu from './subMenu.vue'
  const route = useRoute()
  const authStore = authAuthStore()
  const globalStore = useGlobalStore()
  const activeMenu = computed(() => {
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu as string
    }
    return path
  })
  const isCollapse = computed(() => globalStore.isCollapse)
  const menuList = computed(() => authStore.showMenuListGet)
  console.log('menuList', menuList.value)
</script>
<style lang="scss" scoped>
  .el-menu {
    border-right: none;
  }
</style>
