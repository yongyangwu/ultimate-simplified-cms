import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import type { DefaultRow } from "element-plus/es/components/table/src/table/defaults";
import type { VNodeChild } from "vue";

export interface UltimateTableProps {
    columns?: ColumnProps[] // 列配置
    data?: any[] // 静态表格数据（如果传了 data，则不使用 requestApi）
    requestApi?: (params: any) => Promise<any> // 请求表格数据的 API
    requestAuto?: boolean // 是否自动执行请求（默认 true）
    dataCallback?: (data: any) => any // 数据处理回调
    requestMapping?: RequestMapping // 请求参数字段映射，默认 { pageNo: 'pageNo', pageSize: 'pageSize' }
    responseMapping?: ResponseMapping // 响应数据字段映射，默认 { list: 'data', total: 'total' }
    initParam?: Record<string, any> // 初始化请求参数
    tableProps?: Record<string, any> // Element Plus Table 原生属性
    paginationProps?: Record<string, any> // Element Plus Pagination 原生属性
}

// 响应数据字段映射配置
export interface ResponseMapping {
    list?: string;  // 列表数据字段路径，支持链式访问，如 'data.list'，默认 'data'
    total?: string; // 总条数字段路径，支持链式访问，如 'data.total'，默认 'total'
}

// 请求参数字段映射配置
export interface RequestMapping {
    pageNo?: string;   // 页码字段名，默认 'pageNo'
    pageSize?: string; // 每页条数字段名，默认 'pageSize'
}
export type RenderScope<T extends DefaultRow = any> = {
    row: T;
    $index: number;
    column: TableColumnCtx<T>;
    [key: string]: any;
};

export interface ColumnProps<T extends DefaultRow = any>
    extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader">> {
    isShow?: boolean; // 是否显示在表格当中（默认为 true）
    search?: SearchProps; // 搜索项配置
    render?: (scope: RenderScope<T>) => VNodeChild; // 自定义单元格内容渲染（tsx语法）
}
// 响应式断点类型
export type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

export type SearchProps = {
    el?: SearchType; // 当前项搜索框的类型
    props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
    key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
    order?: number; // 搜索项排序（从大到小）
    options?: Array<{ label: string; value: string | number }>; // 静态选项数据（用于 select 等组件）
    optionsApi?: (params?: Record<string, any>) => Promise<Array<{ label: string; value: string | number }>>; // 异步获取选项的 API 方法（可接收参数）
    linkage?: string[]; // 联动依赖的字段（当这些字段变化时，重新加载选项）
    defaultValue?: any; // 搜索项默认值
    span?: number | Partial<Record<BreakPoint, number>>; // 栅格占据的列数，支持响应式配置 { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    elProps?: Record<string, any>; // Element Plus 原生组件属性，会透传给对应的表单组件（如 el-input、el-select 等）
    render?: (scope: { searchParam: Record<string, any>; item: ColumnProps }) => VNodeChild; // 自定义搜索内容渲染（tsx语法）
};
export type SearchType =
    | "el-input" // 文本框
    | "el-input-number" // 数字输入框
    | "el-select" // 下拉选择框
    | "el-select-v2" // 下拉选择框v2
    | "el-tree-select" // 树形选择器
    | "el-cascader" // 级联选择器
    | "el-date-picker" // 日期选择器
    | "el-time-picker" // 时间选择器
    | "el-time-select" // 时间选择框
    | "el-switch" // 开关
    | "el-slider"; // 滑块
