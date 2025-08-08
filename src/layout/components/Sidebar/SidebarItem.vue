<template>
  <div v-if="!item.hidden">
    <!-- 若只有一个子节点，则默认显示子节点信息 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)" :is-disabled="item.disabled" :path="item">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}" :disabled="item.disabled">
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="generateTitle(onlyOneChild.meta.title)" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 若存在多个子节点，则生成下拉栏，子节点的子节点会继续遍历下去 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body :disabled="item.disabled">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { generateTitle } from '@/utils/i18n'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 是否只有一个子节点
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },

    generateTitle
  }
}
</script>
