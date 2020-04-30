<template>
  <div class="operator">
    <div class="operator-container">
      <el-row class="search-area" :gutter="20">
        <el-col :md="12" :xl="6">
          <span class="input-span" for="">操作员名称：</span>
          <el-input size="mini" placeholder="请输入管理员名称" v-model="listQuery.adminUserName" style="width: 200px;"
                    class="filter-item"
                    @keyup.enter.native="handleFilter"/>
        </el-col>
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询
        </el-button>
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="add()">添加操作员
        </el-button>
      </el-row>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
        <el-table-column label="操作员名称" prop="userName" align="center" width="150px">
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="operation(scope.row, 'reset')">重置密码</el-button>
            <el-button size="small" type="primary" @click="operation(scope.row, 'edit')">编辑</el-button>
            <el-button size="small" type="danger" @click="operation(scope.row,'delete')">注销</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                  @pagination="getList"/>

      <el-dialog title="重置密码"
                 :visible.sync="resettingDialog"
                 :close-on-click-modal="false"
                 @close='closeDialog'>
        <el-form ref="resettingForm" :model="resettingForm" :rules="rules" style="width: 50%;">
          <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="resettingForm.password" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancel('resettingForm')">取 消</el-button>
          <el-button size="mini" type="primary" @click="resetSubmit('resettingForm')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="confirmDialog"
        width="30%"
        :close-on-click-modal="false">
        <span>确定注销该用户</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="confirmDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit('')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getSysOperatorList,
    logOffSysOperator,
    sysOperatorCreate,
    resetSysOperatorPwd
  } from '@/api/setUp'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  import md5 from 'js-md5';
  export default {
    name: "operator",
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
          adminUserName: '',
        },
        resettingForm: {
          password: ''
        },
        rules: {
          password: [{required: true, message: '请填写登陆密码', trigger: 'blur'}],
        },
        confirmDialog: false,
        resettingDialog: false,
        formLabelWidth: '120px',
        operatorId: '',
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getSysOperatorList(this.listQuery).then(response => {
          this.list = response.returnData.data
          this.total = response.returnData.totalRow
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      operation(row, type) {
        if (type == 'delete') {
          this.confirmDialog = true;
          this.operatorId = row.id;
        } else if (type == 'edit') {
          this.$router.push({
            path: '/set-up/administrator-add',
            query: {
              id: row.id,
              userName: row.userName,
              showPwd: false,
              menuAuthority: row.menuAuthority
            }
          })
        }else if ( type == 'reset') {
          this.resettingDialog = true;
          this.operatorId = row.id
        }
      },
      submit() {
        logOffSysOperator({id: this.operatorId}).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
          }
        )
      },
      resetSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resetSysOperatorPwd({
              id: this.operatorId,
              newPassword: md5(this.resettingForm.password),
            }).then(
              res => {
                this.$message({
                  type: 'success',
                  message: res.returnMsg
                });
                this.resettingDialog = false;
                this.getList();
              }
            )
          }
        });

      },
      closeDialog() {
        this.cancel('resettingForm')
      },
      cancel(formName) {
        this.resettingDialog = false;
        this.$refs[formName].resetFields();
        this.resettingForm = {}
      },
      add() {
        this.$router.push('/set-up/administrator-add')
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .input-span {
    width: 120px;
  }

  .operator {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .operator-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
