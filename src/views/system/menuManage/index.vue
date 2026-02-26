<template>
  <div>
    <ultimate-table
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :pagination-props="false"
      :showToolButtonList="['add', 'export']"
      @add="handleAdd"
      @export="handleExport"
    >
      <template #tableHeaderExtra>
        <el-button type="primary"> 批量删除 </el-button>
      </template>
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
  import { transferFlatMenuListToTree } from '@/utils'
  const authStore = useAuthStore()
  // console.log('authStore.menuTreeGet', authStore.menuTreeGet)

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
      if (String(item.id) === String(value)) {
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
      props: (scope: any) => ({
        placeholder: '请选择上级菜单',
        data: authStore.menuTreeGet,
        checkStrictly: true,
        filterable: true,
        clearable: true,
        nodeKey: 'id',
        props: {
          label: (data: any) => data.meta.title,
          children: 'children',
          disabled: (data: any) => {
            if ([1, 2].includes(scope.menuType)) return data.menuType !== 1
            if (scope.menuType === 3) return data.menuType !== 2
            return false
          },
        },
        onChange: (val: any) => {
          // console.log('上级菜单变更:', val)
          const label = findLabel(authStore.menuTreeGet, val)
          console.log('选中菜单名称:', label)
        },
      }),
      tip: '未选择默认为第一级',
      span: 24,
    },
    {
      label: '菜单名称',
      prop: 'menuNameZh',
      component: 'el-input',
      props: { placeholder: '请输入菜单名称' },
      span: 24,
      // isShow: (scope: any) => scope.menuType === 2,
    },
    {
      label: '菜单名称(英文)',
      prop: 'menuNameEn',
      component: 'el-input',
      props: { placeholder: '请输入菜单名称(英文)' },
      span: 24,
      // isShow: (scope: any) => scope.menuType === 2,
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
      prop: 'path',
      component: 'el-input',
      span: 24,
      props: { placeholder: '请输入路由路径' },
      isShow: (scope: any) => scope.menuType !== 3,
    },
    {
      label: '路由重定向',
      prop: 'redirect',
      component: 'el-input',
      span: 24,
      props: { placeholder: '请输入路由路径' },
      isShow: (scope: any) => scope.menuType !== 3,
    },
    {
      label: '组件路径',
      prop: 'component',
      component: 'el-input',
      span: 24,
      props: { placeholder: '请输入组件路径' },
      isShow: (scope: any) => scope.menuType === 2,
    },
    {
      label: '权限标识',
      prop: 'permissonCode',
      component: 'el-input',
      span: 24,
      props: { placeholder: '请输入按钮权限标识' },
      isShow: (scope: any) => scope.menuType === 3,
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
      span: 24,
      isShow: (scope: any) => scope.menuType === 2,
    },
    {
      label: '是否缓存',
      prop: 'isKeepAlive',
      component: 'el-switch',
      span: 24,
      isShow: (scope: any) => scope.menuType === 2,
    },
    {
      label: '全屏显示',
      prop: 'isFull',
      component: 'el-switch',
      span: 24,
      isShow: (scope: any) => scope.menuType === 2,
    },
    {
      label: '排序',
      prop: 'order',
      component: 'el-input-number',
      defaultValue: 1,
      isShow: (scope: any) => scope.menuType !== 3,
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
    path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
    redirect: [
      { required: true, message: '请输入路由重定向路径', trigger: 'blur' },
    ],
    component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
    permissonCode: [
      { required: true, message: '请输入权限标识', trigger: 'blur' },
    ],
  }

  const tableRef = ref<InstanceType<typeof UltimateTable> | null>(null)
  const tableData = ref<any[]>([])

  const getTableData = async () => {
    const data: any = await getMenuApi()
    tableData.value = transferFlatMenuListToTree(data)
  }
  getTableData()

  const columns = reactive<ColumnProps[]>([
    // {
    //   type: 'selection',
    //   width: 55,
    //   fixed: 'left',
    // },
    // {
    //   type: 'index',
    //   label: '序号',
    //   width: 60,
    // },
    {
      label: '菜单名称',
      prop: 'title',
      width: 120,
      fixed: 'left',
      search: {
        el: 'el-input',
      },
    },
    {
      label: '菜单类型',
      prop: 'menuType',
      width: 90,
      render: ({ row }) => {
        if (row.menuType === 1) {
          return (
            <el-button type="primary" size="small" plain>
              目录
            </el-button>
          )
        }
        if (row.menuType === 2) {
          return (
            <el-button type="success" size="small" plain>
              菜单
            </el-button>
          )
        }
        return (
          <el-button type="info" size="small" plain>
            按钮
          </el-button>
        )
      },
    },
    {
      label: '路径',
      prop: 'path',
      width: 180,
    },
    {
      label: '组件',
      prop: 'component',
      width: 200,
    },
    {
      label: '是否隐藏',
      prop: 'isHide',
      width: 100,
    },
    {
      label: '是否缓存',
      prop: 'isKeepAlive',
      width: 100,
    },
    {
      label: '是否全屏',
      prop: 'isFull',
      width: 100,
    },
    {
      label: '权限标识',
      prop: 'permissonCode',
      width: 100,
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
  const handleEdit = (row: any) => {
    menuFormKey.value++
    nextTick(() => {
      menuFormRef.value?.open('edit', row)
    })
  }

  // 处理查看
  const handleView = (row: any) => {
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
    getTableData()
  }
</script>
