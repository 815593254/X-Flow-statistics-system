<template>
  <div class="pagination-content">
    <el-pagination
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    pages: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => [10, 50, 100]
    }
  },
  data() {
    var pageSize = this.pageSizes[0]
    return {
      pageSize: pageSize,
    }
  },
  methods: {
    // 每页数量
    handleSizeChange(val) {
      this.pageSize = val
      this.ValuebyParent()
    },
    // 当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.ValuebyParent()
    },
    // 传值给父组件
    ValuebyParent() {
      const pageChangeVal = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
      }
      this.$emit('pageChangeVal', pageChangeVal)
    }
  },
  
}
</script>

<style lang="scss" scoped>
.pagination-content{
  margin-top: 15px;
  text-align: right;
}

</style>

<style lang="scss">

</style>
