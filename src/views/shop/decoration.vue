<template>
  <div class="decoration">
    <div class="decoration-container">
      <div style="margin-bottom: 10px;">
        <el-button size="mini" v-waves type="primary" @click="operation('','add')">新增</el-button>
      </div>
      <el-table
        :data="list"
        border
        style="width: 100%">
        <el-table-column
          prop="blockName"
          label="区块名称">
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="关联目录">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">隐藏</span>
            <span v-if="scope.row.status == 2">展示</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="operation(scope.row, 'edit')" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title" :visible.sync="showDialog"
               :close-on-click-modal="false">
      <el-form class="decoration-form" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="区块名称" prop="blockName">
          <el-input v-model="form.blockName" maxLength="50"></el-input>
        </el-form-item>
        <el-form-item label="显示隐藏" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="2">显示</el-radio>
            <el-radio :label="1">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="decoration-list" label="关联类目" prop="categoryId">
          <el-cascader :options="options" change-on-select v-model="form.categoryId"></el-cascader>
        </el-form-item>
        <el-form-item class="submit-btn">
          <el-button size="mini" type="primary" @click="submit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getAllCategoryList} from '@/api/category'
  import {getAllBlock, blockCreate, blockModify} from '@/api/decoration'
  import waves from '@/directive/waves' // Waves directive

  export default {
    name: "decoration",
    directives: {waves},
    data() {
      return {
        options: [],
        form: {
          blockName: '',
          status: 2,
          categoryId: [],
        },
        rules: { // 表单验证规则
          blockName: [{required: true, message: '请填写区块名称', trigger: 'blur'}],
          status: [{required: true, message: '请选择显示或隐藏', trigger: 'change'}],
          categoryId: [{required: true, message: '请选择关联类目', trigger: 'change'}]
        },
        list: null,
        title: '',
        merchantBlockId: '',
        finalCategoryId: '',
        showDialog: false,
      }
    },
    created() {
      this.getBlockList();
    },
    watch: {
      form: {
        handler(n, o) {
          let length = n['categoryId'].length;
          switch (length) {
            case 1:
              this.finalCategoryId = n['categoryId'][0];
              break;
            case 2:
              this.finalCategoryId = n['categoryId'][1];
              break;
            case 3:
              this.finalCategoryId = n['categoryId'][2];
              break;
          }
        },
        deep: true,
      }

    },
    methods: {
      onSubmit() {

      },
      /**
       * 获取商品类目
       */
      getCategory() {
        getAllCategoryList({})
          .then(
            res => {
              let batchdata = res.returnData;
              //valueBatch
              let dataValueBatch = batchdata => batchdata.map(({id, categoryName, childCategoryList}) => (childCategoryList ? {
                value: id,
                label: categoryName,
                children: dataValueBatch(childCategoryList),
              } : {
                value: id,
                label: categoryName,
              }));
              this.options = dataValueBatch(batchdata);
            }
          )
      },
      getBlockList() {
        getAllBlock({}).then(
          res => {
            this.list = res.returnData;
          }
        )
      },
      operation(row, type) {
        this.showDialog = true;
        this.getCategory();
        if ( type == 'add') {
          this.title = '新增区块';
        } else if ( type == 'edit') {
          this.title = '编辑区块';
          this.form.categoryId = row.categoryIds.split('-')
          this.finalCategoryId = this.form.categoryId[this.form.categoryId.length - 1];
          this.merchantBlockId = row.id;
          this.form.blockName = row.blockName;
          this.form.status = row.status;
        }
      },
      submit(formName) {
        let params = {};
        params = {
          blockName: this.form.blockName,
          status: this.form.status,
          categoryId: this.finalCategoryId
        };
        if ( this.title == '新增区块' ) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              blockCreate(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.showDialog = false;
                  this.getBlockList();
                }
              );
            } else {
              return false;
            }
          });
        } else if ( this.title == '编辑区块') {
          params = Object.assign(params, {id: this.merchantBlockId,isDeleted: 'N'});
          // params.categoryId = this.finalCategoryId
          this.$refs[formName].validate((valid) => {
            if (valid) {
              blockModify(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  this.showDialog = false;
                  this.getBlockList()
                }
              );
            } else {
              return false;
            }
          });
        }
      }
    }
  }
</script>

<style scoped>
  .decoration {
    padding: 32px;
    background-color: #f0f2f5;
  }
  .decoration-container {
    padding: 50px 100px;
    background-color: #fff;
  }

  .decoration-form {
    padding: 10px 100px;
    background-color: #fff;
  }

  .decoration-input {
    padding: 10px 100px;
    border-bottom: 1px solid #ccc;
  }

  .el-form-item {
    margin-bottom: 10px;
  }

  .decoration-list .el-input {
    width: 80% !important;
  }

  .submit-btn {
    margin-top: 10px;
  }
</style>
