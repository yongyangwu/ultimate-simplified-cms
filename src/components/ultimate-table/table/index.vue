<template>
  <el-card style="margin-top: 12px">
    <!-- 功能区 -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <!-- 左侧操作按钮 -->
      <div style="display: flex; gap: 8px; align-items: center">
        <!-- 默认操作按钮插槽 -->
        <slot name="tableHeader" :selected-rows="selectedRows">
          <el-button type="primary" @click="handleAdd">
            <el-icon style="margin-right: 4px"><Plus /></el-icon>
            新增
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon style="margin-right: 4px"><Delete /></el-icon>
            批量删除
          </el-button>
          <el-button @click="handleExport">
            <el-icon style="margin-right: 4px"><Download /></el-icon>
            下载
          </el-button>
        </slot>

        <!-- 额外操作按钮插槽 -->
        <slot name="tableHeaderExtra" :selected-rows="selectedRows"></slot>
      </div>

      <!-- 右侧工具按钮 -->
      <div style="display: flex; gap: 8px">
        <el-tooltip content="刷新" placement="top">
          <el-button circle @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-tooltip>

        <el-dropdown trigger="click">
          <el-button circle>
            <el-icon><Operation /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="column in normalColumns"
                :key="column.prop"
                @click.stop
              >
                <el-checkbox
                  v-model="column.isShow"
                  @change="handleColumnVisibleChange"
                  :label="column.label"
                />
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <el-table
      v-bind="$attrs"
      v-loading="props.loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 动态渲染列 -->
      <template v-for="column in visibleColumns" :key="column.prop">
        <!-- 选择列 -->
        <el-table-column
          v-if="column.type === 'selection'"
          type="selection"
          :width="column.width || 55"
          :fixed="column.fixed"
          :align="column.align || 'center'"
        />

        <!-- 索引列 -->
        <el-table-column
          v-else-if="column.type === 'index'"
          type="index"
          :label="column.label || '序号'"
          :width="column.width || 60"
          :fixed="column.fixed"
          :align="column.align || 'center'"
        />

        <!-- 展开列 -->
        <el-table-column
          v-else-if="column.type === 'expand'"
          type="expand"
          :width="column.width || 55"
          :fixed="column.fixed"
        >
          <template #default="scope">
            <slot name="expand" :row="scope.row" :$index="scope.$index" />
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-else-if="column.prop === 'operation'"
          :label="column.label || '操作'"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed || 'right'"
          :align="column.align || 'center'"
        >
          <template #default="scope">
            <slot name="operation" :row="scope.row" :$index="scope.$index">
              <!-- 默认操作按钮 -->
              <el-button type="primary" link size="small">查看</el-button>
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="danger" link size="small">删除</el-button>
            </slot>
          </template>
        </el-table-column>

        <!-- 普通列 -->
        <el-table-column
          v-else
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align || 'left'"
          :sortable="column.sortable"
          :show-overflow-tooltip="column.showOverflowTooltip ?? true"
        >
          <template #default="scope">
            <!-- 自定义插槽 -->
            <slot
              v-if="column.prop"
              :name="column.prop"
              :row="scope.row"
              :$index="scope.$index"
            >
              {{ scope.row[column.prop!] }}
            </slot>
          </template>
        </el-table-column>
      </template>

      <!-- 空数据插槽 -->
      <template #empty>
        <slot name="empty">
          <el-empty description="暂无数据" />
        </slot>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      v-if="showPagination"
      v-bind="mergedPaginationProps"
      style="margin-top: 16px; justify-content: flex-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script setup lang="ts">
  import { ref, computed, watch, reactive } from 'vue'
  import {
    Operation,
    Plus,
    Delete,
    Download,
    Refresh,
  } from '@element-plus/icons-vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'

  interface TableProps {
    columns: ColumnProps[] // 列配置
    data?: any[] // 表格数据
    loading?: boolean // 加载状态
    paginationProps?: Record<string, any> | false // Element Plus Pagination 原生属性，传 false 隐藏分页
    total?: number // 总条数
    pageSize?: number // 每页显示条数
    currentPage?: number // 当前页码
  }

  const props = withDefaults(defineProps<TableProps>(), {
    columns: () => [],
    data: () => [],
    loading: false,
    paginationProps: () => ({}),
    total: 0,
    pageSize: 10,
    currentPage: 1,
  })

  // 定义 emit
  const emit = defineEmits<{
    'update:pageSize': [pageSize: number]
    'update:currentPage': [currentPage: number]
    'size-change': [size: number]
    'current-change': [page: number]
    add: []
    'batch-delete': [selectedRows: any[]]
    export: []
    refresh: []
  }>()

  // 表格数据
  const tableData = ref(props.data)

  // 选中的行
  const selectedRows = ref<any[]>([])

  // 列显示状态管理
  const columnVisibility = reactive<Record<string, boolean>>({})

  // 初始化列显示状态
  props.columns.forEach((column) => {
    if (column.prop) {
      // 默认所有列都显示，除非列配置中指定了 isShow 为 false
      columnVisibility[column.prop] = column.isShow ?? true
    }
  })

  // 获取普通列（用于列设置下拉菜单）
  const normalColumns = computed(() => {
    return props.columns
      .filter((column) => column.prop && !column.type) // 排除特殊类型的列（selection、index、expand）
      .map((column) => ({
        ...column,
        isShow: columnVisibility[column.prop!],
      }))
  })

  // 获取可见的列
  const visibleColumns = computed(() => {
    return props.columns.filter((column) => {
      // 特殊类型的列（selection、index、expand）始终显示
      if (column.type) return true
      // 普通列根据显示状态判断
      if (column.prop) {
        return columnVisibility[column.prop] !== false
      }
      return true
    })
  })

  // 处理列显示状态变化
  const handleColumnVisibleChange = () => {
    // 更新列显示状态
    normalColumns.value.forEach((column) => {
      if (column.prop) {
        columnVisibility[column.prop] = column.isShow ?? true
      }
    })
  }

  // 处理表格选择变化
  const handleSelectionChange = (selection: any[]) => {
    selectedRows.value = selection
  }

  // 处理新增
  const handleAdd = () => {
    emit('add')
  }

  // 处理批量删除
  const handleBatchDelete = () => {
    emit('batch-delete', selectedRows.value)
  }

  // 处理导出
  const handleExport = () => {
    emit('export')
  }

  // 处理刷新
  const handleRefresh = () => {
    emit('refresh')
  }

  // 内部分页状态
  const internalPageSize = ref(props.pageSize)
  const internalCurrentPage = ref(props.currentPage)
  const internalTotal = ref(props.total)

  // 监听 props 变化
  watch(
    () => props.data,
    (newData) => {
      tableData.value = newData
    }
  )

  watch(
    () => props.pageSize,
    (newVal) => {
      internalPageSize.value = newVal
    }
  )

  watch(
    () => props.currentPage,
    (newVal) => {
      internalCurrentPage.value = newVal
    }
  )

  watch(
    () => props.total,
    (newVal) => {
      internalTotal.value = newVal
    }
  )

  // 是否显示分页
  const showPagination = computed(() => {
    return props.paginationProps !== false
  })

  // 合并分页配置：内部默认值 + 用户传入的配置
  const mergedPaginationProps = computed(() => {
    return {
      total: internalTotal.value,
      pageSize: internalPageSize.value,
      currentPage: internalCurrentPage.value,
      pageSizes: [10, 20, 50, 100],
      layout: 'total, sizes, prev, pager, next, jumper',
      background: true,
      ...(typeof props.paginationProps === 'object'
        ? props.paginationProps
        : {}), // 用户传入的配置会覆盖默认值
    }
  })

  // 每页条数改变
  const handleSizeChange = (size: number) => {
    internalPageSize.value = size
    emit('update:pageSize', size)
    emit('size-change', size)
  }

  // 当前页改变
  const handleCurrentChange = (page: number) => {
    internalCurrentPage.value = page
    emit('update:currentPage', page)
    emit('current-change', page)
  }

  // 暴露方法供父组件调用
  defineExpose({
    setTableData: (data: any[]) => {
      tableData.value = data
    },
    getTableData: () => tableData.value,
    setTotal: (total: number) => {
      internalTotal.value = total
    },
  })
</script>

<style scoped lang="scss">
  :deep(.el-table) {
    font-size: 14px;
  }

  :deep(.el-dropdown-menu__item) {
    padding: 8px 16px;

    .el-checkbox {
      width: 100%;

      .el-checkbox__label {
        width: 100%;
        padding-left: 8px;
      }
    }
  }
</style>
