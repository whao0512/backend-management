<template>
  <div class="category">
    <div class="category-container">
      <el-button style="margin-bottom: 10px;" @click="topCategoryCreate" type="primary" size="small">新增顶级类目</el-button>
      <tree-table :data="data" :eval-func="func" :columns="columns" :expand-all="expandAll" border>
        <!--<el-table-column label="类目名称">-->
        <!--<template slot-scope="scope">-->
        <!--<span style="color:sandybrown">{{ scope.row.categoryName }}</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="展示状态" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--{{scope.row.status}}-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" @click="operation('up', scope.row)">上移</el-button>-->
            <!--<el-button type="text" @click="operation('down', scope.row)">下移</el-button>-->
            <el-button type="text" @click="operation('edit', scope.row)">编辑</el-button>
            <el-button type="text" @click="operation('delete', scope.row)">删除</el-button>
            <el-button v-if="scope.row.level !== 3" type="text" @click="operation('add', scope.row)">新增子类目
            </el-button>
          </template>
        </el-table-column>
      </tree-table>
    </div>

    <el-dialog
      title="提示"
      :visible.sync="confirmDialog"
      width="30%"
      :close-on-click-modal="false">
      <span>删除此类目</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="confirmDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('','delete')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="categoryDialog" @close='closeDialog'
               :close-on-click-modal="false">
      <el-form ref="categoryForm" :model="categoryForm" :rules="categoryRules" label-width="80px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input size="mini" v-model="categoryForm.categoryName" placeholder="请填写分类名称"></el-input>
        </el-form-item>
        <el-form-item label="是否展示" prop="status">
          <el-radio-group v-model="categoryForm.status">
            <el-radio :label="2">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="categoryDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('categoryForm', 'modify')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  import {getAllCategoryList, categoryCreate, categoryModify} from '@/api/category'
  import treeTable from '@/components/TreeTable'
  import treeToArray from './customEval'

  export default {
    name: 'category',
    components: {treeTable},
    data() {
      return {
        func: treeToArray,
        expandAll: false,
        data: [],
        columns: [
          {
            text: '类目名称',
            value: 'categoryName',
            width: 200
          },
          {
            text: '展示状态',
            value: 'status'
          }
        ],
        categoryDialog: false,
        confirmDialog: false,
        isAddOperation: '',
        title: '',
        categoryForm: {
          parentId: '',
          id: '',
          categoryName: '',
          status: 2,
        },
        categoryId: '',
        categoryRules: { // 表单验证规则
          categoryName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
          status: [{required: true, message: '请选择是否展示', trigger: 'change'}]
        },
        args: [null, null, 'timeLine']
      }
    },
    created() {
      this.getCategory();
    },
    methods: {
      getCategory() {
        this.listLoading = true;
        getAllCategoryList({}).then(res => {
          let batchdata = res.returnData;
          //valueBatch
          let dataValueBatch = batchdata => batchdata.map(({id, categoryName, childCategoryList, parentId, level}) => (childCategoryList ? {
            id: id,
            categoryName: categoryName,
            status: status,
            children: dataValueBatch(childCategoryList),
            level: level
          } : {
            id: id,
            categoryName: categoryName,
            status: status,
            level: level,
          }));
          this.data = dataValueBatch(batchdata);
        })
      },
      topCategoryCreate() {
        this.categoryDialog = true;
        this.isAddOperation = 'add';
      },
      operation(type, row) {
        switch (type) {
          case 'add':
            this.categoryDialog = true;
            this.title = '新增类目';
            this.isAddOperation = 'add';
            this.categoryForm.parentId = row.id;
            break;
          case 'edit':
            this.categoryDialog = true;
            this.title = '修改类目';
            this.isAddOperation = 'edit';
            this.categoryForm.id = row.id;
            this.categoryForm.categoryName = row.categoryName;
            this.categoryForm.status = row.status;
            break;
          case 'delete':
            this.confirmDialog = true;
            this.categoryForm = {
              id: row.id,
              isDeleted: 'Y',
              status: row.status,
            }
            break;
          default:
            return ''
        }
      },
      closeDialog() {
        this.cancel('categoryForm')
      },
      submit(formName, type) {
        let params = {
          parentId: this.categoryForm.parentId ? this.categoryForm.parentId : '-1',
          id: this.categoryForm.id ? this.categoryForm.id : '',
          categoryName: this.categoryForm.categoryName,
          status: Number(this.categoryForm.status),
        };
        if (type == 'modify' && this.isAddOperation == 'add') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              categoryCreate(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.categoryDialog = false;
                  this.getCategory()
                }
              );
            } else {
              return false;
            }
          });
        } else if (type == 'modify' && this.isAddOperation == 'edit') {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              categoryModify(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.categoryDialog = false;
                  this.getCategory()
                }
              );
            } else {
              return false;
            }
          });
        } else if (type == 'delete') {
          categoryModify(this.categoryForm).then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.confirmDialog = false;
              this.getCategory();
            }
          )
        }

      },
      cancel(formName) {
        this.categoryDialog = false;
        this.$refs[formName].resetFields();
        this.categoryForm = {}
      }
    }
  }
</script>
<style rel="stylesheet" lang="scss" scoped>
  .category {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .category-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
