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
    :data="tableData"
    :loading="loading"
    v-bind="props.tableProps"
    :pagination-props="props.paginationProps"
    :total="total"
    :page-size="pageSize"
    :current-page="currentPage"
    @update:page-size="handleUpdatePageSize"
    @update:current-page="handleUpdateCurrentPage"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @add="emit('add')"
    @batch-delete="emit('batch-delete', $event)"
    @export="emit('export')"
    @refresh="handleRefresh"
  >
    <!-- 透传 tableHeader 插槽 - 完全自定义左侧按钮 -->
    <template #tableHeader="{ selectedRows }">
      <slot name="tableHeader" :selected-rows="selectedRows"></slot>
    </template>

    <!-- 透传 tableHeaderExtra 插槽 - 在默认按钮后面追加额外按钮 -->
    <template #tableHeaderExtra="{ selectedRows }">
      <slot name="tableHeaderExtra" :selected-rows="selectedRows"></slot>
    </template>

    <!-- 透传 operation 插槽 - 操作列 -->
    <template #operation="{ row, $index }">
      <slot name="operation" :row="row" :$index="$index"></slot>
    </template>
  </Table>
</template>
<script setup lang="ts">
  import { reactive, ref, onMounted, watch } from 'vue'
  import Search from './search/index.vue'
  import Table from './table/index.vue'
  import type { UltimateTableProps } from '@/components/ultimate-table/type'
  const props = withDefaults(defineProps<UltimateTableProps>(), {
    columns: () => [],
    data: undefined,
    requestApi: undefined,
    requestAuto: true,
    initParam: () => ({}),
    tableProps: () => ({ border: true, highlightCurrentRow: true }),
    paginationProps: () => ({}),
    requestMapping: () => ({ pageNo: 'pageNo', pageSize: 'pageSize' }),
    responseMapping: () => ({ list: 'data', total: 'total' }),
  })

  // 定义 emit
  const emit = defineEmits<{
    add: []
    'batch-delete': [selectedRows: any[]]
    export: []
  }>()

  // 内部状态
  const loading = ref(false)
  const tableData = ref<any[]>([])
  const total = ref(0)
  const pageSize = ref(10)
  const currentPage = ref(1)
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

  // 通过链式路径获取对象属性值
  const getValueByPath = (obj: any, path: string): any => {
    if (!path) return undefined
    const keys = path.split('.')
    let result = obj
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key]
      } else {
        return undefined
      }
    }
    return result
  }

  // 获取表格数据
  const getTableData = async () => {
    // 如果传了静态数据，直接使用
    if (props.data) {
      tableData.value = props.data
      return
    }
    // 如果没有传 requestApi，不请求
    if (!props.requestApi) {
      return
    }
    try {
      loading.value = true
      // 合并参数：初始化参数 + 搜索参数 + 分页参数
      const rawParams = {
        ...props.initParam,
        ...searchParam,
        [props.requestMapping?.pageNo || 'pageNo']: currentPage.value,
        [props.requestMapping?.pageSize || 'pageSize']: pageSize.value,
      }

      // 剔除空值参数（null、undefined、空字符串）
      const params = Object.keys(rawParams).reduce(
        (acc, key) => {
          const value = rawParams[key]
          if (value !== null && value !== undefined && value !== '') {
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>
      )

      console.log('params-----', params)
      const result = await props.requestApi(params)
      console.log('result----', result)
      // 如果有数据处理回调，使用回调处理数据
      let processedData = result
      if (props.dataCallback) {
        processedData = props.dataCallback(result)
      }

      // 使用配置的字段映射获取数据
      const listData = getValueByPath(
        processedData,
        props.responseMapping?.list || 'data'
      )
      const totalCount = getValueByPath(
        processedData,
        props.responseMapping?.total || 'total'
      )

      tableData.value = Array.isArray(listData) ? listData : []
      total.value = typeof totalCount === 'number' ? totalCount : 0
    } catch (error) {
      console.error('获取表格数据失败：', error)
      tableData.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 处理搜索事件
  const handleSearch = (params: Record<string, any>) => {
    // 更新搜索参数
    Object.assign(searchParam, params)
    // 重置到第一页
    currentPage.value = 1
    // 重新加载数据
    getTableData()
  }

  // 处理重置事件
  const handleReset = () => {
    // 重置搜索参数
    props.columns.forEach((item) => {
      if (item.search && item.prop) {
        const key = item.search?.key || item.prop
        searchParam[key] = item.search.defaultValue ?? ''
      }
    })
    // 重置到第一页
    currentPage.value = 1
    // 重新加载数据
    getTableData()
  }

  // 处理每页条数改变
  const handleUpdatePageSize = (size: number) => {
    pageSize.value = size
  }

  // 处理当前页改变
  const handleUpdateCurrentPage = (page: number) => {
    currentPage.value = page
  }

  // 处理每页条数改变
  const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    getTableData()
  }

  // 处理当前页改变
  const handleCurrentChange = (page: number) => {
    currentPage.value = page
    getTableData()
  }

  // 处理刷新
  const handleRefresh = () => {
    getTableData()
  }

  // 监听静态数据变化
  watch(
    () => props.data,
    (newData) => {
      if (newData) {
        tableData.value = newData
      }
    }
  )

  // 组件挂载时自动加载数据
  onMounted(() => {
    if (props.requestAuto) {
      getTableData()
    }
  })

  // 暴露方法给父组件
  defineExpose({
    getTableData, // 手动刷新表格数据
    searchParam, // 搜索参数
    tableData, // 表格数据
  })
</script>
