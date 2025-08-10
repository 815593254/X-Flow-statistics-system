<template>
  <div class="tab_main_content components-content">
    <el-row type="flex" class="table_form_content" justify="start" align="bottom">
      <el-col class="left-form">
        <el-form :model="searchForm" :inline="true" label-position="left" label-width="85px">
          <el-form-item label="抓包IP:">
            <el-input v-model="searchForm.ip" class="search_input" placeholder="抓包IP">
            </el-input>
          </el-form-item>
          <el-form-item>
            <i class="el-icon-search" @click="searchData"></i>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col class="right-form">
        <div v-permission="'1-5-delete'" class="icon-button delete-button" @click="deleteManyData">
          <el-tooltip class="item" effect="dark" content="批量删除" placement="top-start">
            <i class="el-icon-delete"></i>
          </el-tooltip>
        </div>
        <div class="icon-button refresh-button" @click="refresh">
          <el-tooltip class="item" effect="dark" content="刷新" placement="top-start">
            <i class="el-icon-refresh"></i>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
    <div class="host-table">
      <!-- 表格 -->
      <el-table v-loading="isLoading" element-loading-background="rgba(255, 255, 255, .0)"
        element-loading-text="加载中，请稍后..." element-loading-spinner="el-icon-loading" :data="tbParam.tableData" border
        style="width: 100%" tooltip-effect="lights" header-cell-class-name="header-row"
        :empty-text="isLoading ? ' ' : ''" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="ip" label="IP地址" width="150">
        </el-table-column>
        <el-table-column prop="rateBps" label="IP流量" width="150">
        </el-table-column>
        <el-table-column prop="file" label="抓包文件地址" width="500">
          <template slot-scope="{ row }">
            {{ urlHead }}{{ row.file }}.pcap
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="{ row }">
            {{ parseTime(row.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operation')" width="220">
          <template slot-scope="{ row }">
            <div class="table-button">
              <span v-permission="'1-5-delete'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="deleteData(row)">删除</el-button>
              </span>
              <span v-permission="'1-5-see'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="seeDetail(row)">详情</el-button>
              </span>
              <span v-permission="'1-5-down'" class="icon-button">
                <el-button type="text" class="detail-btn" @click="downFile(row)">下载抓包文件</el-button>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- <div class="pagination-content">
        <el-pagination
          :current-page.sync="tbParam.currentPage"
          :page-sizes="[20, 50, 100]"
          :page-size="tbParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tbParam.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div> -->
    </div>

    <!--新增编辑弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false"
      :close-on-press-escape="false" @close="hidDialog">
      <el-form ref="addFormData" class="add_form_data" label-width="120px">
        <el-form-item label="IP地址：" prop="ip">
          {{ formData.ip }}
        </el-form-item>
        <el-form-item label="IP流量：" prop="ip">
          {{ formData.rateBps }}
        </el-form-item>
        <el-form-item label="抓包文件地址：" prop="ip">
          {{ urlHead }}{{ formData.file }}.pcap
        </el-form-item>
        <el-form-item label="创建时间：" prop="ip">
          {{ parseTime(formData.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="downFile">下 载 抓 包 文 件</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteData } from "@/api/report-exigence/index";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  props: {},
  data() {
    return {
      urlHead: "http://14.152.85.14:54321",
      parseTime,
      searchKey: "",
      tbParam: {
        currentPage: 1,
        tableData: [],
        total: 0,
        pageSize: 20,
      },
      searchForm: {
        ip: "",
      },
      dataSource: [],
      isLoading: false,
      multipleSelection: [],
      dialogTitle: "告警详情",
      dialogVisible: false,
      formData: {},

      isPolling: false,
      pollingTimer: null
    };
  },
  computed: {
    ...mapGetters(["user_info"]),
  },
  watch: {
    $route() {
      //this.getList();
    },
  },
  async mounted() {
    this.isLoading = true;
    this.startPolling();
  },
  beforeDestroy() {
    this.stopPolling()
  },
  methods: {
    hidDialog() {
      this.startPolling();
    },

    seeDetail(row) {
      this.stopPolling();
      this.formData = row;
      this.dialogVisible = true;
    },

    fetchData() {
      if (!this.isPolling) return;

      this.getList(1);
      this.pollingTimer = setTimeout(this.fetchData, 5000)
    },

    // 开始轮询
    startPolling() {
      if (this.isPolling) return; // 已经在轮询中则不做处理
      this.isPolling = true
      this.fetchData() // 立即开始第一次请求
    },

    // 暂停轮询
    stopPolling() {
      this.isPolling = false
      if (this.pollingTimer) {
        clearTimeout(this.pollingTimer)
        this.pollingTimer = null
      }
    },

    downFile() {
      let file = this.urlHead + this.formData.file + ".pcap";
      window.open(file, "_blank");
    },

    // 处理多选框的值
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      this.tbParam.currentPage = 1;
      this.tbParam.pageSize = val;
      this.tbParam.tableData = [];
      this.getList();
    },
    handleCurrentChange(val) {
      this.tbParam.currentPage = val;
      this.tbParam.tableData = [];
      this.getList();
    },
    deleteData(row) {
      this.$confirm("确定要删除数据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteData(row)
          .then(() => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
          })
          .then(() => {
            this.tbParam.tableData = [];
            this.getList();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    deleteManyData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "error",
          message: "请选择要删除的行数",
        });
      } else {
        this.$confirm("确定要删除选中的数据吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          var dataId_list = [];
          for (var i = 0; i < this.multipleSelection.length; i++) {
            var item = this.multipleSelection[i];
            dataId_list.push(item.id);
          }
          deleteData({
            id: dataId_list.join(","),
          })
            .then(() => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
            })
            .then(() => {
              this.tbParam.tableData = [];
              this.getList();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },
    getList(_type) {
      var params = {
        page: {
          pageNo: _.cloneDeep(this.tbParam.currentPage),
          pageSize: this.tbParam.pageSize,
        },
        sorts: [{ index: 0, property: "create_time", direction: "desc" }],
      };
      for (var key in this.searchForm) {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key];
        }
      }
      if (!_type) {
        this.isLoading = true;
      }
      getList(params)
        .then((response) => {
          this.tbParam.tableData = response.body.results;
          this.tbParam.total = response.body.totalCount;
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
        });
    },
    refresh() {
      this.tbParam.tableData = [];
      this.getList();
      this.$message({
        type: "success",
        message: "刷新成功",
      });
    },
    searchData() {
      this.tbParam.tableData = [];
      this.getList();
      this.$message({
        type: "success",
        message: "查询成功",
      });
    },
  },
};
</script>

<style lang="scss"></style>
<style lang="scss" scoped>
.tab_main_content {
  padding: 25px;
  //min-width: 1200px;
}
</style>
