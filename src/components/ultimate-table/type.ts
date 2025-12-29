import type { TableColumnCtx } from "element-plus/es/components/table/src/table-column/defaults";
import type { DefaultRow } from "element-plus/es/components/table/src/table/defaults";

export interface ProTableProps {
    columns: ColumnProps[]; // 列配置项  ==> 必传
    // data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
    // requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
    // requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
    // requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
    // dataCallback?: Table.DataCallBack; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
    // title?: string; // 表格标题，目前只在打印的时候用到 ==> 非必传
    // // pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
    // pagination?: PaginationConfig | boolean;
    initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
    // border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
    // toolButton?: ToolButtonConfig; // 是否显示表格功能按钮 ==> 非必传（默认为true）
    // rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
    // searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

export interface ColumnProps<T extends DefaultRow = any>
    extends Partial<Omit<TableColumnCtx<T>, "children" | "renderCell" | "renderHeader" | "type">> {
    type?: TypeProps;
    // tag?: boolean; // 是否是标签展示
    // isShow?: boolean | Ref<boolean>; // 是否显示在表格当中
    search?: SearchProps; // 搜索项配置
    tableColumn?: any;
    // enum?: EnumProps[] | ((params?: any) => Promise<any>) | Ref<EnumProps[]>; // 枚举类型（字典）
    // isFilterEnum?: boolean; // 当前单元格值是否根据 enum 格式化（示例：enum 只作为搜索项数据）
    // fieldNames?: FieldNamesProps; // 指定 label && value && children 的 key 值
    // headerRender?: (scope: HeaderRenderScope<T>) => VNodeChild; // 自定义表头内容渲染（tsx语法）
    // render?: (scope: RenderScope<T>) => VNodeChild; // 自定义单元格内容渲染（tsx语法）
    // _children?: ColumnProps<T>[]; // 多级表头
    // tip?: (() => VNodeChild) | string; // 表头提示
}
export type TypeProps = "index" | "selection" | "expand" | "drag";

// 响应式断点类型
export type BreakPoint = "xs" | "sm" | "md" | "lg" | "xl";

export type SearchProps = {
    el?: SearchType; // 当前项搜索框的类型
    props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
    key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
    order?: number; // 搜索项排序（从大到小）
    placeholder?: string; // 占位符文本
    options?: Array<{ label: string; value: string | number }>; // 静态选项数据（用于 select 等组件）
    optionsApi?: (params?: Record<string, any>) => Promise<Array<{ label: string; value: string | number }>>; // 异步获取选项的 API 方法（可接收参数）
    linkage?: string[]; // 联动依赖的字段（当这些字段变化时，重新加载选项）
    defaultValue?: any; // 搜索项默认值
    span?: number | Partial<Record<BreakPoint, number>>; // 栅格占据的列数，支持响应式配置 { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    // offset?: number | Record<BreakPoint, number>; // 搜索字段左侧偏移列数
    // tip?: (() => VNodeChild) | string; // 搜索项提示文字
    // render?: (scope: SearchRenderScope) => VNodeChild; // 自定义搜索内容渲染（tsx语法）
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
