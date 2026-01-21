<template>
  <el-main>
    <router-view v-slot="{ Component, route }">
      <transition appear name="fade-transform" mode="out-in">
        <keep-alive>
          <component
            :is="createComponentWrapper(Component, route)"
            :key="route.fullPath"
          />
        </keep-alive>
      </transition>
    </router-view>
  </el-main>
</template>
<script setup lang="ts">
  import { ref, onBeforeUnmount, provide, watch, h } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useDebounceFn } from '@vueuse/core'
  import { useGlobalStore } from '@/store/modules/global'

  const globalStore = useGlobalStore()
  //   const { isCollapse, layout } = storeToRefs(globalStore)

  // 注入刷新页面方法
  const isRouterShow = ref(true)
  const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
  provide('refresh', refreshCurrentPage)

  // 解决详情页 keep-alive 问题
  const wrapperMap = new Map()
  function createComponentWrapper(component: any, route: any) {
    if (!component) return
    const wrapperName = route.fullPath
    let wrapper = wrapperMap.get(wrapperName)
    if (!wrapper) {
      wrapper = { name: wrapperName, render: () => h(component) }
      wrapperMap.set(wrapperName, wrapper)
    }
    return h(wrapper)
  }

  // 监听当前页面是否最大化，动态添加 class
</script>
