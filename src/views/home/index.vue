<template>
  <!-- <div>home</div> -->
  <ultimate-table
    :columns="columns"
    :request-api="getUserListApi"
    @add="handleAdd"
    @batch-delete="handleBatchDelete"
    @export="handleExport"
  >
    <!-- 方式1: 使用 tableHeaderExtra 插槽在默认按钮后面追加额外按钮 -->
    <template #tableHeaderExtra="{ selectedRows }">
      <el-button
        :disabled="selectedRows.length === 0"
        @click="handleBatchImport(selectedRows)"
      >
        <el-icon style="margin-right: 4px"><Upload /></el-icon>
        批量导入
      </el-button>
      <el-button @click="handlePrint">
        <el-icon style="margin-right: 4px"><Printer /></el-icon>
        打印
      </el-button>
    </template>

    <!-- 操作列插槽 -->
    <template #operation="{ row, $index }">
      <el-button type="primary" link size="small">查看</el-button>
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
</template>
<script setup lang="tsx">
  import { reactive } from 'vue'
  import { Upload, Printer } from '@element-plus/icons-vue'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'
  import { getUserListApi } from '@/api/modules/system/index'

  // 模拟异步获取省份列表的 API
  const fetchProvinces = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
      { label: '广东省', value: 1 },
      { label: '浙江省', value: 2 },
      { label: '江苏省', value: 3 },
    ]
  }

  // 模拟异步获取城市列表的 API（根据省份）
  const fetchCities = async (params?: Record<string, any>) => {
    // console.log('加载城市，省份参数：', params)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 根据不同省份返回不同的城市
    const cityMap: Record<number, Array<{ label: string; value: number }>> = {
      1: [
        { label: '广州市', value: 11 },
        { label: '深圳市', value: 12 },
        { label: '东莞市', value: 13 },
      ],
      2: [
        { label: '杭州市', value: 21 },
        { label: '宁波市', value: 22 },
        { label: '温州市', value: 23 },
      ],
      3: [
        { label: '南京市', value: 31 },
        { label: '苏州市', value: 32 },
        { label: '无锡市', value: 33 },
      ],
    }

    const provinceId = params?.province
    return cityMap[provinceId as number] || []
  }
  // 模拟异步获取部门列表的 API
  const fetchDepartments = async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000))
    return [
      { label: '技术部', value: 1 },
      { label: '市场部', value: 2 },
      { label: '人事部', value: 3 },
      { label: '财务部', value: 4 },
    ]
  }
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
    // {
    //   label: '姓名',
    //   prop: 'name',
    //   search: {
    //     order: 1,
    //     render: ({ searchParam }) => {
    //       return (
    //         <el-input
    //           v-model={searchParam.name}
    //           placeholder="请输入姓名"
    //           clearable
    //           style={{ width: '100%' }}
    //         />
    //       )
    //     },
    //   },
    // },
    // {
    //   label: '邮箱',
    //   prop: 'email',
    //   minWidth: 200,
    //   search: {
    //     el: 'el-input',
    //     order: 2,
    //     elProps: {
    //       placeholder: '请输入邮箱',
    //     },
    //   },
    // },
    // {
    //   label: '手机',
    //   prop: 'phone',
    //   minWidth: 200,
    //   search: {
    //     el: 'el-input',
    //     // order: 3,
    //     elProps: {
    //       placeholder: '请输入手机号',
    //     },
    //   },
    // },
    // {
    //   label: '性别',
    //   prop: 'gender',
    //   search: {
    //     el: 'el-select',
    //     // order: 4,
    //     options: [
    //       { label: '男', value: 1 },
    //       { label: '女', value: 2 },
    //     ],
    //     elProps: {
    //       placeholder: '请选择性别',
    //       clearable: true,
    //     },
    //   },
    // },
    {
      label: '省份',
      prop: 'province',
      search: {
        el: 'el-select',

        order: 5,
        // 通过 API 异步获取选项
        optionsApi: fetchProvinces,
        defaultValue: 1,
        elProps: {
          placeholder: '请选择省份',
          // disabled: true,
        },
      },
    },
    {
      label: '城市',
      prop: 'city',
      search: {
        el: 'el-select',
        order: 6,
        // 通过 API 异步获取选项（依赖省份）
        optionsApi: fetchCities,
        // 联动配置：依赖 province 字段
        linkage: ['province'],
        elProps: {
          placeholder: '请选择城市',
        },
      },
    },
    {
      label: '部门',
      prop: 'department',
      search: {
        el: 'el-select',
        order: 7,
        // 通过 API 异步获取选项（独立）
        optionsApi: fetchDepartments,
        elProps: {
          placeholder: '请选择部门',
          multiple: true,
        },
      },
    },
    {
      label: '创建时间',
      prop: 'createTime',
      minWidth: 200,
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
    console.log('新增')
  }

  // 处理批量删除
  const handleBatchDelete = (selectedRows: any[]) => {
    console.log('批量删除选中的行：', selectedRows)
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出数据')
  }

  // 处理批量导入
  const handleBatchImport = (selectedRows: any[]) => {
    console.log('批量导入选中的行：', selectedRows)
  }

  // 处理打印
  const handlePrint = () => {
    console.log('打印表格')
  }

  // 处理编辑
  const handleEdit = (row: any, index: number) => {
    console.log('编辑第', index, '行数据：', row)
  }

  // 处理删除
  const handleDelete = (row: any, index: number) => {
    console.log('删除第', index, '行数据：', row)
  }
</script>
