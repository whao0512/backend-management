<template>
  <div class="order">
    <div class="order-container">
      <order-detail></order-detail>
    </div>
  </div>
</template>

<script>
  import OrderDetail from './components/order-detail'
  export default {
    name: "detail",
    components: {
      OrderDetail
    },
    data(){
      return {}
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .order {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .order-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
