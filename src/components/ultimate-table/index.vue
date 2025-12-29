<template>
  <search
    :columns="props.columns"
    :searchParam="searchParam"
    @search="handleSearch"
    @reset="handleReset"
    @options-loaded="handleOptionsLoaded"
  ></search>
  <Table
    :columns="props.columns"
    :data="props.data"
    v-bind="props.tableProps"
  ></Table>
</template>
<script setup lang="ts">
  import { reactive } from 'vue'
  import Search from './search/index.vue'
  import Table from './table/index.vue'

  import type { ColumnProps } from '@/components/ultimate-table/type'

  interface UltimateTableProps {
    columns?: ColumnProps[] // 列配置
    data?: any[] // 表格数据
    tableProps?: Record<string, any> // Element Plus Table 原生属性
  }

  const props = withDefaults(defineProps<UltimateTableProps>(), {
    columns: () => [],
    data: () => [],
    tableProps: () => ({}),
  })
  // 定义 emit
  const emit = defineEmits<{
    search: [searchParam: Record<string, any>]
    reset: []
  }>()

  const searchParam = reactive<Record<string, any>>({})

  // 初始化搜索参数（区分静态和异步）
  props.columns.forEach((item) => {
    if (item.search && item.prop) {
      const key = item.search?.key || item.prop

      // 如果有 optionsApi，暂不设置 defaultValue，等选项加载完成后再设置
      if (item.search.optionsApi) {
        searchParam[key] = ''
      } else {
        // 静态选项直接设置 defaultValue
        searchParam[key] = item.search.defaultValue ?? ''
      }
    }
  })

  // 异步选项加载完成后的回调
  const handleOptionsLoaded = () => {
    // 设置有 optionsApi 的字段的 defaultValue
    props.columns.forEach((item) => {
      if (
        item.search &&
        item.prop &&
        item.search.optionsApi &&
        item.search.defaultValue !== undefined
      ) {
        const key = item.search?.key || item.prop
        searchParam[key] = item.search.defaultValue
      }
    })
  }
  // 处理搜索事件
  const handleSearch = (params: Record<string, any>) => {
    emit('search', params)
  }
  // 处理重置事件
  const handleReset = () => {
    emit('reset')
  }
</script>
