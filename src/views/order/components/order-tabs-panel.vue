<template>
  <div>
    <el-row class="search-area" :gutter="20">
      <el-form>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="订单号">
            <el-input size="mini" placeholder="请输入订单号" v-model="listQuery.orderNo" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="用户名称">
            <el-input size="mini" placeholder="请输入用户名称" v-model="listQuery.customerName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" :xl="6">
          <el-form-item label="手机号码">
            <el-input size="mini" placeholder="请输入手机号码" v-model="listQuery.mobile" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
          </el-form-item>
        </el-col>
        <el-col :md="24" :lg="24" :xl="12">
          <el-form-item label="下单时间"><el-date-picker
            size="mini"
            v-model="listQuery.orderTime"
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
      <el-table-column label="订单号" prop="orderNo" align="center">
      </el-table-column>
      <el-table-column label="用户名称" prop="customerName" align="center">
      </el-table-column>
      <el-table-column label="证件类型" prop="identityCardType" align="center">
      </el-table-column>
      <el-table-column label="证件号码" prop="identityCardNo" align="center">
      </el-table-column>
      <el-table-column label="注册手机号" prop="mobile" align="center">
      </el-table-column>
      <el-table-column label="默认定价合计（元）" prop="orderAmount" align="center">
      </el-table-column>
      <el-table-column label="订单状态" prop="orderStatus" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 1">
            待报价
          </span>
          <span v-else-if="scope.row.orderStatus == 2">
            待审核
          </span>
          <span v-else-if="scope.row.orderStatus == 3">
            待支付
          </span>
          <span v-else-if="scope.row.orderStatus == 4">
            待发货
          </span>
          <span v-else-if="scope.row.orderStatus == 5">
            待收货
          </span>
          <span v-else-if="scope.row.orderStatus == 6">
            已收货
          </span>
          <span v-else-if="scope.row.orderStatus == 7">
            已取消
          </span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" prop="orderTime" align="center">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="status == 1" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,1)">报价</el-button>
          <el-button v-if="status == 2" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,2)">审核</el-button>
          <el-button v-if="status == 3" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,3)">查看</el-button>
          <el-button v-if="status == 4" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,4)">查看</el-button>
          <el-button v-if="status == 4" type="text" @click="delivery(scope.row.orderNo,scope.row.customerId)">确认发货</el-button>
          <el-button v-if="status == 5" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,5)">查看</el-button>
          <el-button v-if="status == 5" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,5)">确认收货</el-button>
          <el-button v-if="status == 6" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,6)">查看</el-button>
          <el-button v-if="status == 7" type="text" @click="orderDetail(scope.row.orderNo,scope.row.customerId,7)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>

    <el-dialog
      title="物流信息"
      :visible.sync="shipInfoDialog"
      @close='closeDialog'
      :close-on-click-modal="false">
      <el-form :model="shipForm" :rules="shipRules" ref="shipForm" style="width: 50%;">
        <el-form-item label="物流信息" prop="shipInfo" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入物流信息"
            auto-complete="off"
            v-model="shipForm.shipInfo">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('shipForm')">取 消</el-button>
        <el-button size="small" type="primary" @click="submitShipInfo('shipForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getOrderList,
    getOrderDetail,
    submitApproval,
    approvePass,
    approveFail,
    orderCancel,
    confirmReceipt,
    confirmShip
  } from '@/api/order'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "order-tabs-panel",
    components: {Pagination},
    directives: {waves},
    props: {
      status
    },
    watch:{
      orderTime(curVal, oldVal) {
        this.listQuery.orderTimeStart = curVal[0];
        this.listQuery.orderTimeEnd = curVal[1];
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
          orderNo: '',
          customerName: '',
          mobile: '',
          orderTimeStart: '',
          orderTimeEnd: '',
          orderTime: '',
          orderStatus: this.orderStatus ? this.orderStatus : this.status,
        },
        shipForm: {
          shipInfo: '',
        },
        shipRules: {
          shipInfo: [{required: true, message: '请输入物流信息', trigger: 'blur'}],
        },
        orderStatus: this.$route.query.status,
        shipInfoDialog: false,
        formLabelWidth: "120px",
        orderNo: '',
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getOrderList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow;
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1;
        this.getList()
      },
       orderDetail(orderNo,customerId,status) {
        this.$router.push({path: '/order/detail', query: {orderNo: orderNo,customerId: customerId,status: status }})
      },
      /**
       * 确认发货弹框
       */
      delivery(orderNo) {
        this.orderNo = orderNo;
        this.shipInfoDialog = true;
      },
      closeDialog() {
        this.cancel('shipForm')
      },
      cancel(formName) {
        this.shipInfoDialog = false;
        this.$refs[formName].resetFields();
        this.shipForm = {}
      },
      /**
       * 确认发货
       */
      submitShipInfo(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            confirmShip(Object.assign(this.shipForm,{orderNo: this.orderNo})).then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                });
                this.shipInfoDialog = false,
                this.$router.push({path: '/order/index', query: {status: this.status,t: +new Date()}})
              }
            );
          } else {
            return false;
          }
        });
      },
    }
  }

</script>

<style scoped>

</style>
