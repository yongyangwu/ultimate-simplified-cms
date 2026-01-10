# UltimateTable 使用手册

## 简介

`UltimateTable` 是一个基于 Element Plus 的企业级表格组件，提供了开箱即用的搜索、分页、操作列等功能。通过简单的配置即可实现复杂的表格需求。

## 特性

- ✅ 动态列配置，支持选择列、索引列、展开列、操作列
- ✅ 搜索表单自动渲染，支持多种表单类型
- ✅ 异步选项加载，支持联动搜索
- ✅ 响应式布局，自动折叠搜索表单
- ✅ 内置请求管理，自动处理分页和搜索参数
- ✅ 灵活的数据字段映射，适配不同后端格式
- ✅ 插槽扩展，支持自定义表头按钮、操作列、列内容
- ✅ Loading 状态管理
- ✅ 列显示/隐藏控制

---

## 快速开始

### 基础用法

```html
<template>
  <ultimate-table :columns="columns" :request-api="getUserListApi" />
</template>

<script setup lang="ts">
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'

  const columns: ColumnProps[] = [
    { type: 'selection', width: 55 },
    { type: 'index', label: '序号', width: 60 },
    { label: '姓名', prop: 'name' },
    { label: '年龄', prop: 'age' },
  ]

  const getUserListApi = async (params: any) => {
    // 发起 API 请求
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return res.json()
  }
</script>
```

---

## 目录

