<template>
  <div>
    <el-row class="search-area" :gutter="20">
      <el-form>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="账单号">
            <el-input size="mini" placeholder="请输入账单号" v-model="listQuery.billNo" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="用户名称">
            <el-input size="mini" placeholder="请输入用户名称" v-model="listQuery.customerName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="关联订单号">
            <el-input size="mini" placeholder="请输入关联订单号" v-model="listQuery.orderNo" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" :xl="6">
          是否逾期：<el-select size="mini" v-model="listQuery.isOverdue" placeholder="请选择">
          <el-option
            key="1"
            label="是"
            value="1">
          </el-option>
          <el-option
            key="2"
            label="否"
            value="2">
          </el-option>
        </el-select>
        </el-col>
        <el-col :md="24" :lg="24" :xl="12">
          <el-form-item label="结清截止日期"><el-date-picker
            size="mini"
            v-model="listQuery.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :md="24">
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
      <el-table-column label="账单号" prop="billNo" align="center">
      </el-table-column>
      <el-table-column label="账单总额（元）" prop="billAmount" align="center">
      </el-table-column>
      <el-table-column label="剩余未结（元）" prop="unpaidAmount" align="center">
      </el-table-column>
      <el-table-column label="账期" prop="billDate" align="center">
      </el-table-column>
      <el-table-column label="生成日期" prop="settleTime" align="center">
      </el-table-column>
      <el-table-column label="结清截止日期" prop="settleDeadlineDate" align="center">
      </el-table-column>
      <el-table-column label="是否逾期" align="center" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.isOverdue == 1">
            是
          </span>
          <span v-else-if="scope.row.isOverdue == 2">
            否
          </span>
        </template>
      </el-table-column>
      <el-table-column label="用户" prop="customerName" align="center"></el-table-column>
      <el-table-column label="关联订单号" prop="orderNo" align="center"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="repay(scope.row.billNo, scope.row.orderNo)">结算登记</el-button>
          <el-button size="small" type="text" @click="relatedOrder(scope.row)">查看关联订单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog
      title="结算登记"
      :visible.sync="repayDialog"
      :close-on-click-modal="false"
      width="30%">
      <div style="text-align: center">
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" style="position: relative;">
          <el-form-item label="本次还款" prop="repay" :label-width="formLabelWidth">
            <el-input placeholder="请输入金额，单位（元）" size="small" v-model="form.repay" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submit('form')">确认还款</el-button>
        <el-button size="small" @click="cancel('form')">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getBillList, billRepay} from "@/api/bill"
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "finance-tabs-panel",
    components: {Pagination},
    directives: {waves},
    props: {
      status
    },
    watch:{
      time(curVal, oldVal) {
        this.listQuery.settleDeadlineDateStart = curVal[0];
        this.listQuery.settleDeadlineDateEnd = curVal[1];
      }
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          billNo: '',
          orderNo: '',
          customerName: '',
          settleDeadlineDateStart: '',
          settleDeadlineDateEnd: '',
          time: '',
          billStatus: this.billStatus ? this.billStatus : this.status,
        },
        form: {
          repay: ''
        },
        rules: {
          repay: [{required: true, message: '请输入数字', trigger: 'blur'}]
        },
        billStatus: this.$route.query.status,
        repayDialog: false,
        formLabelWidth: "120px",
        billNo: '',
        orderNo: '',
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getBillList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow;
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList()
      },
      repay(billNo, orderNo) {
        this.repayDialog = true
        this.billNo = billNo
        this.orderNo = orderNo
      },
      closeDialog() {
        this.cancel('form')
      },
      cancel(formName) {
        this.repayDialog = false;
        this.$refs[formName].resetFields();
        this.form = {}
      },
      relatedOrder(row) {
        this.$router.push({path: "/order/detail", query: {orderNo: row.orderNo}})
      },
      /**
       * 确认还款
       * @param formName
       */
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              billNo: this.billNo,
              orderNo: this.orderNo,
              repayAmount: this.form.repay
            }
            billRepay(params).then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                });
                this.repayDialog = false;
                this.getList()
              }
            );
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<style scoped>

</style>
