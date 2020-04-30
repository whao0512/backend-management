<template>
  <div class="product-desc">
    <div class="product-desc-left">
      <span>{{specGroup.specGroupName}}</span>
    </div>
    <div class="product-desc-right">
      <div class="desc-right-detail"
        v-for="(spec, index) in specGroup.specList"
        :key="spec.id || index"
      >
        <span>{{spec.specName}}</span>
        <span>{{spec.specValue}}</span>
      </div>
      <!-- <div class="desc-right-detail">
        <span>品牌名称</span>
        <span>华为</span>
      </div>
      <div class="desc-right-detail">
        <span>批准文号</span>
        <span>粤123456</span>
      </div>
      <div class="desc-right-detail">
        <span>型号</span>
        <span>S123</span>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    specGroup: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>

<style rel="stylesheet" lang="scss" scoped>
  .product-desc {
    display: flex;
    padding-bottom: 25px;
    border-bottom: 1px dashed #999999;
    span {
      font-size: 14px;
      color: #666666;
      display: inline-block;
      line-height: 24px;
    }
    .product-desc-left {
      width: 88px;
      text-align: center;
    }
    .product-desc-right {
      .desc-right-detail {
        span:nth-child(1) {
          width: 75px;
          text-align: right;
        }
        span:nth-child(2) {
          margin-left: 18px;
        }
      }
    }
  }
</style>
