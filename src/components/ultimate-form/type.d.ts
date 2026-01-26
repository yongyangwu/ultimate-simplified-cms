import type { FormItemRule } from 'element-plus';
import type { VNode } from 'vue';
export interface FormOption {
    label: string;
    value: any;
    disabled?: boolean;
    children?: FormOption[];
}
export type FormType = 'el-input' | 'el-input-number' | 'el-select' | 'el-select-v2' | 'el-tree-select' | 'el-cascader' | 'el-date-picker' | 'el-time-picker' | 'el-time-select' | 'el-switch' | 'el-slider' | 'el-radio-group' | 'el-checkbox-group' | 'el-rate' | 'el-color-picker' | 'el-transfer' | 'slot';
export interface FormItemProps {
    prop: string;
    label: string;
    el?: FormType;
    props?: any;
    rules?: FormItemRule[];
    labelWidth?: string | number;
    defaultValue?: any;
    col?: {
        span?: number;
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        offset?: number;
        push?: number;
        pull?: number;
    };
    options?: FormOption[];
    fieldNames?: {
        label: string;
        value: string;
        children?: string;
    };
    slotName?: string;
    render?: (scope: {
        formModel: any;
        item: FormItemProps;
    }) => VNode;
    isShow?: (formModel: any) => boolean;
}
