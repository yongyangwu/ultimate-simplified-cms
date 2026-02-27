<template>
  <div>
    <ultimate-table
      ref="tableRef"
      :columns="columns"
      :request-api="getRolesApi"
      :responseMapping="{ list: 'data', total: 'total' }"
      :dataCallback="handleDataCallback"
      :showToolButtonList="['add', 'export']"
      @add="handleAdd"
      @export="handleExport"
    >
      <!-- 操作列插槽 -->
      <template #operation="{ row, $index }">
        <el-button type="primary" link size="small" @click="handleView(row)"
          >查看</el-button
        >
        <el-button type="primary" link size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          @click="handleDelete(row, $index)"
        >
          删除
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          @click="handleDelete(row, $index)"
        >
          分配权限
        </el-button>
      </template>
    </ultimate-table>
    <MenuForm
      ref="menuFormRef"
      :form-config="formConfig"
      :form-rules="formRules"
      @submit="handleMenuSubmit"
    />
  </div>
</template>
<script setup lang="tsx">
  import { reactive, ref, defineAsyncComponent, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'
  import {
    addRoleApi,
    getRolesApi,
    deleteRoleApi,
    updateRoleApi,
  } from '@/api/modules/system/index'

  const MenuForm = defineAsyncComponent(
    () => import('@/components/ultimate-add/index.vue')
  )
  const menuFormRef = ref()

  // 表单配置
  const formConfig = computed(() => [
    {
      label: '角色名称',
      prop: 'name',
      component: 'el-input',
      // props: { placeholder: '请输入' },
      span: 24,
    },
    {
      label: '角色编码',
      prop: 'code',
      component: 'el-input',
      // props: { placeholder: '请输入' },
      span: 24,
    },
    {
      label: '角色描述',
      prop: 'description',
      component: 'el-input',
      props: { placeholder: '请输入', type: 'textarea' },
      span: 24,
    },
  ])

  // 表单规则
  const formRules = {
    type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  }

  const tableRef = ref<InstanceType<typeof UltimateTable> | null>(null)

  const columns = reactive<ColumnProps[]>([
    {
      type: 'selection',
      width: 55,
      fixed: 'left',
    },
    {
      type: 'index',
      label: '序号',
      width: 60,
    },
    {
      label: '角色名称',
      prop: 'name',
      search: {
        el: 'el-input',
        elProps: {
          placeholder: '请输入',
        },
      },
    },
    {
      label: '角色编码',
      prop: 'code',
      search: {
        el: 'el-input',
        elProps: {
          placeholder: '请输入',
        },
      },
    },
    {
      label: '角色描述',
      prop: 'description',
    },
    {
      label: '操作',
      prop: 'operation',
      width: 240,
      fixed: 'right',
    },
  ])

  // 处理新增
  const handleAdd = () => {
    menuFormRef.value?.open('add')
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出数据')
  }

  // 处理打印

  // 处理编辑
  const handleEdit = (row: any) => {
    menuFormRef.value?.open('edit', row)
  }

  // 处理查看
  const handleView = (row: any) => {
    menuFormRef.value?.open('view', row)
  }

  // 处理删除
  const handleDelete = async (row: any, index: number) => {
    console.log('删除第', index, '行数据：', row)
    await deleteRoleApi(row.id)
    ElMessage.success('删除成功')
    handleRefresh()
  }

  const handleMenuSubmit = async (data: any) => {
    if (data.id) {
      await updateRoleApi(data.id, data)
    } else {
      await addRoleApi(data)
    }
    ElMessage.success('保存成功')
    menuFormRef.value?.close()
    handleRefresh()
  }

  const handleRefresh = () => {
    tableRef.value?.getTableData()
  }
  const handleDataCallback = (data: any) => {
    console.log('数据回调', data)
    return data
  }
</script>
