import { formatComponentName } from '../utils/format'

export const getVueTemplate = (prefix: string, componentName: string) => {
  return `
    <script lang="ts">
    import { computed, defineComponent } from 'vue'

    export default defineComponent({
      name: '${formatComponentName(`${prefix}-${componentName}`)}',
      props: {},
      setup() {
        const rootClasses = computed(() => ({}))

        return { rootClasses }
      },
    })
    </script>

    <template>
      <div class="${prefix}-${componentName}" :class="rootClasses">
      </div>
    </template>

    <style lang="less">
    @import './style.less'
    </style>
  `
}
