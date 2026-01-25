<template>
  <el-form
    ref="formRef"
    :model="model"
    v-bind="$attrs"
    :disabled="disabled"
    class="ultimate-form"
  >
    <el-row :gutter="20">
      <template v-for="item in columns" :key="item.prop">
        <el-col
          v-if="!item.isShow || item.isShow(model)"
          v-bind="item.col || { span: 24 }"
        >
          <el-form-item
            :label="item.label"
            :prop="item.prop"
            :rules="item.rules"
            :label-width="item.labelWidth"
          >
            <!-- Custom Slot -->
            <slot
              v-if="item.slotName"
              :name="item.slotName"
              :row="item"
              :form="model"
            ></slot>

            <!-- Custom Render Function -->
            <component
              v-else-if="item.render"
              :is="item.render"
              :form-model="model"
              :item="item"
            />

            <!-- Standard Element Plus Components -->
            <component
              v-else
              :is="item.el"
              v-model="model[item.prop]"
              v-bind="item.props"
              :placeholder="
                item.props?.placeholder ||
                (item.el?.includes('input')
                  ? '请输入' + item.label
                  : '请选择' + item.label)
              "
              :clearable="item.props?.clearable ?? true"
            >
              <!-- Select Options -->
              <template
                v-if="item.el === 'el-select' || item.el === 'el-select-v2'"
              >
                <el-option
                  v-for="opt in item.options"
                  :key="(opt as any)[item.fieldNames?.value || 'value']"
                  :label="(opt as any)[item.fieldNames?.label || 'label']"
                  :value="(opt as any)[item.fieldNames?.value || 'value']"
                  :disabled="opt.disabled"
                />
              </template>

              <!-- Radio Group Options -->
              <template v-if="item.el === 'el-radio-group'">
                <el-radio
                  v-for="opt in item.options"
                  :key="(opt as any)[item.fieldNames?.value || 'value']"
                  :value="(opt as any)[item.fieldNames?.value || 'value']"
                  :disabled="opt.disabled"
                >
                  {{ (opt as any)[item.fieldNames?.label || 'label'] }}
                </el-radio>
              </template>

              <!-- Checkbox Group Options -->
              <template v-if="item.el === 'el-checkbox-group'">
                <el-checkbox
                  v-for="opt in item.options"
                  :key="(opt as any)[item.fieldNames?.value || 'value']"
                  :value="(opt as any)[item.fieldNames?.value || 'value']"
                  :disabled="opt.disabled"
                >
                  {{ (opt as any)[item.fieldNames?.label || 'label'] }}
                </el-checkbox>
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
      <el-col v-if="showFooter" :span="24">
        <el-form-item>
          <slot
            name="footer"
            :loading="loading"
            :submit="onSubmit"
            :cancel="onCancel"
          >
            <el-button type="primary" :loading="loading" @click="onSubmit">
              {{ submitButtonText }}
            </el-button>
            <el-button @click="onCancel">
              {{ cancelButtonText }}
            </el-button>
          </slot>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { FormInstance } from 'element-plus'
  import type { FormItemProps } from './type'

  defineOptions({ name: 'UltimateForm' })

  // 使用 defineModel 实现双向绑定
  const model = defineModel<Record<string, any>>('model', { required: true })

  const props = withDefaults(
    defineProps<{
      columns: FormItemProps[] // 表单配置列
      disabled?: boolean // 是否禁用整个表单
      isEdit?: boolean // 是否处于编辑模式
      loading?: boolean // 提交按钮loading状态
      showFooter?: boolean // 是否显示底部按钮区域
      submitText?: string // 自定义提交按钮文字
      cancelText?: string // 自定义取消按钮文字
    }>(),
    {
      showFooter: true,
      isEdit: false,
      loading: false,
    }
  )

  const emit = defineEmits(['submit', 'cancel'])

  // Expose form methods
  const formRef = ref<FormInstance>()
  const validate = (callback?: any) => formRef.value?.validate(callback)
  const resetFields = () => formRef.value?.resetFields()
  const clearValidate = (props?: string | string[]) =>
    formRef.value?.clearValidate(props)
  const scrollToField = (prop: string) => formRef.value?.scrollToField(prop)

  const submitButtonText = computed(() => {
    if (props.submitText) return props.submitText
    return props.isEdit ? '更新' : '新增'
  })

  const cancelButtonText = computed(() => {
    return props.cancelText || '取消'
  })

  const onSubmit = () => {
    // 自动校验
    validate((valid: boolean) => {
      if (valid) {
        emit('submit', model.value)
      }
    })
  }

  const onCancel = () => {
    emit('cancel')
  }

  defineExpose({
    element: formRef,
    validate,
    resetFields,
    clearValidate,
    scrollToField,
  })
</script>
