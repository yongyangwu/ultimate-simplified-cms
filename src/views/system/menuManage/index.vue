<template>
  <div>
    <ultimate-table
      ref="tableRef"
      :columns="columns"
      :request-api="getMenuApi"
      :responseMapping="{ list: 'data', total: 'total' }"
      :dataCallback="handleDataCallback"
      :showToolButtonList="['add', 'export']"
      @add="handleAdd"
      @export="handleExport"
    >
      <template #tableHeaderExtra>
        <el-button type="primary"> 批量删除 </el-button>
      </template>
      <!-- 操作列插槽 -->
      <template #operation="{ row, $index }">
        <el-button
          type="primary"
          link
          size="small"
          @click="handleView(row, $index)"
          >查看</el-button
        >
        <el-button
          type="primary"
          link
          size="small"
          @click="handleEdit(row, $index)"
        >
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
      </template>
    </ultimate-table>
    <MenuForm
      ref="menuFormRef"
      :key="menuFormKey"
      :form-config="formConfig"
      :form-rules="formRules"
      @submit="handleMenuSubmit"
    />
  </div>
</template>
<script setup lang="tsx">
  import { reactive, ref, defineAsyncComponent, computed, nextTick } from 'vue'
  import { ElMessage } from 'element-plus'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'
  import { getMenuApi, addMenuApi } from '@/api/modules/system/index'
  import { useAuthStore } from '@/store/modules/auth'
  const authStore = useAuthStore()
  console.log('authStore.authMenuListGet', authStore.authMenuListGet)
  const MenuForm = defineAsyncComponent(
    () => import('@/components/ultimate-add/index.vue')
  )
  const menuFormRef = ref()
  const menuFormKey = ref(0)

  const findLabel = (
    list: any[],
    value: string | number
  ): string | undefined => {
    for (const item of list) {
      if (item.id === value) {
        return item.meta.title
      }
      if (item.children && item.children.length > 0) {
        const found = findLabel(item.children, value)
        if (found) return found
      }
    }
    return undefined
  }

  // 表单配置
  const formConfig = computed(() => [
    {
      label: '菜单类型',
      prop: 'menuType',
      component: 'el-radio-group',
      optionComponent: 'el-radio-button',
      defaultValue: 2,
      options: [
        { label: '目录', value: 1 },
        { label: '菜单', value: 2 },
        { label: '按钮', value: 3 },
      ],
      span: 24,
    },
    {
      label: '上级菜单',
      prop: 'parentId',
      component: 'el-tree-select',
      props: {
        placeholder: '请选择上级菜单',
        data: authStore.authMenuListGet,
        checkStrictly: true,
        filterable: true,
        clearable: true,
        nodeKey: 'id',
        props: {
          label: (data: any) => data.meta.title,
          children: 'children',
        },
        onChange: (val: any) => {
          console.log('上级菜单变更:', val)
          const label = findLabel(authStore.authMenuListGet, val)
          console.log('选中菜单名称:', label)
        },
      },
      tip: '未选择默认为第一级',
      span: 24,
    },
    {
      label: '菜单名称',
      prop: 'menuNameZh',
      component: 'el-input',
      props: { placeholder: '请输入菜单名称' },
      span: 24,
    },
    {
      label: '菜单名称(英文)',
      prop: 'menuNameEn',
      component: 'el-input',
      props: { placeholder: '请输入菜单名称(英文)' },
      span: 24,
    },
    // {
    //   label: '路由名称',
    //   prop: 'name',
    //   component: 'el-input',
    //   props: { placeholder: '请输入路由名称(英文)' },
    //   span: 24,
    // },

    {
      label: '路由路径',
      prop: 'routePath',
      component: 'el-input',
      span: 24,
      props: { placeholder: '请输入路由路径' },
    },
    // {
    //   label: '图标',
    //   prop: 'icon',
    //   component: 'el-input',
    //   props: { placeholder: '请输入图标名称' },
    //   span: 12,
    // },
    // {
    //   label: '排序',
    //   prop: 'sort',
    //   component: 'el-input-number',
    //   props: { min: 0 },
    //   span: 12,
    // },
    {
      label: '是否隐藏',
      prop: 'isHide',
      component: 'el-switch',
      span: 12,
    },
    {
      label: '是否缓存',
      prop: 'isKeepAlive',
      component: 'el-switch',
      span: 12,
    },
  ])

  // 表单规则
  const formRules = {
    menuType: [
      { required: true, message: '请选择菜单类型', trigger: 'change' },
    ],
    menuNameZh: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
    ],
    menuNameEn: [
      { required: true, message: '请输入菜单名称', trigger: 'blur' },
    ],
    routePath: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  }

  const tableRef = ref<InstanceType<typeof UltimateTable> | null>(null)

  const columns = reactive<ColumnProps[]>([
    // {
    //   type: 'selection',
    //   width: 55,
    //   fixed: 'left',
    // },
    {
      type: 'index',
      label: '序号',
      width: 60,
    },
    {
      label: '菜单名称',
      prop: 'name',
      search: {
        el: 'el-input',
      },
    },
    {
      label: '菜单类型',
      prop: 'menuType',
      render: ({ row }) => {
        console.log('row.menuType', row)
        return row.menuType === 1
          ? '目录'
          : row.menuType === 2
            ? '菜单'
            : '按钮'
      },
    },
    {
      label: '路由',
      prop: 'path',
    },
    {
      label: '操作',
      prop: 'operation',
      width: 180,
      fixed: 'right',
    },
  ])

  // 处理新增
  const handleAdd = () => {
    menuFormKey.value++
    nextTick(() => {
      menuFormRef.value?.open('add')
    })
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出数据')
  }

  // 处理编辑
  const handleEdit = (row: any, index: number) => {
    menuFormKey.value++
    nextTick(() => {
      menuFormRef.value?.open('edit', row)
    })
  }

  // 处理查看
  const handleView = (row: any, index: number) => {
    menuFormKey.value++
    nextTick(() => {
      menuFormRef.value?.open('view', row)
    })
  }

  // 处理删除
  const handleDelete = (row: any, index: number) => {
    console.log('删除第', index, '行数据：', row)
  }

  const handleMenuSubmit = async (data: any) => {
    // 如果没有选择上级菜单，parentId 默认为 0
    data.parentId = data.parentId || 0
    const parentName = data.parentId
      ? findLabel(authStore.authMenuListGet, data.parentId)
      : ''
    console.log('parentName', parentName)
    const params = { ...data, parentName }
    await addMenuApi(params)
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