- [UltimateTableProps 配置](#UltimateTableProps-配置)

- [ColumnProps 配置](#columnprops-配置)
  - [基础配置](#基础配置)
  - [特殊列类型](#特殊列类型)
- [搜索配置 SearchProps](#搜索配置-searchprops)
  - [SearchType 支持的表单类型](#searchtype-支持的表单类型)
  - [搜索配置示例](#搜索配置示例)
- [Events 事件](#events-事件)
- [Slots 插槽](#slots-插槽)
- [完整示例](#完整示例)
- [Expose 暴露的方法](#expose-暴露的方法)
- [常见问题](#常见问题)

---

## UltimateTableProps

<!-- prettier-ignore-start -->
| 参数                         | 说明 | 类型 | 默认值 |
| :--------------------------- | :--- | :--- | :----- |
| <div style="white-space: nowrap;">`columns`</div> | 列配置数组 | [`ColumnProps[]`](#columnprops-配置) | `[]` |
| <div style="white-space: nowrap;">`data`</div> | 静态表格数据（传入后不使用 requestApi） | `any[]` | `undefined` |
| <div style="white-space: nowrap;">`requestApi`</div> | 请求表格数据的 API 方法 | `(params: any) => Promise<any>` | `undefined` |
| <div style="white-space: nowrap;">`requestAuto`</div> | 是否自动执行请求 | `boolean` | `true` |
| <div style="white-space: nowrap;">`dataCallback`</div> | 数据处理回调函数 | `(data: any) => any` | `undefined` |
| <div style="white-space: nowrap;">`responseMapping`</div> | 响应数据字段映射 | [`ResponseMapping`](#responsemapping) | `{ list: 'data', total: 'total' }` |
| <div style="white-space: nowrap;">`requestMapping`</div> | 请求参数字段映射 | [`RequestMapping`](#requestmapping) | `{ pageNo: 'pageNo', pageSize: 'pageSize' }` |
| <div style="white-space: nowrap;">`initParam`</div> | 初始化请求参数 | `Record<string, any>` | `{}` |
| <div style="white-space: nowrap;">`tableProps`</div> | Element Plus Table 原生属性 | `Record<string, any>` | `{}` |
| <div style="white-space: nowrap;">`paginationProps`</div> | Element Plus Pagination 原生属性 | `Record<string, any>` | `{}` |
<!-- prettier-ignore-end -->

### ColumnProps 配置

`ColumnProps` 包含了 `ElTableColumn` 中除 `children`、`renderCell`、`renderHeader`、`type` 外所有的属性，参考 [Table-column 属性](https://element-plus.org/zh-CN/component/table.html#table-column-%E5%B1%9E%E6%80%A7)。

#### 基础配置

| 参数                  | 说明             | 类型                                                | 默认值   |
| --------------------- | ---------------- | --------------------------------------------------- | -------- |
| `isShow`              | 是否显示列       | `boolean`                                           | `true`   |
| `search`              | 搜索配置         | [`SearchProps`](#搜索配置-searchprops)              | -        |

#### 使用说明

**1. 选择列**

```typescript
{ type: 'selection', width: 55, fixed: 'left' }
```

**2. 索引列**

```typescript
{ type: 'index', label: '序号', width: 60 }
```

**3. 正常列**

```typescript
{
  label: '姓名',
  prop: 'name', 
  width: 180,
}
```

**4. 自定义渲染列（使用 render 函数）**

```typescript
{
  label: '状态',
  prop: 'status',
  render: ({ row }) => {
    return (
      <el-tag type={row.status === 1 ? 'success' : 'danger'}>
        {row.status === 1 ? '启用' : '禁用'}
      </el-tag>
    )
  }
}
```

**5. 操作列**

```typescript
{
  label: '操作',
  prop: 'operation',  // 必须设置为 'operation'
  width: 180,
  fixed: 'right'
}
```
### data

表格数据，优先级要高于request-api
### requestApi

数据源
### requestAuto

是否在组件加载后自动执行请求（request-api）
### dataCallback

返回数据的回调函数，可以对数据进行处理
### RequestMapping

用于映射请求参数的字段名：

```typescript
interface RequestMapping {
  pageNo?: string // 页码字段名，默认 'pageNo'
  pageSize?: string // 每页条数字段名，默认 'pageSize'
}
```

**示例：**

```typescript
// 后端要求：{ page: 1, size: 10 }
:request-mapping="{ pageNo: 'page', pageSize: 'size' }"
```

### ResponseMapping

用于映射后端返回的数据字段：

```typescript
interface ResponseMapping {
  list?: string // 列表数据字段路径，默认 'data'
  total?: string // 总条数字段路径，默认 'total'
}
```

**示例：**

```typescript
// 后端返回格式：{ result: { records: [], count: 100 } }
:response-mapping="{ list: 'result.records', total: 'result.count' }"
```


---

---

## 搜索配置 SearchProps

| 参数           | 说明                               | 类型                                            | 默认值                                    |
| -------------- | ---------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| `el`           | 表单组件类型                       | `SearchType`                                    | `'el-input'`                              |
| `key`          | 搜索参数键名（不同于 prop 时使用） | `string`                                        | -                                         |
| `order`        | 搜索项排序（数值越小越靠前）       | `number`                                        | -                                         |
| `placeholder`  | 占位符文本                         | `string`                                        | -                                         |
| `defaultValue` | 默认值                             | `any`                                           | -                                         |
| `options`      | 静态选项数据                       | `Array<{label: string, value: string\|number}>` | -                                         |
| `optionsApi`   | 异步获取选项的 API                 | `(params?) => Promise<Array<{label, value}>>`   | -                                         |
| `linkage`      | 联动依赖的字段                     | `string[]`                                      | -                                         |
| `span`         | 栅格占据列数                       | `number \| Partial<Record<BreakPoint, number>>` | `{ xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }` |
| `elProps`      | Element Plus 组件原生属性          | `Record<string, any>`                           | -                                         |
| `props`        | 搜索项参数（向后兼容）             | `any`                                           | -                                         |

### SearchType 支持的表单类型

```typescript
type SearchType =
  | 'el-input' // 文本框
  | 'el-input-number' // 数字输入框
  | 'el-select' // 下拉选择框
  | 'el-select-v2' // 下拉选择框 v2
  | 'el-tree-select' // 树形选择器
  | 'el-cascader' // 级联选择器
  | 'el-date-picker' // 日期选择器
  | 'el-time-picker' // 时间选择器
  | 'el-time-select' // 时间选择框
  | 'el-switch' // 开关
  | 'el-slider' // 滑块
```

### 搜索配置示例

#### 1. 基础输入框

```typescript
{
  label: '姓名',
  prop: 'name',
  search: {
    el: 'el-input',
    order: 1,
    elProps: {
      placeholder: '请输入姓名',
      clearable: true,
      maxlength: 20
    }
  }
}
```

#### 2. 静态下拉选择

```typescript
{
  label: '性别',
  prop: 'gender',
  search: {
    el: 'el-select',
    order: 2,
    options: [
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ],
    elProps: {
      placeholder: '请选择性别',
      clearable: true
    }
  }
}
```

#### 3. 异步选项加载

```typescript
{
  label: '部门',
  prop: 'department',
  search: {
    el: 'el-select',
    order: 3,
    optionsApi: async () => {
      const res = await fetch('/api/departments')
      return res.json()
    },
    defaultValue: 1,
    elProps: {
      placeholder: '请选择部门',
      filterable: true
    }
  }
}
```

#### 4. 联动搜索

```typescript
// 父级选择
{
  label: '省份',
  prop: 'province',
  search: {
    el: 'el-select',
    order: 1,
    optionsApi: fetchProvinces,
    defaultValue: 1,
    elProps: {
      placeholder: '请选择省份'
    }
  }
},
// 子级联动
{
  label: '城市',
  prop: 'city',
  search: {
    el: 'el-select',
    order: 2,
    optionsApi: async (params) => {
      // params 会接收到 { province: 1 }
      const res = await fetch(`/api/cities?province=${params.province}`)
      return res.json()
    },
    linkage: ['province'], // 依赖 province 字段
    elProps: {
      placeholder: '请先选择省份'
    }
  }
}
```

#### 5. 日期选择

```typescript
{
  label: '创建时间',
  prop: 'createTime',
  search: {
    el: 'el-date-picker',
    order: 4,
    elProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD'
    }
  }
}
```

---

## Events 事件

| 事件名         | 说明             | 回调参数              |
| -------------- | ---------------- | --------------------- |
| `add`          | 点击新增按钮     | -                     |
| `batch-delete` | 点击批量删除按钮 | `selectedRows: any[]` |
| `export`       | 点击导出按钮     | -                     |

**使用示例：**

```vue
<ultimate-table
  :columns="columns"
  :request-api="getUserListApi"
  @add="handleAdd"
  @batch-delete="handleBatchDelete"
  @export="handleExport"
/>
```

---

## Slots 插槽

### 1. tableHeader 插槽

完全自定义左侧按钮区域（会替换默认的新增、批量删除、导出按钮）。

```vue
<template #tableHeader="{ selectedRows }">
  <el-button type="success" @click="handleCustomAction"> 自定义按钮 </el-button>
</template>
```

### 2. tableHeaderExtra 插槽

在默认按钮后面追加额外按钮。

```vue
<template #tableHeaderExtra="{ selectedRows }">
  <el-button @click="handleImport">
    <el-icon><Upload /></el-icon>
    导入
  </el-button>
</template>
```

### 3. operation 插槽

自定义操作列内容，可获取当前行数据。

```vue
<template #operation="{ row, $index }">
  <el-button type="primary" link size="small" @click="handleView(row)">
    查看
  </el-button>
  <el-button type="primary" link size="small" @click="handleEdit(row)">
    编辑
  </el-button>
  <el-button type="danger" link size="small" @click="handleDelete(row)">
    删除
  </el-button>
</template>
```

### 4. 自定义列插槽

通过列的 `prop` 作为插槽名自定义列内容。

```vue
<template #status="{ row, $index }">
  <el-tag :type="row.status === 1 ? 'success' : 'danger'">
    {{ row.status === 1 ? '启用' : '禁用' }}
  </el-tag>
</template>
```

---

## 完整示例

```vue
<template>
  <ultimate-table
    :columns="columns"
    :request-api="getUserListApi"
    :table-props="tableProps"
    :pagination-props="paginationProps"
    :init-param="{ status: 1 }"
    :response-mapping="{ list: 'data', total: 'total' }"
    @add="handleAdd"
    @batch-delete="handleBatchDelete"
    @export="handleExport"
  >
    <!-- 额外按钮 -->
    <template #tableHeaderExtra="{ selectedRows }">
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
    </template>

    <!-- 操作列 -->
    <template #operation="{ row }">
      <el-button type="primary" link size="small" @click="handleEdit(row)">
        编辑
      </el-button>
      <el-button type="danger" link size="small" @click="handleDelete(row)">
        删除
      </el-button>
    </template>

    <!-- 自定义状态列 -->
    <template #status="{ row }">
      <el-tag :type="row.status === 1 ? 'success' : 'danger'">
        {{ row.status === 1 ? '启用' : '禁用' }}
      </el-tag>
    </template>
  </ultimate-table>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'
  import { getUserListApi } from '@/api/modules/system'

  // 表格配置
  const tableProps = reactive({
    border: true,
    highlightCurrentRow: true,
  })

  // 分页配置
  const paginationProps = reactive({
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper',
    background: true,
  })

  // 异步获取部门列表
  const fetchDepartments = async () => {
    const res = await fetch('/api/departments')
    return res.json()
  }

  // 列配置
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
        el: 'el-input',
        order: 1,
        elProps: {
          placeholder: '请输入姓名',
          clearable: true,
        },
      },
    },
    {
      label: '性别',
      prop: 'gender',
      search: {
        el: 'el-select',
        order: 2,
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        elProps: {
          placeholder: '请选择性别',
          clearable: true,
        },
      },
    },
    {
      label: '部门',
      prop: 'department',
      search: {
        el: 'el-select',
        order: 3,
        optionsApi: fetchDepartments,
        elProps: {
          placeholder: '请选择部门',
          filterable: true,
        },
      },
    },
    {
      label: '状态',
      prop: 'status',
    },
    {
      label: '操作',
      prop: 'operation',
      width: 180,
      fixed: 'right',
    },
  ])

  // 事件处理
  const handleAdd = () => {
    console.log('新增')
  }

  const handleBatchDelete = (selectedRows: any[]) => {
    console.log('批量删除：', selectedRows)
  }

  const handleExport = () => {
    console.log('导出')
  }

  const handleImport = () => {
    console.log('导入')
  }

  const handleEdit = (row: any) => {
    console.log('编辑：', row)
  }

  const handleDelete = (row: any) => {
    console.log('删除：', row)
  }
</script>
```

---

## Expose 暴露的方法

可以通过 `ref` 访问组件内部的方法和数据：

```vue
<template>
  <ultimate-table
    ref="tableRef"
    :columns="columns"
    :request-api="getUserListApi"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const tableRef = ref()

  // 手动刷新表格数据
  const refresh = () => {
    tableRef.value?.getTableData()
  }

  // 获取搜索参数
  const getSearchParams = () => {
    console.log(tableRef.value?.searchParam)
  }

  // 获取表格数据
  const getTableData = () => {
    console.log(tableRef.value?.tableData)
  }
</script>
```

---

## 常见问题

### 1. 后端返回的数据格式不是默认的 `{ data: [], total: 0 }`？

使用 `responseMapping` 配置：

```vue
<ultimate-table
  :columns="columns"
  :request-api="getUserListApi"
  :response-mapping="{ list: 'result.records', total: 'result.count' }"
/>
```

### 2. 后端要求的分页参数不是 `pageNo` 和 `pageSize`？

使用 `requestMapping` 配置：

```vue
<ultimate-table
  :columns="columns"
  :request-api="getUserListApi"
  :request-mapping="{ pageNo: 'page', pageSize: 'limit' }"
/>
```

### 3. 如何给所有请求添加固定参数？

使用 `initParam` 配置：

```vue
<ultimate-table
  :columns="columns"
  :request-api="getUserListApi"
  :init-param="{ tenantId: '123', status: 1 }"
/>
```

### 4. 如何隐藏某一列？

在列配置中设置 `isShow: false`：

```typescript
{
  label: '备注',
  prop: 'remark',
  isShow: false  // 默认隐藏，可在表格右上角设置中控制显示
}
```

### 5. 如何使用静态数据？

传入 `data` 属性，不使用 `requestApi`：

```vue
<ultimate-table :columns="columns" :data="staticTableData" />
```

### 6. 搜索表单如何自定义布局？

使用 `span` 配置项：

```typescript
{
  label: '姓名',
  prop: 'name',
  search: {
    el: 'el-input',
    span: { xs: 24, sm: 12, md: 8, lg: 6, xl: 4 }  // 响应式配置
  }
}
```

---

## 总结

`UltimateTable` 组件通过简洁的配置即可实现复杂的表格功能，主要特点：

1. **配置驱动**：通过 `columns` 配置即可生成表格和搜索表单
2. **自动请求管理**：无需手动处理分页和搜索参数
3. **灵活的字段映射**：适配各种后端数据格式
4. **响应式布局**：自动适配不同屏幕尺寸
5. **插槽扩展**：支持高度自定义

适用于后台管理系统中 90% 以上的表格场景。
