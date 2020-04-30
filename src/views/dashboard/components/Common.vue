<template>
  <div class="common">
    <div>常用功能</div>
    <el-row class="common-list">
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/member/member', query: {status: 1}}">会员审核</router-link></el-button>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/goods/release'}">发布商品</router-link></el-button>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/order', query: {status: 1}}">订单报价</router-link></el-button>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/order', query: {status: 2}}">订单审核</router-link></el-button>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/order', query: {status: 4}}">订单发货</router-link></el-button>
      </el-col>
      <el-col :xs="12" :sm="8" :lg="2" :md="3" class="common-list-item">
          <el-button size="small"><router-link :to="{path: '/finance/finance', query: {status: 4}}">结账登记</router-link></el-button>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  export default {
    name: "common",
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .common {
    margin-top: 18px;
    padding: 16px;
    background: #fff;
  }

  .common-list-item {
    padding: 10px;
    a {
      color: #333;
      font-size: 14px;
      &:hover {
        cursor: pointer;
        color: #f4516c;
      }
    }
  }
</style>
