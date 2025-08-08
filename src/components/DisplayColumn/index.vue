<template>
  <el-dialog
    :title="$t('operation.define_col')"
    width="50%"
    :visible.sync="ndialogVisible"
    class="wrap-column-container"
  >
    <div class="select-menus">
      <p class="menus-title">{{ $t("operation.dram_item") }}</p>
      <div class="menus-content">
        <template>
          <!-- <draggable v-model="selectedArr" @update="datadragEnd" :options="{animation:500}">
          <transition-group> -->
          <div v-for="menu in selectedArr" :key="menu.field" class="drag-item item">{{ menu.name }}</div>
          <!-- </transition-group>
        </draggable> -->
        </template>
      </div>
    </div>
    <div v-if="fields.length" class="menus-box">
      <p class="menus-title">{{ $t("operation.choose_col") }}</p>
      <div class="menus-content">
        <div
          v-for="menu of fields"
          :key="menu.field"
          class="item"
          :class="{active:menu.active}"
          @click="onSelect(menu)"
        >{{ menu.name }}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t("operation.cancel") }}</el-button>
      <el-button type="primary" @click="onSave">{{ $t("operation.confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import draggable from 'vuedraggable'
// import { List } from 'echarts/lib/export'
export default {
  name: 'DisplayColumn',
  components: {
    // draggable
  },
  props: {
    selectedArr: {
      type: Array,
      default: (function() {
        return []
      })()
    },
    fields: {
      type: Array,
      default: (function() {
        return []
      })()
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    ndialogVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('closepop', val)
      }
    }
  },

  mounted() {
    // 为了防止火狐浏览器拖拽的时候以新标签打开
    document.body.ondrop = function(event) {
      event.preventDefault()
      event.stopPropagation()
    }
  },
  methods: {
    cancel() {
      this.$emit('closepop', false)
    },
    onSave() {
      this.$emit('closepop', false)
    },
    onSelect(item) {
      this.$emit('onSelect', item)
    },
    datadragEnd(evt) {
      // 拖动排序
      console.log('evt', evt)  
    //   this.$emit("datadragEnd", evt);
    //   evt.preventDefault();
    }
  }
}
</script>

<style lang="scss" scoped>
/* 菜单通用样式 */
.warp-column-set .el-dialog__body{
padding: 0px 20px;
}
.menus-box {
.menus-title {
margin-top: 0px;
line-height: 32px;
}
.menus-content {
.item {
cursor: pointer;
display: inline-flex;
align-items: center;
justify-content: center;
padding: 8px;
margin: 10px;
color: #575757;
background: rgba(238, 238, 238, 1);
border: 1px solid rgba(220, 220, 220, 1);
border-radius: 2px 0px 0px 2px;
}
.active {
color: #fff;
background: rgba(72, 153, 229, 1);
border-radius: 2px 0px 0px 2px;
}
}
}

/* 已选菜单 */
.select-menus {
.menus-title {
margin-top: 10px;
line-height: 32px;
}
.menus-content {
.item {
cursor: pointer;
display: inline-flex;
align-items: center;
justify-content: center;
padding: 8px;
margin: 10px;
color: #fff;
background: rgba(72, 153, 229, 1);
border-radius: 2px 0px 0px 2px;
border: 1px solid rgba(220, 220, 220, 1);
}
}
}

.wrap-column-container {
.el-dialog__body {
padding: 0px 20px;
}
}
</style>
