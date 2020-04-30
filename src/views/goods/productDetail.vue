<template>
  <div class="product">
    <div class="product-container"></div>
  </div>
</template>

<script>
  import {productDetail} from "@/api/product"

  export default {
    name: "product-detail",
    data() {
      return {}
    },
    created(){
      this.getProductDetail();
    },
    methods: {
      getProductDetail() {
        productDetail({
          productId: 7
        }).then(
          res => {
          }
        )
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .product {
    padding: 32px;
    background-color: #f0f2f5;
    &-container {
      padding: 50px 100px;
      background-color: #fff;
    }
  }
</style>
