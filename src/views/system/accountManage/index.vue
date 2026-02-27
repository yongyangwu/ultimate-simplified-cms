<template>
  <div class="account-manage">
    <ultimate-table
      ref="tableRef"
      :columns="columns"
      :request-api="getUserListApi"
      :responseMapping="{ list: 'data', total: 'total' }"
      :dataCallback="handleDataCallback"
      :showToolButtonList="['add', 'export']"
      @add="handleAdd"
      @export="handleExport"
    >
      <template #operation="{ row, $index }">
        <el-button type="primary" link size="small" @click="handleView(row)">
          查看
        </el-button>
        <el-button type="primary" link size="small" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button
          type="danger"
          link
          size="small"
          @click="handleDelete(row, $index)"
        >
          删除
        </el-button>
      </template>
    </ultimate-table>
    <el-dialog v-model="dialogVisible" title="新增用户" width="520px">
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-width="90px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formModel.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formModel.gender" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number v-model="formModel.age" :min="1" :max="120" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formModel.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formModel.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formModel.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, nextTick } from 'vue'
  import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
  import UltimateTable from '@/components/ultimate-table/index.vue'
  import type { ColumnProps } from '@/components/ultimate-table/type'
  import { getUserListApi } from '@/api/modules/system/index'

  const tableRef = ref<any>(null)
  const dialogVisible = ref(false)
  const formRef = ref<FormInstance>()
  const extraUsers = ref<any[]>([])
  const formModel = reactive({
    name: '',
    gender: 1,
    age: 18,
    email: '',
    phone: '',
    status: 1,
  })

  const formRules: FormRules = {
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
    ],
    phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }],
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
      width: 120,
      search: {
        el: 'el-input',
        elProps: { placeholder: '请输入姓名' },
      },
    },
    {
      label: '性别',
      prop: 'gender',
      width: 90,
      search: {
        el: 'el-select',
        elProps: { placeholder: '请选择性别', clearable: true },
        options: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
      },
    },
    {
      label: '年龄',
      prop: 'age',
      width: 90,
    },
    {
      label: '邮箱',
      prop: 'email',
      minWidth: 180,
    },
    {
      label: '手机号',
      prop: 'phone',
      minWidth: 140,
    },
    {
      label: '状态',
      prop: 'status',
      width: 90,
      search: {
        el: 'el-select',
        elProps: { placeholder: '请选择状态', clearable: true },
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      label: '创建时间',
      prop: 'createTime',
      minWidth: 160,
    },
    {
      label: '操作',
      prop: 'operation',
      width: 180,
      fixed: 'right',
    },
  ])

  const handleDataCallback = (data: any) => {
    const list = Array.isArray(data?.data) ? data.data : []
    const merged = [...list, ...extraUsers.value]
    return {
      data: merged,
      total: merged.length,
    }
  }

  const handleAdd = () => {
    dialogVisible.value = true
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  const handleExport = () => {
    ElMessage.success('已触发导出')
  }

  const handleView = (row: any) => {
    ElMessage.info(`查看：${row.name}`)
  }

  const handleEdit = (row: any) => {
    ElMessage.info(`编辑：${row.name}`)
  }

  const handleDelete = (row: any, _index: number) => {
    ElMessage.warning(`删除：${row.name}`)
  }

  const handleCancel = () => {
    dialogVisible.value = false
  }

  const formatDateTime = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const mi = pad(date.getMinutes())
    const ss = pad(date.getSeconds())
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid) => {
      if (!valid) return
      const currentList = tableRef.value?.tableData?.value ?? []
      const maxId = currentList.reduce(
        (max: number, item: any) => Math.max(max, Number(item.id) || 0),
        0
      )
      const newUser = {
        id: maxId + 1,
        ...formModel,
        createTime: formatDateTime(new Date()),
      }
      extraUsers.value = [newUser, ...extraUsers.value]
      dialogVisible.value = false
      ElMessage.success('新增成功')
      tableRef.value?.getTableData()
    })
  }
</script>
