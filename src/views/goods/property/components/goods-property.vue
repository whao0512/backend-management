<template>
  <div>
    <div class="search-area">
      属性：
      <el-input size="mini" placeholder="请输入商品属性" v-model="listQuery.attributeName" style="width: 200px;"
                class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
      </el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search"
                 @click="operation('', 'add')">
        新增属性
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
      <el-table-column label="属性" prop="attributeName" align="center">
      </el-table-column>
      <el-table-column label="是否支持筛选" prop="canChoice" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="operation(scope.row, 'edit')">编辑</el-button>
          <el-button size="mini" type="danger" @click="operation(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog
      title="提示"
      :visible.sync="confirmDialog"
      width="30%"
      :close-on-click-modal="false">
      <span>删除此属性</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="confirmDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('','delete')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="propertyVisible"
      @close='closeDialog'
      :close-on-click-modal="false">
      <el-form :model="skuAttributeForm" :rules="skuAttributeRules" ref="skuAttributeForm" style="width: 50%;">
        <el-form-item label="属性名称" prop="attributeName" :label-width="formLabelWidth">
          <el-input size="mini" v-model="skuAttributeForm.attributeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="支持筛选" prop="canChoice" :label-width="formLabelWidth">
          <el-radio-group  v-model="skuAttributeForm.canChoice">
            <el-radio :label="'Y'">是</el-radio>
            <el-radio :label="'N'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel('skuAttributeForm')">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('skuAttributeForm', 'modify')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getSkuAttributeList, skuAttributeModify, skuAttributeDelete, skuAttributeCreate} from '@/api/sku'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "goods-tabs-panel",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          attributeName: '',
        },
        skuAttributeForm: {
          id: '',
          attributeName: '',
          canChoice: '',
        },
        skuAttributeRules: {
          attributeName: [{required: true, message: '请输入属性名称', trigger: 'blur'}],
          canChoice: [{required: true, message: '请选择是否支持筛选', trigger: 'blur'}]
        },
        propertyVisible: false,
        confirmDialog: false,
        formLabelWidth: '120px',
        title: '',
        isAddOperation: '',
        skuAttributeId: '',
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getSkuAttributeList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow;
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList()
      },
      // handleClose() {
      // },
      closeDialog() {
        this.propertyVisible = false;
        this.skuAttributeForm = {}
        this.cancel('skuAttributeForm')
      },
      operation(row, type) {
        if (type == 'add') {
          this.propertyVisible = true;
          this.title = '新增属性';
          this.isAddOperation = 'add';
        } else if (type == 'edit') {
          this.propertyVisible = true;
          this.title = '修改属性';
          this.isAddOperation = 'edit';
          this.skuAttributeForm = {
            id: row.id,
            attributeName: row.attributeName,
            canChoice: row.canChoice,
          };
        } else if (type == 'delete') {
          this.confirmDialog = true;
          this.skuAttributeId = row.id;
        }
      },
      submit(formName, type) {
        if (type == 'modify' && this.isAddOperation == 'add') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              skuAttributeCreate(this.skuAttributeForm).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.propertyVisible = false;
                  this.getList()
                }
              );
            } else {
              return false;
            }
          });
        } else if (type == 'modify' && this.isAddOperation == 'edit') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              skuAttributeModify(this.skuAttributeForm).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.propertyVisible = false;
                  this.getList()
                }
              );
            } else {
              return false;
            }
          });
        } else if (type == 'delete') {
          skuAttributeDelete({id: this.skuAttributeId}).then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.confirmDialog = false;
              this.getList();
            }
          )
        }
      },
      cancel(formName) {
        this.propertyVisible = false;
        this.$refs[formName].resetFields();
        this.skuAttributeForm = {}
      }
    }
  }
</script>

<style scoped>

</style>
