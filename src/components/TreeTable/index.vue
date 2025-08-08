<template>
  <div>
    <div class="el-table reset_el_table">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium" style="width: 100%;">
        <thead class="el-table__header">
          <tr>
            <th class="is-leaf header-row el-table__cell">模块</th>
            <th class="is-leaf header-row el-table__cell">子模块</th>
            <!--<th class="is-leaf header-row el-table__cell">子模块</th>-->
            <th class="is-leaf header-row el-table__cell">功能</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(row,index) in menuData">
            <template v-for="(children_row,index2) in row.children">
              <tr :key="children_row.meta.number" class="el-table__row">
                <td v-if="index2 == 0" class="el-table__cell" :rowspan="row.children_count">
                  <div class="cell">
                    <el-checkbox :value="curPermission.indexOf(row.meta.number) !== -1 ? true:false" :indeterminate="checkIndeterminate(row)" :label="row.meta.title" @change="checked=>checkPermission(checked,row,[])"></el-checkbox>
                  </div>
                </td>
                <td class="el-table__cell" :rowspan="children_row.children_count">
                  <div class="cell">
                    <el-checkbox :value="curPermission.indexOf(children_row.meta.number) !== -1 ? true:false" :indeterminate="checkIndeterminate(children_row)" :disabled="children_row.disabled" :label="children_row.meta.title" @change="checked=>checkPermission(checked,children_row,[index])"></el-checkbox>
                  </div>
                </td>
                <td class="el-table__cell">
                  <div v-if="children_row.meta.permission && children_row.meta.permission.length > 0" class="cell">
                    <template v-for="(children_row2, index3) in children_row.children">
                      <el-checkbox :key="index3" :value="curPermission.indexOf(children_row2.meta.number) !== -1 ? true:false" :indeterminate="checkIndeterminate(children_row2)" :disabled="children_row.disabled" :label="children_row2.meta.title" @change="checked=>checkPermission(checked,children_row2,[index, index2])"></el-checkbox>
                    </template>
                  </div>
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    menuData: {
      type: Array,
      required: true
    },
    curPermission: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      permissionLoading: false,
    }
  },
  watch: {

  },
  mounted() {
    console.log(this.menuData)
    console.log(this.curPermission)
  },
  methods: {
    checkPermission(checked, row, pid_list) {
      var add_value = typeof row === 'string' ? row : row.meta.number
      if (checked) {
        if (this.curPermission.indexOf(add_value) === -1) {
          this.curPermission.push(add_value)
        }
        this.checkPermissionChildren('push', row, pid_list)
      } else {
        if (this.curPermission.indexOf(add_value) !== -1) {
          this.curPermission.splice(this.curPermission.indexOf(add_value), 1)
        }
        this.checkPermissionChildren('splice', row, pid_list)
      }
      this.checkIndeterminate(row)
      this.$emit('changePermission', this.curPermission)
    },
    checkPermissionChildren(type, row, pid_list) {
      if (row.children && row.children.length > 0) {
        for (var idx = 0; idx < row.children.length; idx++) {
          var item = row.children[idx]
          var add_value = typeof item === 'string' ? item : item.meta.number
          if (type === 'push') {
            if (this.curPermission.indexOf(add_value) === -1) {
              this.curPermission.push(add_value)
            }
          } else {
            if (this.curPermission.indexOf(add_value) !== -1) {
              this.curPermission.splice(this.curPermission.indexOf(add_value), 1)
            }
          }
          this.checkPermissionChildren(type, item, [])
        }
      }
      if (pid_list.length > 0) {
        var update_list = []
        for (var idx2 = 0; idx2 < pid_list.length; idx2++) {
          var pid = pid_list[idx2]
          if (idx2 === 0) {
            update_list.push(this.menuData[pid])
          } else {
            update_list.unshift(update_list[0].children[pid])
          }
        }
        this.idDelete(update_list, type)
      }
    },
    idDelete(update_list, type) {
      for (var idx = 0; idx < update_list.length; idx++) {
        var item = update_list[idx]
        var add_value = typeof item === 'string' ? item : item.meta.number
        if (type === 'push') {
          if (this.curPermission.indexOf(add_value) === -1) {
            this.curPermission.push(add_value)
          }
        } else {
          var is_delete = true
          for (var idx1 = 0; idx1 < item.children.length; idx1++) {
            var item2 = item.children[idx1]
            var add_value2 = typeof item2 === 'string' ? item2 : item2.meta.number
            if (this.curPermission.indexOf(add_value2) !== -1) {
              is_delete = false
              break
            }
          }
          if (is_delete) {
            if (this.curPermission.indexOf(add_value) !== -1) {
              this.curPermission.splice(this.curPermission.indexOf(add_value), 1)
            }
          }
        }
        this.checkIndeterminate(item)
      }
    },
    checkIndeterminate(child_row) {
      if (this.curPermission.indexOf(child_row.meta.number) !== -1 || this.curPermission.indexOf(child_row.number) !== -1) {
        var isIndeterminate = false
        if (Object.prototype.hasOwnProperty.call(child_row, 'children')) {
          for (var idx = 0; idx < child_row.children.length; idx++) {
            var item = child_row.children[idx]
            if (typeof item === 'string') {
              if (this.curPermission.indexOf(item) === -1) {
                isIndeterminate = true
                break
              }
            } else {
              if (Object.prototype.hasOwnProperty.call(item, 'isIndeterminate') && item['isIndeterminate']) {
                isIndeterminate = item['isIndeterminate']
                break
              } else if (this.curPermission.indexOf(item.meta.number) === -1) {
                isIndeterminate = true
                break
              }
            }
          }
        }
        child_row['isIndeterminate'] = isIndeterminate
        return isIndeterminate
      }
    },
  },
}
</script>

<style lang="scss">
.reset_el_table th.el-table__cell.is-leaf {
  padding: 0 10px !important;
}
</style>

<style lang="scss" scoped>
</style>
