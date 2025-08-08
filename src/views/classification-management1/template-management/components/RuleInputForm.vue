<template>
  <div class="tab_main_content components-content">
    <!--编辑模块加载的内容-->
    <div v-if="obj_id" class="edit_form_content">
      <div class="edit_title">
        <el-row :gutter="0" type="flex" align="center">
          <el-col class="first_el_col">
            <div class="edit_title_div">
              <el-row :gutter="0" type="flex">
                <el-col :span="10">
                  分级分类模板：
                </el-col>
                <el-col :span="14">
                  <div class="edit_title_div_span">
                    <span>{{ curDataTemplateName }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col class="second_el_col">
            <div><el-button type="primary" size="mini" @click="cancel">返回</el-button></div>
          </el-col>
        </el-row>
      </div>
      <div class="edit_content">
        <el-row :gutter="0" type="flex">
          <el-col class="first_el_col" :style="'height:' + clientHeight + 'px;'">
            <div>
              <el-input v-model="filterText" placeholder="输入关键字进行过滤"></el-input>
              <div class="tree_data_content">
                <el-button v-if="typeData.length === 0" type="primary" size="mini" @click="addType({dataTypeId:0})">新增分类</el-button>
                <el-tree
                  v-else
                  ref="tree"
                  class="filter-tree"
                  node-key="dataTypeId"
                  :data="typeData"
                  :props="defaultProps"
                  :current-node-key="cur_type_id"
                  :default-expanded-keys="defaultExpandedKey"
                  :highlight-current="true"
                  :default-expand-all="false"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  @node-click="nodeClick"
                >
                  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span class="tree_node_label">{{ node.label }}</span>
                    <span class="operate_tree_content">
                      <el-button type="text" @click="editType(data)"><i class="el-icon-edit"></i></el-button>
                      <!--<el-button type="text" @click="deleteType(data)"><i class="el-icon-remove-outline"></i></el-button>-->
                      <el-button type="text" @click="deleteType(data)"><i class="el-icon-delete"></i></el-button>
                      <el-button type="text" @click="addType(data)"><i class="el-icon-circle-plus-outline"></i></el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </el-col>
          <el-col class="second_el_col" :style="'height:' + clientHeight + 'px;'">
            <div class="second_el_col_content">
              <el-row type="flex" class="table_form_content" justify="start" align="bottom">
                <el-col class="left-form">
                  <el-form :model="searchForm" :inline="true" label-width="0px">
                    <el-form-item>
                      <el-input v-model="searchForm.dataCharacterName" class="search_input" placeholder="请输入特征项">
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                      <i class="el-icon-search" @click="searchData"></i>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col class="right-form">
                  <div>
                    <el-button type="primary" size="mini" @click="addCharacter">新增</el-button>
                  </div>
                  <div class="icon-button delete-button" @click="deleteCharacterManyData">
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
                <el-table
                  ref="multipleTable"
                  v-loading="isLoading"
                  element-loading-background="rgba(255, 255, 255, .0)"
                  element-loading-text="加载中，请稍后..."
                  element-loading-spinner="el-icon-loading"
                  :data="tbParam.tableData"
                  border
                  style="width: 100%"
                  tooltip-effect="lights"
                  :max-height="tableHeight"
                  header-cell-class-name="header-row"
                  :empty-text="isLoading?' ':''"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="40"> </el-table-column>
                  <el-table-column prop="dataCharacterName" label="特征项" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
                  <el-table-column prop="dataTypeName" label="类别名称" min-width="130" :show-overflow-tooltip="true"> </el-table-column>
                  <el-table-column prop="dataLevelName" label="级别名称" width="140">
                    <template slot-scope="{row}">
                      <div v-if="row.dataLevelColor" class="level_label_color data_level">
                        <span :style="'background-color:' + row.dataLevelColor">{{ row.dataLevelName }}</span>
                      </div>
                      <span v-else>{{ row.dataLevelName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="operateTime" label="操作时间" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="{row}">
                      {{ parseTime(row.operateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                    <template slot-scope="{row}">
                      <div class="table-button">
                        <span class="icon-button">
                          <el-button type="text" class="detail-btn" @click="eidtCharacterData(row)">编辑</el-button>
                        </span>
                        <span class="icon-button">
                          <el-button type="text" class="detail-btn" @click="deleteCharacterData(row)">删除</el-button>
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="pagination-content">
                  <el-pagination
                    :current-page.sync="tbParam.currentPage"
                    :page-sizes="[20, 50, 100]"
                    :page-size="tbParam.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tbParam.total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--新增分类弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="addType" :model="addTypeData" label-width="120px" label-position="top">
        <el-form-item label="分类名称：" prop="dataTypeName">
          <el-input v-model.trim="addTypeData.dataTypeName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitType">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增特征项弹窗-->
    <el-dialog :title="dialogTitleCharacter" :visible.sync="dialogVisibleCharacter" width="500px">
      <el-form ref="addCharacter" :model="addCharacterData" label-width="120px">
        <el-form-item label="特征项：" prop="dataCharacterId">
          <el-select v-model="addCharacterData.dataCharacterId" placeholder="请选择特征项">
            <el-option v-for="item in dataCharacterList" :key="item.dataCharacterId" :label="item.dataCharacterName" :value="item.dataCharacterId"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="级别：" prop="dataLevelId">
          <el-select v-model="addCharacterData.dataLevelId" placeholder="请选择级别">
            <el-option v-for="item in dataLevelList" :key="item.dataLevelId" :label="item.dataLevelName" :value="item.dataLevelId"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisibleCharacter = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitCharacter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getTemplateDetail } from '@/api/classification-management/template-management/index'
import { getTypeTreeData, createTypeData, editTypeData, deleteTypeData } from '@/api/category-management/index'
import { getCharacterData, createCharacterData, editCharacterData, deleteCharacterData } from '@/api/character-management/index'
import { getCharacterList } from '@/api/classification-management/features/index'
import { getLevelList } from '@/api/classification-management/level-management/index'
import { parseTime } from '@/utils'
import _ from 'lodash'

export default {
  props: {
  },
  data() {
    return {
      parseTime,
      clientHeight: document.body.clientHeight - 215,
      tableHeight: document.body.clientHeight - 323,
      obj_id: '',
      curDataTemplateName: '',
      dataLevelGroupId: null,
      isLoading: false,
      filterText: '', // 树搜索过滤
      typeData: [],
      defaultProps: {
        children: 'typeTree',
        label: 'dataTypeName',
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogOperate: '',
      addTypeData: {
        dataTypeName: '',
        dataTypeId: '',
        dataTypeParent: null,
      },
      cur_type_id: null,
      cur_children_type_id_list: [],
      multipleSelection: [],
      tbParam: {
        currentPage: 1,
        tableData: [],
        total: 0,
        pageSize: 20,
      },
      searchForm: {
        dataTemplateName: '',
      },
      dataCharacterList: [],
      dataLevelList: [],
      dialogTitleCharacter: '新增特征项',
      dialogVisibleCharacter: false,
      addCharacterData: {
        dataLevelId: null,
        dataCharacterId: null,
      },
      defaultExpandedKey: [],
    }
  },
  computed: {
    ...mapGetters([
      'user_info'
    ])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      if (this.$route.path.indexOf('/classification-management/template/rule') !== -1) {
        this.obj_id = parseInt(this.$route.params.id)
        await getTemplateDetail({
          dataTemplateId: this.obj_id
        }).then(response => {
          this.curDataTemplateName = response.body.dataTemplateName
          this.dataLevelGroupId = response.body.dataLevelGroupId
        }).catch(err => {
          console.log(err)
        })
        getCharacterList({
          'page': {
            'pageNo': 0,
            'pageSize': 10000000
          },
        }).then(response => {
          this.dataCharacterList = response.body.results
          for (var i = 0; i < this.dataCharacterList.length; i++) {
            var item = this.dataCharacterList[i]
            item.dataCharacterId = parseInt(item.dataCharacterId)
          }
        }).catch(err => {
          console.log(err)
        })
        getLevelList({
          dataTemplateId: this.obj_id,
          dataLevelGroupId: this.dataLevelGroupId,
          'page': {
            'pageNo': 0,
            'pageSize': 10000000
          },
        }).then(response => {
          this.dataLevelList = response.body.results
          for (var i = 0; i < this.dataLevelList.length; i++) {
            var item = this.dataLevelList[i]
            item.dataLevelId = parseInt(item.dataLevelId)
          }
        }).catch(err => {
          console.log(err)
        })
        this.getTypeTreeData()
      }
    },
    // 处理多选框的值
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.tbParam.currentPage = 1
      this.tbParam.pageSize = val
      this.tbParam.tableData = []
      this.getCharacterData()
    },
    handleCurrentChange(val) {
      this.tbParam.currentPage = val
      this.tbParam.tableData = []
      this.getCharacterData()
    },
    // 获取分类树形结构数据
    getTypeTreeData() {
      getTypeTreeData({
        dataTemplateId: this.obj_id
      }).then(response => {
        this.typeData = response.body.results
        if (this.typeData.length > 0) {
          this.defaultExpandedKey.push(this.typeData[0].dataTypeId)
          if (!this.cur_type_id) {
            this.cur_type_id = this.typeData[0].dataTypeId
            this.cur_children_type_id_list = [this.cur_type_id]
            this.defaultExpandedKey.push(this.cur_type_id)
            if (this.typeData[0].typeTree && this.typeData[0].typeTree.length > 0) {
              this.getChildrenType(this.typeData[0].typeTree)
            }
          }
        }
      }).then(() => {
        this.getCharacterData()
      }).catch(err => {
        console.log(err)
      })
    },
    getCharacterData() {
      var params = {
        'dataTemplateId': this.obj_id,
        // 'dataTypeId': parseInt(this.cur_type_id),
        'dataTypeIdIn': this.cur_children_type_id_list.join(','),
        'page': {
          'pageNo': _.cloneDeep(this.tbParam.currentPage),
          'pageSize': this.tbParam.pageSize
        },
      }
      for (var key in this.searchForm) {
        if (this.searchForm[key]) {
          params[key] = this.searchForm[key]
        }
      }
      getCharacterData(params).then(response => {
        this.tbParam.tableData = response.body.results
        this.tbParam.total = response.body.totalCount
      }).catch(err => {
        console.log(err)
      })
    },
    cancel() {
      this.$router.push({ path: '/classification-management/template' })
    },
    // 提交新增分类的弹窗表单
    submitType() {
      if (this.addTypeData.dataTypeName) {
        var param = {
          dataTypeName: this.addTypeData.dataTypeName,
          dataTemplateId: this.obj_id,
          dataTypeParent: this.addTypeData.dataTypeParent,
        }
        if (this.dialogOperate === 'edit') {
          param.dataTypeId = this.addTypeData.dataTypeId
        }
        var typeApi = this.dialogOperate === 'add' ? createTypeData : editTypeData
        typeApi(
          param
        ).then(() => {
          var message = ''
          if (this.dialogOperate === 'add') {
            message = '新增分类成功'
          } else {
            message = '编辑分类成功'
          }
          this.$message({
            type: 'success',
            message: message
          })
          this.dialogVisible = false
          this.getTypeTreeData()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message({
          type: 'error',
          message: '请输入分类名称'
        })
      }
    },
    // 编辑时新增类型
    addType(data) {
      this.dialogVisible = true
      this.dialogTitle = '新增分类'
      this.dialogOperate = 'add'
      this.addTypeData.dataTypeParent = data.dataTypeId
      this.addTypeData.dataTypeName = ''
    },
    editType(data) {
      this.dialogVisible = true
      this.dialogTitle = '编辑分类'
      this.dialogOperate = 'edit'
      this.addTypeData.dataTypeParent = data.dataTypeParent
      this.addTypeData.dataTypeName = data.dataTypeName
      this.addTypeData.dataTypeId = data.dataTypeId
    },
    deleteType(data) {
      this.$confirm('确定要删除' + data.dataTypeName + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTypeData({
          dataTemplateId: this.obj_id,
          dataTypeId: parseInt(data.dataTypeId)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getTypeTreeData()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    // 过滤组
    filterNode(value, data, node) {
      if (!value) return true
      var parentNode = node.parent
      var labels = [node.label]
      var level = 1
      while (level < node.level) {
        labels = [...labels, parentNode.label]
        parentNode = parentNode.parent
        level++
      }
      return labels.some(label => label.indexOf(value) !== -1)
    },
    // 节点被点击
    nodeClick(node) {
      this.cur_type_id = node.dataTypeId
      this.cur_children_type_id_list = [this.cur_type_id]
      this.getChildrenType(node.typeTree)
      this.getCharacterData()
    },
    getChildrenType(node) {
      for (var i = 0; i < node.length; i++) {
        var item = node[i]
        this.cur_children_type_id_list.push(item.dataTypeId)
        if (item.typeTree && item.typeTree.length > 0) {
          this.getChildrenType(item.typeTree)
        }
      }
    },
    searchData() {
      this.tbParam.tableData = []
      this.tbParam.total = 0
      this.getCharacterData()
      this.$message({
        type: 'success',
        message: '查询成功'
      })
    },
    refresh() {
      this.tbParam.tableData = []
      this.tbParam.total = 0
      this.getCharacterData()
      this.$message({
        type: 'success',
        message: '刷新成功'
      })
    },
    addCharacter() {
      this.dialogVisibleCharacter = true
      this.dialogTitleCharacter = '新增特征项'
      this.dialogOperate = 'add'
    },
    eidtCharacterData(row) {
      this.dialogVisibleCharacter = true
      this.dialogTitleCharacter = '编辑特征项'
      this.dialogOperate = 'edit'
      this.addCharacterData = {
        status: row.status,
        dataLevelId: row.dataLevelId,
        dataCharacterId: row.dataCharacterId,
        dataCharacterBandingId: row.dataCharacterBandingId,
      }
    },
    deleteCharacterData(row) {
      this.$confirm('确定要删除数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCharacterData({
          dataCharacterId: parseInt(row.dataCharacterId),
          dataTemplateId: this.obj_id,
          dataTypeId: parseInt(this.cur_type_id),
          dataCharacterBandingId: parseInt(row.dataCharacterBandingId),
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }).then(() => {
          this.tbParam.tableData = []
          this.tbParam.total = 0
          this.getCharacterData()
        }).catch(err => {
          console.log(err)
        })
      })
    },
    deleteCharacterManyData() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择要删除的行数'
        })
      } else {
        this.$confirm('确定要删除选中的数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tbParam.tableData = this.tbParam.tableData.filter(item => {
            return !this.multipleSelection.includes(item)
          })
        })
      }
    },
    submitCharacter() {
      if (this.addCharacterData.dataLevelId && this.addCharacterData.dataCharacterId) {
        var param = {
          status: this.addCharacterData.status,
          dataLevelId: this.addCharacterData.dataLevelId,
          dataCharacterId: this.addCharacterData.dataCharacterId,
          dataTemplateId: this.obj_id,
          dataTypeId: parseInt(this.cur_type_id),
        }
        if (this.dialogOperate !== 'add') {
          param.dataCharacterBandingId = this.addCharacterData.dataCharacterBandingId
        }
        var typeApi = this.dialogOperate === 'add' ? createCharacterData : editCharacterData
        typeApi(
          param
        ).then(() => {
          this.$message({
            type: 'success',
            message: this.dialogOperate === 'add' ? '新增特征项成功' : '编辑特征项成功'
          })
          this.dialogVisibleCharacter = false
          this.getCharacterData()
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message({
          type: 'error',
          message: '请选择特征项和级别'
        })
      }
    },
  }
}
</script>
<style lang="scss" >
.edit_form_content{
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,.el-tree-node.is-current>.el-tree-node__content:hover,.el-tree-node>.el-tree-node__content:hover{
    background-color: #edf6ff;
    .operate_tree_content{
      background-color: #edf6ff !important;
    }
  }
}
.tree_data_content {
  & > .el-tree--highlight-current > .el-tree-node{
    & > .el-tree-node__content > .expanded.el-tree-node__expand-icon.el-icon-caret-right {
      display: none !important;
    }
    & > .el-tree-node__content > .custom-tree-node {
      margin-left: 20px;
    }
  }

}
</style>
<style lang="scss" scoped>

.add_form_content{
  .add-form{
    width: 850px;
  }
}
.edit_form_content{
  margin: 15px;
  .edit_title{
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 30px;
    .el-col{
      padding: 0 5px;
    }
    .first_el_col {
      width: 250px;
    }
    .second_el_col{
      width: calc(100% - 250px);
    }
    .edit_title_div{
      .el-col{
        padding: 0px;
      }
      .edit_title_div_span{
        position: relative;
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding-right: 5px;
        span{
          display: inline-block;
          width: 100%;
        }
        .el-icon-edit{
          color: #1890ff;
          position: absolute;
          right: -1px;
          top: 8px;
          cursor: pointer;
          display: none;
        }
      }
      .edit_title_div_span:hover{
        .el-icon-edit{
          display: inline-block;
        }
      }
    }
  }
  .edit_content{
    border: 1px solid #e5e6e7;
    .first_el_col{
      & > div{
        padding: 10px;
        height: 100%;
        overflow-y: auto;
      }
      width: 240px;
      border-right: 1px solid #e5e6e7;
      .tree_data_content{
        text-align: center;
        margin-top: 10px;
        height: calc(100% - 42px);
        .el-tree-node.is-expanded.is-current{
          & > .el-tree-node__content > .expanded.el-tree-node__expand-icon.el-icon-caret-right{
            display: none !important;
          }
        }
        .custom-tree-node{
          width: 100%;
          text-align: left;
          position: relative;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: 14px;
          .el-button{
            padding: 0px;
            margin-left: 3px;
            i{
              font-size: 16px;
            }
          }
          .tree_node_label{
            width: calc(100% - 63px);
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          .operate_tree_content{
            width: 63px;
            background-color: #ffffff;
            position: absolute;
            right: 0px;
            bottom: 0px;
            display: none;
          }
        }
        .el-tree-node__content:hover {
          .operate_tree_content {
            display: inline-block !important;
          }
        }
      }
    }
    .second_el_col{
      width: calc(100% - 240px);
      & > div{
        padding: 10px;
        height: 100%;
      }
      .second_el_col_content{
        .el-form-item{margin-bottom: 10px !important;}
        .right-form{
          margin-bottom: 10px !important;
          .icon-button{
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>
