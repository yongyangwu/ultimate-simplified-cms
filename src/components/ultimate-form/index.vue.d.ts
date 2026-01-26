import type { FormInstance } from 'element-plus';
import type { FormItemProps } from './type';
type __VLS_Props = {
    columns: FormItemProps[];
    disabled?: boolean;
};
type __VLS_ModelProps = {
    'model': Record<string, any>;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare var __VLS_28: string, __VLS_29: {
    row: FormItemProps;
    form: Record<string, any>;
};
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_28>]?: (props: typeof __VLS_29) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_PublicProps, {
    element: import("vue").Ref<FormInstance | undefined, FormInstance | undefined>;
    validate: (callback?: any) => import("element-plus").FormValidationResult | undefined;
    resetFields: () => void | undefined;
    clearValidate: (props?: string | string[]) => void | undefined;
    scrollToField: (prop: string) => void | undefined;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:model": (value: Record<string, any>) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:model"?: ((value: Record<string, any>) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
