<template>
  <el-dialog
    v-model="visible"
    :title="title"
    width="600px"
    destroy-on-close
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="props.labelWidth"
    >
      <el-row :gutter="20">
        <template v-for="item in formConfig" :key="item.prop">
          <el-col
            v-if="
              typeof item.isShow === 'function'
                ? item.isShow(formData)
                : item.isShow !== false
            "
            :span="item.span || 24"
          >
            <el-form-item :label="item.label" :prop="item.prop">
              <component
                :is="item.component"
                v-model="formData[item.prop]"
                v-bind="
                  typeof item.props === 'function'
                    ? item.props(formData)
                    : item.props
                "
                :disabled="
                  mode === 'view' ||
                  (typeof item.props === 'function'
                    ? item.props(formData).disabled
                    : item.props?.disabled)
                "
                style="width: 100%"
              >
                <template v-if="item.options" #default>
                  <component
                    :is="item.optionComponent"
                    v-for="opt in item.options"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </template>
              </component>
              <div
                v-if="item.tip"
                class="el-form-item__error"
                style="
                  position: static;
                  color: #999;
                  font-size: 12px;
                  line-height: 1.5;
                  padding-top: 4px;
                "
              >
                {{ item.tip }}
              </div>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{
          mode === 'view' ? '关闭' : '取消'
        }}</el-button>
        <el-button v-if="mode !== 'view'" type="primary" @click="handleSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'

  interface FormConfigItem {
    label: string
    prop: string
    component: string
    props?: Record<string, any>
    span?: number
    options?: { label: string; value: any }[]
    optionComponent?: string
    defaultValue?: any
    tip?: string
    isShow?: boolean | ((formData: any) => boolean)
  }

  interface Props {
    formConfig: FormConfigItem[]
    formRules?: Record<string, any>
    initialData?: Record<string, any>
    labelWidth?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    formConfig: () => [],
    formRules: () => ({}),
    initialData: () => ({}),
    labelWidth: '120px',
  })

  const visible = ref(false)
  const mode = ref<'add' | 'edit' | 'view'>('add')
  const title = ref('新增菜单')
  const formRef = ref()

  // 表单数据
  const formData = reactive<Record<string, any>>({})

  // 初始化表单
  const resetForm = () => {
    // 清空数据
    Object.keys(formData).forEach((key) => {
      delete formData[key]
    })
    // 设置初始值
    if (props.initialData) {
      Object.assign(formData, JSON.parse(JSON.stringify(props.initialData)))
    }
    // 确保所有字段都有默认值，避免 undefined
    props.formConfig.forEach((item) => {
      if (formData[item.prop] === undefined) {
        if (item.defaultValue !== undefined) {
          formData[item.prop] = item.defaultValue
        } else {
          formData[item.prop] = item.component === 'el-switch' ? false : ''
          if (item.component === 'el-input-number') formData[item.prop] = 0
        }
      }
    })

    if (formRef.value) {
      formRef.value.resetFields()
    }
  }

  // 监听 initialData 变化
  watch(
    () => props.initialData,
    () => {
      if (!visible.value) resetForm()
    },
    { deep: true, immediate: true }
  )

  const emit = defineEmits(['submit'])

  // 暴露给父组件的方法
  const open = (type: 'add' | 'edit' | 'view' = 'add', row?: any) => {
    visible.value = true
    mode.value = type
    title.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '查看'
    if ((type === 'edit' || type === 'view') && row) {
      Object.assign(formData, row)
    } else {
      resetForm()
    }
  }

  const close = () => {
    visible.value = false
  }

  const handleClosed = () => {
    resetForm()
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate((valid: boolean) => {
      if (valid) {
        emit('submit', { ...formData })
      }
    })
  }

  defineExpose({
    open,
    close,
  })
  onMounted(() => {
    // alert(88)
  })
</script>
