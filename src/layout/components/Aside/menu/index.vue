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
  import { useAuthStore } from '@/store/modules/auth'
  import { useGlobalStore } from '@/store/modules/global'
  import SubMenu from './subMenu.vue'
  const route = useRoute()
  const authStore = useAuthStore()
  const globalStore = useGlobalStore()
  const activeMenu = computed(() => {
    const { meta, path } = route
    if (meta.activeMenu) {
      return meta.activeMenu as string
    }
    return path
  })
  const isCollapse = computed(() => globalStore.isCollapse)
  // console.log('authStore.menuTreeGet', authStore.menuTreeGet)
  const menuList = computed(() => authStore.menuTreeGet)
  // console.log('menuList', menuList.value)
</script>
<style lang="scss" scoped>
  .el-menu {
    border-right: none;
  }
</style>
