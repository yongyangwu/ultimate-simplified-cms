import type { FormItemRule } from 'element-plus'
import type { VNode } from 'vue'

export interface FormOption {
    label: string
    value: any
    disabled?: boolean
    children?: FormOption[] // For cascader or grouped options
}

export type FormType =
    | 'el-input'
    | 'el-input-number'
    | 'el-select'
    | 'el-select-v2'
    | 'el-tree-select'
    | 'el-cascader'
    | 'el-date-picker'
    | 'el-time-picker'
    | 'el-time-select'
    | 'el-switch'
    | 'el-slider'
    | 'el-radio-group'
    | 'el-checkbox-group'
    | 'el-rate'
    | 'el-color-picker'
    | 'el-transfer'
    | 'slot' // Custom slot

export interface FormItemProps {
    prop: string // 字段名
    label: string // 标签
    el?: FormType // 组件类型
    props?: any // 组件属性 (placeholder, clearable, disabled, etc.)
    rules?: FormItemRule[] // 验证规则
    labelWidth?: string | number // 标签宽度
    defaultValue?: any // 默认值

    // 栅格布局配置
    col?: {
        span?: number
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
        offset?: number
        push?: number
        pull?: number
    }

    // 选项数据 (用于 select, radio, checkbox, cascader 等)
    options?: FormOption[]
    // 选项字段映射 (自定义 label/value 字段名)
    fieldNames?: { label: string; value: string; children?: string }

    // 自定义插槽/渲染
    slotName?: string // 插槽名称
    render?: (scope: { formModel: any; item: FormItemProps }) => VNode

    // 显隐逻辑
    isShow?: (formModel: any) => boolean
}
