<template>
  <el-card>
    <el-form :model="props.searchParam">
      <el-row :gutter="20">
        <!-- 搜索表单项 -->
        <el-col
          v-for="item in displayedSearchColumns"
          :key="item?.prop || ''"
          v-bind="item && getResponsiveSpan(item)"
        >
          <el-form-item v-if="item" :label="item.label" :prop="item.prop">
            <!-- 自定义渲染 -->
            <component
              v-if="item.search?.render"
              :is="
                item.search.render({
                  searchParam: props.searchParam,
                  item: item,
                })
              "
            />
            <!-- 默认渲染 -->
            <component
              v-else-if="item.prop && (item.search?.el || item.search)"
              :is="getAsyncComponent(item.search?.el)"
              v-model.trim="props.searchParam[item.search?.key || item.prop]"
              v-bind="{ ...item.search?.props, ...item.search?.elProps }"
              :placeholder="getPlaceholder(item)"
              :disabled="getDisabled(item)"
              @change="handleFieldChange(item)"
              style="width: 100%"
            >
              <!-- 为 el-select 动态渲染选项 -->
              <template
                v-if="item.search?.el === 'el-select' && getOptions(item)"
              >
                <el-option
                  v-for="(option, index) in getOptions(item)"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
        <!-- 操作按钮 - 智能定位到最右边 -->
        <el-col v-bind="buttonResponsiveSpan" :offset="buttonColOffset">
          <el-form-item label-width="0">
            <div
              style="
                display: flex;
                justify-content: flex-end;
                width: 100%;
                gap: 8px;
              "
            >
              <el-button type="primary" :icon="Search" @click="search">
                搜索
              </el-button>
              <el-button :icon="Delete" @click="reset">重置</el-button>
              <!-- 展开/折叠按钮 -->
              <el-button
                v-if="showCollapseButton"
                type="text"
                @click="toggleCollapse"
              >
                {{ collapsed ? '展开' : '折叠' }}
                <el-icon style="margin-left: 4px">
                  <component :is="collapsed ? ArrowDown : ArrowUp" />
                </el-icon>
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script setup lang="ts">
  import {
    defineAsyncComponent,
    computed,
    reactive,
    onMounted,
    onUnmounted,
    watch,
    ref,
    type Component,
  } from 'vue'
  import { Delete, Search, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
  import type {
    ColumnProps,
    SearchType,
    BreakPoint,
  } from '@/components/ultimate-table/type'

  interface SearchProps {
    columns?: ColumnProps[] // 搜索配置列
    searchParam?: { [key: string]: any } // 搜索参数
  }

  const props = withDefaults(defineProps<SearchProps>(), {
    columns: () => [],
    searchParam: () => ({}),
  })

  // 定义 emit
  const emit = defineEmits<{
    search: [searchParam: Record<string, any>]
    reset: []
    optionsLoaded: [] // 选项加载完成事件
  }>()

  // 折叠状态
  const collapsed = ref(true)

  // 响应式断点配置
  const breakpoints: Record<BreakPoint, number> = {
    xs: 0, // <768px
    sm: 768, // ≥768px
    md: 992, // ≥992px
    lg: 1200, // ≥1200px
    xl: 1920, // ≥1920px
  }

  // 获取当前屏幕断点
  const getBreakpoint = (width: number): BreakPoint => {
    if (width < breakpoints.sm) return 'xs'
    if (width < breakpoints.md) return 'sm'
    if (width < breakpoints.lg) return 'md'
    if (width < breakpoints.xl) return 'lg'
    return 'xl'
  }

  // 当前屏幕断点
  const breakpoint = ref<BreakPoint>(
    typeof window !== 'undefined' ? getBreakpoint(window.innerWidth) : 'xl'
  )

  // 监听窗口大小变化
  const handleResize = () => {
    breakpoint.value = getBreakpoint(window.innerWidth)
  }

  // 获取响应式 span 属性对象
  const getResponsiveSpan = (item: ColumnProps) => {
    const span = item.search?.span
    if (!span) {
      // 默认响应式配置
      return { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
    }

    if (typeof span === 'number') {
      // 如果是数字，转换为响应式配置
      return {
        xs: 24,
        sm: 12,
        md: span > 12 ? 24 : 12, // md 屏幕下最多两列
        lg: span,
        xl: span,
      }
    }
    // 如果是响应式对象，直接返回
    return span
  }

  // 获取响应式 span 值（用于计算折叠逻辑）
  const getItemSpan = (item: ColumnProps): number => {
    // 获取统一的响应式配置
    const responsiveSpan = getResponsiveSpan(item) as Partial<
      Record<BreakPoint, number>
    >
    const breakpointOrder: BreakPoint[] = ['xs', 'sm', 'md', 'lg', 'xl']
    const currentIndex = breakpointOrder.indexOf(breakpoint.value)
    // 从当前断点向下查找最近的配置值
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpointOrder[i]
      if (bp && responsiveSpan[bp] !== undefined) {
        return responsiveSpan[bp] as number
      }
    }
    // 如果没有找到，返回默认值 (理论上不会走到这里，因为 getResponsiveSpan 都有默认值)
    return 6
  }

  // 过滤并排序搜索列
  const searchColumns = computed(() => {
    return (
      props.columns
        // 过滤掉没有配置 search 或 search.el/render 的列
        ?.filter(
          (item) => item.search && (item.search.el || item.search.render)
        )
        // 根据 order 字段进行排序，order 越小越靠前，没有 order 的排在最后
        .sort((a, b) => {
          const orderA = a.search?.order ?? Infinity
          const orderB = b.search?.order ?? Infinity
          return orderA - orderB
        }) ?? []
    )
  })
  // 计算显示的搜索列（根据折叠状态）
  const displayedSearchColumns = computed(() => {
    if (!collapsed.value || !showCollapseButton.value) {
      // 展开状态或不需要折叠时，显示所有列
      return searchColumns.value
    }
    // 折叠状态：只显示第一行能放下的搜索项（需要为按钮预留空间）
    const columns = searchColumns.value
    const buttonSpan = getButtonSpan()
    let totalSpan = 0
    const firstRowColumns: ColumnProps[] = []
    // 小屏幕特殊处理：每个元素都是独占一行的，至少显示第一个搜索项
    if (breakpoint.value === 'xs') {
      return columns.length > 0 ? [columns[0]] : []
    }

    for (const column of columns) {
      const span = getItemSpan(column)
      // 确保当前项加上按钮后不超过 24
      if (totalSpan + span + buttonSpan <= 24) {
        firstRowColumns.push(column)
        totalSpan += span
      } else {
        break
      }
    }
    return firstRowColumns
  })

  // 获取按钮列宽度
  const getButtonSpan = (): number => {
    // 根据屏幕大小和是否有折叠按钮调整宽度
    const bp = breakpoint.value
    if (bp === 'xs') return 24 // 小屏幕按钮独占一行
    if (bp === 'sm') return showCollapseButton.value ? 12 : 8
    // 大屏幕固定使用 4 列
    return 4
  }

  // 按钮响应式 span
  const buttonResponsiveSpan = computed(() => {
    const bp = breakpoint.value
    if (bp === 'xs') {
      return { xs: 24 }
    }
    if (bp === 'sm') {
      return { sm: showCollapseButton.value ? 12 : 8 }
    }
    // 大屏幕固定使用 4 列
    return { span: 4 }
  })

  // 判断是否显示展开/折叠按钮
  const showCollapseButton = computed(() => {
    const columns = searchColumns.value
    if (columns.length === 0) return false

    // 小屏幕始终显示折叠按钮（当有多个搜索项时）
    if (breakpoint.value === 'xs') {
      return columns.length > 1
    }
    console.log('columns', columns)
    // 计算所有搜索项占用的总列数
    const totalSpan = columns.reduce((sum, item) => {
      return sum + getItemSpan(item)
    }, 0)

    // 计算按钮列需要的宽度
    const buttonSpan = getButtonSpan()

    // 判断是否需要折叠：搜索项 + 按钮超过一行
    return totalSpan + buttonSpan > 24
  })

  // 计算按钮列的 offset
  const buttonColOffset = computed(() => {
    // 小屏幕不需要 offset
    if (breakpoint.value === 'xs') return 0

    // 计算当前显示的搜索项占用的总列数
    const totalSpan = displayedSearchColumns.value.reduce((sum, item) => {
      return item ? sum + getItemSpan(item) : sum
    }, 0)

    const buttonSpan = getButtonSpan()

    // 如果没有搜索项，按钮靠右
    if (totalSpan === 0) {
      return 24 - buttonSpan
    }

    // 计算当前行已占用的列数（对 24 取余）
    let currentRowSpan = totalSpan % 24

    // 如果余数为 0，说明正好占满整行，按钮需要另起一行
    if (currentRowSpan === 0) {
      return 24 - buttonSpan
    }

    // 如果当前行 + 按钮列 <= 24，则计算 offset 使按钮靠右
    if (currentRowSpan + buttonSpan <= 24) {
      // offset = 24 - 当前行占用 - 按钮列宽度
      return 24 - currentRowSpan - buttonSpan
    }

    // 否则按钮另起一行，靠右对齐
    return 24 - buttonSpan
  })

  // 切换展开/折叠
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
  }

  // 存储异步加载的选项数据
  const asyncOptionsMap = reactive<
    Map<string, Array<{ label: string; value: string | number }>>
  >(new Map())

  // 存储字段加载状态
  const fieldLoadingMap = reactive(new Map<string, boolean>())

  const isLinkageLoading = (item: ColumnProps) => {
    const linkage = item.search?.linkage
    if (!linkage || linkage.length === 0) return false
    return linkage.some((linkProp) => fieldLoadingMap.get(linkProp))
  }

  // 获取 placeholder
  const getPlaceholder = (item: ColumnProps) => {
    if (
      (item.prop && fieldLoadingMap.get(item.prop)) ||
      isLinkageLoading(item)
    ) {
      return '加载中...'
    }
    return (
      item.search?.props?.placeholder ||
      item.search?.elProps?.placeholder ||
      '请选择'
    )
  }

  const getDisabled = (item: ColumnProps) => {
    const userDisabled =
      item.search?.props?.disabled ?? item.search?.elProps?.disabled

    if (userDisabled === true) return true

    const el = item.search?.el
    const shouldDisableDuringLoading =
      el === 'el-select' ||
      el === 'el-select-v2' ||
      el === 'el-tree-select' ||
      el === 'el-cascader'

    const loading =
      (item.prop && fieldLoadingMap.get(item.prop)) || isLinkageLoading(item)

    if (
      shouldDisableDuringLoading &&
      item.prop &&
      (item.search?.optionsApi || item.search?.linkage) &&
      loading
    ) {
      return true
    }

    return false
  }

  // 获取选项数据（支持静态和异步）
  const getOptions = (item: ColumnProps) => {
    const prop = item.prop
    if (!prop) return []

    // 优先返回静态选项
    if (item.search?.options) {
      return item.search.options
    }

    // 返回异步加载的选项
    if (item.search?.optionsApi && asyncOptionsMap.has(prop)) {
      return asyncOptionsMap.get(prop) || []
    }

    return []
  }

  // 加载单个字段的异步选项
  const loadFieldOptions = async (
    item: ColumnProps,
    params?: Record<string, any>
  ) => {
    if (!item.search?.optionsApi || !item.prop) return
    // 设置加载状态
    fieldLoadingMap.set(item.prop, true)
    try {
      const options = await item.search.optionsApi(params)
      asyncOptionsMap.set(item.prop, options)

      // 数据加载完成后，如果有默认值，立即设置
      const key = item.search.key || item.prop
      if (
        item.search.defaultValue !== undefined &&
        (props.searchParam[key] === undefined || props.searchParam[key] === '')
      ) {
        props.searchParam[key] = item.search.defaultValue
      }
    } catch (error) {
      console.error(`加载选项失败 [${item.prop}]:`, error)
      asyncOptionsMap.set(item.prop, [])
    } finally {
      // 清除加载状态
      fieldLoadingMap.set(item.prop, false)
    }
  }

  // 加载所有异步选项数据
  const loadAsyncOptions = async () => {
    const promises = searchColumns.value
      // 筛选出需要初始化加载数据的字段
      .filter(
        (item) =>
          // 1. 必须配置了 optionsApi（说明这是一个需要异步获取数据的字段）
          item.search?.optionsApi &&
          // 2. 必须有 prop 属性（作为数据存储的唯一标识 key）
          item.prop &&
          // 3. 必须没有配置 linkage（说明它不依赖其他字段，是独立的）
          // 【关键点】：如果有 linkage（联动依赖），那么它不能在这里初始化加载，
          // 而应该等待它依赖的字段有值后，由 checkAndLoadLinkageOptions 触发加载。
          !item.search?.linkage
      ) // 4. 使用 .map() 将筛选出的每一列转换为一个异步任务
      .map(async (item) => loadFieldOptions(item))

    await Promise.all(promises)

    // 所有异步选项加载完成后触发事件
    emit('optionsLoaded')
  }

  // 处理字段变化（联动逻辑）
  const handleFieldChange = (changedItem: ColumnProps) => {
    const changedProp = changedItem.prop
    if (!changedProp) return

    // 查找依赖当前字段的其他字段
    const dependentItems = searchColumns.value.filter((item) => {
      return item.search?.linkage?.includes(changedProp)
    })

    // 重新加载依赖字段的选项
    dependentItems.forEach((item) => {
      if (!item.prop) return

      // 获取联动参数
      const linkageParams: Record<string, any> = {}
      item.search?.linkage?.forEach((linkProp) => {
        const linkKey =
          props.columns.find((col) => col.prop === linkProp)?.search?.key ||
          linkProp
        linkageParams[linkProp] = props.searchParam[linkKey]
      })

      // 清空当前字段的值
      const currentKey = item.search?.key || item.prop
      props.searchParam[currentKey] = ''

      // 重新加载选项
      if (
        Object.values(linkageParams).every(
          (val) => val !== '' && val !== null && val !== undefined
        )
      ) {
        loadFieldOptions(item, linkageParams)
      } else {
        // 如果依赖字段有空值，清空选项
        asyncOptionsMap.set(item.prop, [])
      }
    })
  }

  // 监听联动字段的变化
  const setupLinkageWatch = () => {
    searchColumns.value.forEach((item) => {
      if (item.search?.linkage && item.search?.linkage.length > 0) {
        // 监听依赖字段的变化
        item.search.linkage.forEach((linkProp) => {
          const linkKey =
            props.columns.find((col) => col.prop === linkProp)?.search?.key ||
            linkProp

          watch(
            () => props.searchParam[linkKey],
            () => {
              const linkItem = props.columns.find(
                (col) => col.prop === linkProp
              )
              if (linkItem) {
                handleFieldChange(linkItem)
              }
            }
          )
        })
      }
    })
  }

  // 组件挂载时加载异步选项
  onMounted(() => {
    loadAsyncOptions()
    setupLinkageWatch()
    // 初始化屏幕断点
    handleResize()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })

  // 组件卸载时移除监听
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  // 搜索方法
  const search = () => {
    emit('search', props.searchParam)
  }

  // 重置方法
  const reset = () => {
    // 重置所有搜索参数为默认值
    props.columns.forEach((item) => {
      if (item.search && item.prop) {
        const key = item.search?.key || item.prop
        props.searchParam[key] = item.search.defaultValue ?? ''
      }
    })
    emit('reset')
  }
  // 组件缓存，避免重复创建异步组件
  const componentCache = new Map<string, Component>()
  // 动态加载组件（按需加载）
  const getAsyncComponent = (type?: SearchType) => {
    const componentType = type || 'el-input'
    // 如果已经创建过，直接返回缓存的组件
    if (componentCache.has(componentType)) {
      return componentCache.get(componentType)!
    }
    // 创建异步组件
    const asyncComp = defineAsyncComponent(async () => {
      // 动态导入 element-plus
      const elementPlus = await import('element-plus')
      switch (componentType) {
        case 'el-input':
          return elementPlus.ElInput
        case 'el-input-number':
          return elementPlus.ElInputNumber
        case 'el-select':
          return elementPlus.ElSelect
        case 'el-select-v2':
          return elementPlus.ElSelectV2
        case 'el-tree-select':
          return elementPlus.ElTreeSelect
        case 'el-cascader':
          return elementPlus.ElCascader
        case 'el-date-picker':
          return elementPlus.ElDatePicker
        case 'el-time-picker':
          return elementPlus.ElTimePicker
        case 'el-time-select':
          return elementPlus.ElTimeSelect
        case 'el-switch':
          return elementPlus.ElSwitch
        case 'el-slider':
          return elementPlus.ElSlider
        default:
          return elementPlus.ElInput
      }
    })
    // 缓存组件
    componentCache.set(componentType, asyncComp)
    return asyncComp
  }
</script>
