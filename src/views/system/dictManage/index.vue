<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Dynamic Form Examples</span>
      </div>
    </template>
    <UltimateForm
      v-model:model="formData"
      :columns="formColumns"
      label-width="120px"
    >
      <!-- Custom Slot Example -->
      <template #customSlot="{ row }">
        <el-input
          v-model="(formData as any)[row.prop]"
          placeholder="Custom Slot Input"
          style="width: 100%"
        >
          <template #prepend>Http://</template>
          <template #append>.com</template>
        </el-input>
      </template>
    </UltimateForm>

    <div style="margin-top: 20px; background: #f5f7fa; padding: 10px">
      <p>Form Data Preview:</p>
      <pre>{{ formData }}</pre>
    </div>
  </el-card>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import UltimateForm from '@/components/ultimate-form/index.vue'
  import type { FormItemProps } from '@/components/ultimate-form/type'

  const formData = reactive({
    name: '',
    role: '',
    age: 18,
    gender: '1',
    hobbies: ['1'],
    birthday: '',
    time: '',
    status: true,
    score: 3.5,
    progress: 50,
    custom: '',
  })

  const formColumns: FormItemProps[] = [
    // 1. Input
    {
      prop: 'name',
      label: 'Username',
      el: 'el-input',
      props: { placeholder: 'Enter username', clearable: true },
      rules: [{ required: true, message: 'Required' }],
      col: { span: 12, xs: 24 },
    },
    // 2. Select
    {
      prop: 'role',
      label: 'Role',
      el: 'el-select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest', disabled: true },
      ],
      props: { placeholder: 'Select Role' },
      col: { span: 12, xs: 24 },
    },
    // 3. Input Number
    {
      prop: 'age',
      label: 'Age',
      el: 'el-input-number',
      props: { min: 1, max: 100 },
      col: { span: 12, xs: 24 },
    },
    // 4. Date Picker
    {
      prop: 'birthday',
      label: 'Birthday',
      el: 'el-date-picker',
      props: {
        type: 'date',
        placeholder: 'Pick a date',
        valueFormat: 'YYYY-MM-DD',
      },
      col: { span: 12, xs: 24 },
    },
    // 5. Radio Group
    {
      prop: 'gender',
      label: 'Gender',
      el: 'el-radio-group',
      options: [
        { label: 'Male', value: '1' },
        { label: 'Female', value: '2' },
      ],
      col: { span: 12, xs: 24 },
    },
    // 6. Checkbox Group
    {
      prop: 'hobbies',
      label: 'Hobbies',
      el: 'el-checkbox-group',
      options: [
        { label: 'Coding', value: '1' },
        { label: 'Reading', value: '2' },
        { label: 'Gaming', value: '3' },
      ],
      col: { span: 12, xs: 24 },
    },
    // 7. Switch
    {
      prop: 'status',
      label: 'Status',
      el: 'el-switch',
      props: { activeText: 'Active', inactiveText: 'Inactive' },
      col: { span: 12, xs: 24 },
    },
    // 8. Rate
    {
      prop: 'score',
      label: 'Rate',
      el: 'el-rate',
      props: { allowHalf: true },
      col: { span: 12, xs: 24 },
    },
    // 9. Slider
    {
      prop: 'progress',
      label: 'Progress',
      el: 'el-slider',
      col: { span: 24 },
    },
    // 10. Custom Slot
    {
      prop: 'custom',
      label: 'Custom Slot',
      slotName: 'customSlot',
      col: { span: 24 },
    },
  ]
</script>
