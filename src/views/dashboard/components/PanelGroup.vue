<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="money" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">昨日支付金额</div>
          <count-to :start-val="0" :end-val="yesterdayCount.yesterdayPayAmount" :duration="2600" class="card-panel-num"/>
          <div class="card-panel-total">累计 :<count-to :start-val="0" :end-val="yesterdayCount.totalPayAmount" :duration="2600" class="card-panel-num__total"/>元</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="table" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">昨日支付订单数</div>
          <count-to :start-val="0" :end-val="yesterdayCount.yesterdayPayOrder" :duration="3000" class="card-panel-num"/>
          <div class="card-panel-total">累计 :<count-to :start-val="0" :end-val="yesterdayCount.totalPayOrder" :duration="3000" class="card-panel-num__total"/>元</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="shopping" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">昨日支付人数</div>
          <count-to :start-val="0" :end-val="yesterdayCount.yesterdayPayer
" :duration="3200" class="card-panel-num"/>
          <div class="card-panel-total">累计 :<count-to :start-val="0" :end-val="yesterdayCount.totalPayer" :duration="3200" class="card-panel-num__total"/>元</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="people" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">昨日访客人数</div>
          <count-to :start-val="0" :end-val="yesterdayCount.totalVisitor" :duration="3600" class="card-panel-num"/>
          <div class="card-panel-total">累计 :<count-to :start-val="0" :end-val="yesterdayCount.yesterdayVisitor" :duration="3600" class="card-panel-num__total"/>元</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-ordering">
          <svg-icon icon-class="documentation" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待报价订单</div>
          <count-to :start-val="0" :end-val="orderCount.waitPrice" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-ordering-approval">
          <svg-icon icon-class="documentation" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待审核订单</div>
          <count-to :start-val="0" :end-val="orderCount.waitApprove" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-order-paying">
          <svg-icon icon-class="documentation" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待支付订单</div>
          <count-to :start-val="0" :end-val="orderCount.waitPay" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-order-deliver">
          <svg-icon icon-class="documentation" class-name="card-panel-icon"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待发货订单</div>
          <count-to :start-val="0" :end-val="orderCount.waitShip" :duration="3600" class="card-panel-num"/>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import CountTo from 'vue-count-to'
  import {businessCount, orderStatusCount} from '@/api/overview'

  export default {
    components: {
      CountTo
    },
    data(){
      return {
        yesterdayCount: {},
        orderCount: {},
      }
    },
    created(){
      this.getBusinessCount();
      this.getOrderStatusCount();
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      getBusinessCount() {
        businessCount().then(
          res => {
            this.yesterdayCount = res.returnData;
          }
        )
      },
      getOrderStatusCount() {
        orderStatusCount().then(
          res => {
            this.orderCount = res.returnData;
          }
        )
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      /* cursor: pointer; */
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        /*.card-panel-icon-wrapper {*/
          /*color: #fff;*/
        /*}*/
        /*.icon-people {*/
          /*background: #40c9c6;*/
        /*}*/
        /*.icon-message {*/
          /*background: #36a3f7;*/
        /*}*/
        /*.icon-money {*/
          /*background: #f4516c;*/
        /*}*/
        /*.icon-shopping {*/
          /*background: #34bfa3*/
        /*}*/
        /*.icon-ordering {*/
          /*background-color: #ad09c6;*/
        /*}*/
        /*.icon-ordering-approval {*/
          /*background-color: #8d888e;*/
        /*}*/
        /*.icon-order-paying {*/
          /*background-color: #20ee38;*/
        /*}*/
        /*.icon-order-deliver {*/
          /*background-color: #2104f9;*/
        /*}*/
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .icon-ordering {
        color: #ad09c6;
      }
      .icon-ordering-approval {
        color: #8d888e;
      }
      .icon-order-paying {
        color: #20ee38;
      }
      .icon-order-deliver {
        color: #2104f9;
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          /*margin-bottom: 12px;*/
          margin-bottom: 7px;
        }
        .card-panel-total {
          margin-top: 5px;
          font-size: 14px;
          font-weight: normal;
        }
        .card-panel-num {
          font-size: 20px;
          &__total {
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
