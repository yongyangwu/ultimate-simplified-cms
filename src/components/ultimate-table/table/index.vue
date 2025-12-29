<template>
  <el-card style="margin-top: 12px">
    <el-table v-bind="$attrs" :data="tableData" style="width: 100%">
      <!-- 动态渲染列 -->
      <template v-for="column in columns" :key="column.prop">
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
    <el-pagination />
  </el-card>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'

  interface TableProps {
    columns: ColumnProps[] // 列配置
    data?: any[] // 表格数据
  }

  const props = withDefaults(defineProps<TableProps>(), {
    columns: () => [],
    data: () => [],
  })

  // 表格数据
  const tableData = ref(props.data)

  // 暴露方法供父组件调用
  defineExpose({
    setTableData: (data: any[]) => {
      tableData.value = data
    },
    getTableData: () => tableData.value,
  })
</script>

<style scoped lang="scss">
  :deep(.el-table) {
    font-size: 14px;
  }
</style>
