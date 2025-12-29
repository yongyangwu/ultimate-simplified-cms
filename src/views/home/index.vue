<template>
  <!-- <div>home</div> -->
  <ultimate-table
    :columns="columns"
    :table-props="tableProps"
    @search="handleSearch"
    @reset="handleReset"
    :data="tableData"
  ></ultimate-table>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'

  // Element Plus Table 原生属性配置
  const tableProps = reactive({
    border: true,
    // stripe: true,
    highlightCurrentRow: true,
    // 可以添加更多 el-table 的原生属性
    // size: 'default',
    // height: '300px',
    // maxHeight: '600px',
    // showHeader: true,
    // fit: true,
    // rowKey: 'id',
    // defaultSort: { prop: 'id', order: 'ascending' },
  })

  // 表格数据
  const tableData = ref([
    {
      id: 1,
      name: '张三',
      gender: 1,
      province: 1,
      city: 11,
      department: 1,
      age: 28,
      email: 'zhangsan@example.com',
      phone: '13800138000',
      status: 1,
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      name: '李四',
      gender: 2,
      province: 2,
      city: 21,
      department: 2,
      age: 32,
      email: 'lisi@example.com',
      phone: '13900139000',
      status: 1,
      createTime: '2024-02-20 14:20:00',
    },
    {
      id: 3,
      name: '王五',
      gender: 1,
      province: 3,
      city: 31,
      department: 3,
      age: 25,
      email: 'wangwu@example.com',
      phone: '13700137000',
      status: 0,
      createTime: '2024-03-10 09:15:00',
    },
    {
      id: 4,
      name: '赵六',
      gender: 2,
      province: 1,
      city: 12,
      department: 4,
      age: 30,
      email: 'zhaoliu@example.com',
      phone: '13600136000',
      status: 1,
      createTime: '2024-04-05 16:45:00',
    },
    {
      id: 5,
      name: '钱七',
      gender: 1,
      province: 2,
      city: 22,
      department: 1,
      age: 27,
      email: 'qianqi@example.com',
      phone: '13500135000',
      status: 0,
      createTime: '2024-05-12 11:30:00',
    },
    {
      id: 6,
      name: '孙八',
      gender: 2,
      province: 3,
      city: 32,
      department: 2,
      age: 29,
      email: 'sunba@example.com',
      phone: '13400134000',
      status: 1,
      createTime: '2024-06-18 15:20:00',
    },
    {
      id: 7,
      name: '周九',
      gender: 1,
      province: 1,
      city: 13,
      department: 3,
      age: 31,
      email: 'zhoujiu@example.com',
      phone: '13300133000',
      status: 1,
      createTime: '2024-07-22 09:45:00',
    },
    {
      id: 8,
      name: '吴十',
      gender: 2,
      province: 2,
      city: 23,
      department: 4,
      age: 26,
      email: 'wushi@example.com',
      phone: '13200132000',
      status: 0,
      createTime: '2024-08-30 13:10:00',
    },
  ])

  // 模拟异步获取省份列表的 API
  const fetchProvinces = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [
      { label: '广东省', value: 1 },
      { label: '浙江省', value: 2 },
      { label: '江苏省', value: 3 },
    ]
  }

  // 模拟异步获取城市列表的 API（根据省份）
  const fetchCities = async (params?: Record<string, any>) => {
    console.log('加载城市，省份参数：', params)
    await new Promise((resolve) => setTimeout(resolve, 500))

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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
      { label: '技术部', value: 1 },
      { label: '市场部', value: 2 },
      { label: '人事部', value: 3 },
      { label: '财务部', value: 4 },
    ]
  }

  const columns = reactive<ColumnProps[]>([
    {
      label: '姓名',
      prop: 'name',
      search: {
        // span: 5,
        el: 'el-input',
        placeholder: '请输入姓名',
        order: 5,
      },
    },
    {
      label: '性别',
      prop: 'gender',
      search: {
        el: 'el-select',
        // span: 5,
        placeholder: '请选择性别',
        order: 4,
        // 静态选项
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
      },
    },
    {
      label: '省份',
      prop: 'province',
      search: {
        el: 'el-select',
        // span: 5,
        placeholder: '请选择省份',
        order: 1,
        // 通过 API 异步获取选项
        optionsApi: fetchProvinces,
        defaultValue: 1,
      },
    },
    {
      label: '城市',
      prop: 'city',
      search: {
        el: 'el-select',
        // span: 5,
        placeholder: '请先选择省份',
        order: 2,
        // 通过 API 异步获取选项（依赖省份）
        optionsApi: fetchCities,
        // 联动配置：依赖 province 字段
        linkage: ['province'],
      },
    },
    {
      label: '部门',
      prop: 'department',
      search: {
        el: 'el-select',
        // span: 5,
        placeholder: '请选择部门',
        order: 3,
        // 通过 API 异步获取选项（独立）
        optionsApi: fetchDepartments,
      },
    },
  ])

  // 处理搜索事件
  const handleSearch = (searchParam: Record<string, any>) => {
    console.log('搜索参数：', searchParam)
    // 在这里调用API进行搜索
  }

  // 处理重置事件
  const handleReset = () => {
    console.log('重置搜索')
    // 在这里可以执行重置后的操作，比如重新加载数据
  }
</script>
