<template>
  <div>
    <div class="order-info-bd">
      <div class="order-info-bd-main">
        <div class="order-info-bd-title">
          <span>订单详情</span>
        </div>
        <div class="order-info-bd-content">
          <ul class="cells">
            <li class="cell">
              <div class="cell-hd">用户：</div>
              <div class="cell-bd">{{data.customerName}}</div>
            </li>
            <li class="cell">
              <div class="cell-hd">证件类型：</div>
              <div class="cell-bd">
                <span v-if="data.identityCardType == 1">身份证</span>
                <span v-else-if="data.identityCardType == 2">军官证</span>
                <span v-else-if="data.identityCardType == 3">护照</span>
                <span v-else-if="data.identityCardType == 4">统一信用代码</span>
                <span v-else-if="data.identityCardType == 5">组织机构代码</span>
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">证件号码：</div>
              <div class="cell-bd">{{data.identityCardNo}}</div>
            </li>
            <li class="cell">
              <div class="cell-hd">注册手机号：</div>
              <div class="cell-bd">{{data.mobile}}</div>
            </li>
            <li class="cell">
              <div class="cell-hd">收货信息：</div>
              <div v-for="item in data.orderAddress" class="cell-bd">
                <span>{{item}} </span>
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">订单号：</div>
              <div class="cell-bd">
                {{data.orderNo}}
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">默认定价合计：</div>
              <div class="cell-bd">
                {{data.orderAmount}} 元
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">订单状态：</div>
              <div class="cell-bd">
                <span v-if="data.orderStatus == 1">待报价</span>
                <span v-else-if="data.orderStatus == 2">待审核</span>
                <span v-else-if="data.orderStatus == 3">待支付</span>
                <span v-else-if="data.orderStatus == 4">待发货</span>
                <span v-else-if="data.orderStatus == 5">待收货</span>
                <span v-else-if="data.orderStatus == 6">已收货</span>
                <span v-else-if="data.orderStatus == 7">已取消</span>
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">下单时间：</div>
              <div class="cell-bd">
                {{data.orderTime}}
              </div>
            </li>
            <li class="cell" v-if="data.orderStatus == 4 || data.orderStatus == 5 || data.orderStatus == 6 || data.orderStatus == 7">
              <div class="cell-hd">账期：</div>
              <div class="cell-bd">
                {{data.billDays}}天
              </div>
            </li>
            <li class="cell" v-if="data.orderStatus == 4 || data.orderStatus == 5 || data.orderStatus == 6 || data.orderStatus == 7">
              <div class="cell-hd">结清截止日期：</div>
              <div class="cell-bd">
                {{data.settleDeadlineTime}}
              </div>
            </li>
            <li class="cell" v-if="data.orderStatus == 5 || data.orderStatus == 6 || data.orderStatus == 7">
              <div class="cell-hd">物流信息：</div>
              <div class="cell-bd">
                {{data.shippingInfo}}
              </div>
            </li>
            <li class="cell">
              <div class="cell-hd">商品清单：</div>
              <div class="cell-bd">
                <el-table
                  :data="data.orderGoodsList"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="goodsName"
                    label="商品名称">
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    label="默认定价">
                  </el-table-column>
                  <el-table-column
                    label="专供定价">
                    <template slot-scope="scope">
                      <span v-if="status == 1">
                        <el-input v-model="scope.row.specialPrice" placeholder="请输入内容"></el-input>
                      </span>
                      <span v-else>{{scope.row.specialPrice}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="num"
                    label="数量">
                  </el-table-column>
                  <el-table-column
                    prop="total"
                    label="默认定价合计">
                  </el-table-column>
                  <el-table-column
                    prop="specialTotal"
                    label="专供定价合计">
                    <template slot-scope="scope">
                      <span v-model="scope.row.specialTotal">
                        {{scope.row.specialPrice * scope.row.num}}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 20px;">
      <el-col :md="3" v-if="status == 1">
        <el-button size="small" type="primary" @click="submitConfirm('submitApproval')">提交审核</el-button>
      </el-col>
      <el-col :md="3" v-if="status == 2">
        <el-button size="small" type="primary" @click="submitConfirm('approvePass')">审核通过</el-button>
      </el-col>
      <el-col :md="3" v-if="status == 2">
        <el-button size="small" type="primary" @click="submitConfirm('approveFail')">审核不通过</el-button>
      </el-col>
      <el-col :md="3" :lg="2" v-if="status == 3|| status == 4 || status == 5 || status == 6 || status == 7">
        <el-button size="small" type="primary" @click="back(status)">返回</el-button>
      </el-col>
      <el-col :md="3" v-if="status == 4">
        <el-button size="small" type="primary" @click="submitShip()">确认发货</el-button>
      </el-col>
      <el-col :md="3" v-if="status == 5">
        <el-button size="small" type="primary" @click="submitConfirm('confirmReceipt')">确认收货</el-button>
      </el-col>
      <el-col :md="3" v-if="status == 1 || status == 2 || status == 3|| status == 4">
        <el-button size="small" type="danger" @click="submitConfirm('orderCancel')">取消订单</el-button>
      </el-col>
    </el-row>


    <el-dialog
      title="提示"
      :visible.sync="confirmDialog"
      :close-on-click-modal="false"
      width="30%">
      <div style="text-align: center">{{tip}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="confirmDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit(type)">确 定</el-button>
      </div>
    </el-dialog>


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
    getOrderDetail,
    submitApproval,
    approvePass,
    approveFail,
    orderCancel,
    confirmReceipt,
    confirmShip
  } from '@/api/order'

  export default {
    name: "order-detail",
    data() {
      return {
        data: {
          customerName: '', // 用户名称
          identityCardType: '', // 证件类型
          identityCardNo: '', // 证件号码
          mobile: '', // 注册手机号码
          orderAddress: [], // 收货信息
          orderNo: '', // 订单号码
          orderAmount: '', // 默认定价合计
          orderStatus: '', // 订单状态
          orderTime: '', // 下单时间
          orderGoodsList: [], // 商品清单
        },
        shipForm: {
          shipInfo: '',
        },
        shipRules: {
          shipInfo: [{required: true, message: '请输入物流信息', trigger: 'blur'}],
        },
        orderNo: this.$route.query.orderNo,
        status: this.$route.query.status,
        tip: '',
        confirmDialog: false,
        shipInfoDialog: false,
        formLabelWidth: "120px",
      }
    },
    created() {
      this.orderDetail();
    },
    methods: {
      orderDetail() {
        getOrderDetail({
          orderNo: this.orderNo,
          customerId: this.$route.query.customerId,
        }).then(
          res => {
            this.data = res.returnData;
          }
        )
      },
      back(status) {
        this.$router.push({path: "/order/index", query: {status: status}})
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
       * 确认弹框
       */
      submitConfirm(type) {
        this.confirmDialog = true;
        this.type = type;
        switch ( type ) {
          case 'submitApproval':
            this.tip = '确认提交审核？';
            break;
          case 'orderCancel':
            this.tip = '确认取消订单？';
            break;
          case 'approvePass':
            this.tip = '确认审核通过？';
            break;
          case 'approveFail':
            this.tip = '确认审核不通过并驳回订单？';
            break;
          case 'confirmReceipt':
            this.tip = '确认已收货？';
            break;
          default:
            return;
        }
      },
      /**
       * 确认发货弹框
       */
      submitShip() {
        this.shipInfoDialog = true;
      },
      /**
       * 提交审核
       */
      submitApproval() {
        let params = {
          orderNo: this.orderNo,
          priceList: this.data.orderGoodsList
        };
        submitApproval(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
            this.$router.push({path: '/order/index', query: {status: this.status}})
          }
        )
      },
      /**
       * 取消订单
       */
      orderCancel() {
        let params = {
          orderNo: this.orderNo,
        };
        orderCancel(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
            this.$router.push({path: '/order/index', query: {status: this.status}})
          }
        )
      },
      /**
       * 审核通过
       */
      approvePass() {
        let params = {
          orderNo: this.orderNo,
          approveStatus: '2'
        };
        approvePass(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
            this.$router.push({path: '/order/index', query: {status: this.status}})
          }
        )
      },
      /**
       * 审核不通过
       */
      approveFail() {
        let params = {
          orderNo: this.orderNo,
          approveStatus: '3'
        };
        approveFail(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
            this.$router.push({path: '/order/index', query: {status: this.status}})
          }
        )
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
                this.$router.push({path: '/order/index', query: {status: this.status}})
              }
            );
          } else {
            return false;
          }
        });
      },
      /**
       * 确认收货
       */
      confirmReceipt() {
        let params = {
          orderNo: this.orderNo
        };
        confirmReceipt(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.confirmDialog = false;
            this.$router.push({path: '/order/index', query: {status: this.status}})
          }
        )
      },

      submit() {
        switch ( this.type ) {
          case 'submitApproval':
            this.submitApproval();
            break;
          case 'orderCancel':
            this.orderCancel();
            break;
          case 'approvePass':
            this.approvePass();
            break;
          case 'approveFail':
            this.approveFail();
            break;
          case 'confirmReceipt':
            this.confirmReceipt();
            break;
          default:
            return;
        }
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .order-info-hd {
    width: 250px;
    padding-top: 20px;
    border-right: 1px dashed #DDE1E5;
    text-align: center;
  }

  .order-info-bd {
    width: 100%;
    /*padding: 20px;*/
  }

  .layui-form-label {
    width: 90px;
  }

  .button-area {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .tooltip .tooltip-inner {
    color: #000;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: left;
  }

  .tooltip .tooltip-arrow {
    display: none;
  }

  .order-info-bd-title {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    background-color: #f4f4f4;
    border-bottom: 1px solid #e3e3e3;
  }

  .order-info-bd-title span {
    float: left;
    color: #111;
  }

  .order-info-bd-title a {
    float: right;
    margin-top: 7px;
  }

  .order-info-bd-main {
    border: 1px solid #e3e3e3;
  }

  .btn-edit {
    width: 70px;
    height: 26px;
    line-height: 26px;
    background-color: #76B5E8;

  }

  .btn-edit span {
    display: inline-block;
    width: 100%;
    color: #fff !important;
  }

  .order-info-bd-content {
    padding: 0 20px;
  }

  .cell {
    display: -webkit-flex;
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .cell:not(:last-child) {
    border-bottom: 1px solid #E2E2E3;
  }

  .cell-hd {
    width: 150px;
    font-size: 14px;
    color: #333;
  }

  .cell-bd {
    color: #999;
  }

  li.cell:last-child {
    min-height: 300px;
    .cell-bd {
      width: 80%;
      &:last-child {
        margin-top: 15px;
      }
    }
  }
</style>
