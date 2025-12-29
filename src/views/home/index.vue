<template>
  <!-- <div>home</div> -->
  <ultimate-table
    :columns="columns"
    :table-props="tableProps"
    :pagination-props="paginationProps"
    :total="total"
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    @search="handleSearch"
    @reset="handleReset"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    @add="handleAdd"
    @batch-delete="handleBatchDelete"
    @export="handleExport"
    @refresh="handleRefresh"
    :data="tableData"
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

    <!-- 方式2: 完全自定义左侧按钮（取消注释下面的代码会覆盖默认按钮） -->
    <!-- 
    <template #tableHeader="{ selectedRows }">
      <el-button type="primary" @click="handleAdd">
        <el-icon style="margin-right: 4px"><Plus /></el-icon>
        自定义新增
      </el-button>
      <el-button 
        type="danger" 
        :disabled="selectedRows.length === 0"
        @click="handleBatchDelete(selectedRows)"
      >
        <el-icon style="margin-right: 4px"><Delete /></el-icon>
        自定义删除 ({{ selectedRows.length }})
      </el-button>
      <el-button @click="handleCustomAction">
        <el-icon style="margin-right: 4px"><Star /></el-icon>
        自定义操作
      </el-button>
    </template>
    -->
  </ultimate-table>
</template>
<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { Upload, Printer } from '@element-plus/icons-vue'
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

  // Element Plus Pagination 原生属性配置
  const paginationProps = reactive({
    // total、pageSize、currentPage 已在组件内部定义，不需要传入
    // 只需要传入其他需要自定义的属性即可
    pageSizes: [10, 20, 50, 100], // 每页显示个数选择器的选项（可选，默认 [10, 20, 50, 100]）
    layout: 'total, sizes, prev, pager, next, jumper', // 组件布局（可选，默认此值）
    background: true, // 是否为分页按钮添加背景色（可选，默认 true）
    // small: false, // 是否使用小型分页样式
    // disabled: false, // 是否禁用分页
    // hideOnSinglePage: false, // 只有一页时是否隐藏
  })

  // 分页数据
  const total = ref(100)
  const pageSize = ref(10)
  const currentPage = ref(1)

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

  // 处理每页条数改变
  const handleSizeChange = (size: number) => {
    console.log('每页条数改变：', size)
    // 重新加载数据
  }

  // 处理当前页改变
  const handleCurrentChange = (page: number) => {
    console.log('当前页改变：', page)
    // 重新加载数据
  }

  // 处理新增
  const handleAdd = () => {
    console.log('新增')
    // 打开新增对话框或跳转到新增页面
  }

  // 处理批量删除
  const handleBatchDelete = (selectedRows: any[]) => {
    console.log('批量删除选中的行：', selectedRows)
    // 弹出确认对话框，然后调用删除 API
  }

  // 处理导出
  const handleExport = () => {
    console.log('导出数据')
    // 调用导出 API 或生成 Excel 文件
  }

  // 处理刷新
  const handleRefresh = () => {
    console.log('刷新数据')
    // 重新加载表格数据
  }

  // 处理批量导入
  const handleBatchImport = (selectedRows: any[]) => {
    console.log('批量导入选中的行：', selectedRows)
    // 打开导入对话框
  }

  // 处理打印
  const handlePrint = () => {
    console.log('打印表格')
    // 调用打印功能
  }
</script>
