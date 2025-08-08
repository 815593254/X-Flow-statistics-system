<template>
  <component :is="type" v-bind="linkProps(to)" @click="permissionTip">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    },
    isDisabled: Boolean,
    path: {
      type: Object,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isDisabled) {
        return 'span'
      }
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    permissionTip() {
      // 左侧菜单不能点击的弹窗设置
      if (this.isDisabled) {
        // this.$store.dispatch('permission/permissionTip', {
        //   value: true,
        //   title: this.path.meta.title
        // })
      }
    },
    linkProps(to) {
      if (this.isDisabled) {
        return {}
      }
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
