<template>
  <div class="order">
    <div class="order-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive>
            <order-tabs-panel :status="item.key" v-if="activeName==item.key" :type="item.key"></order-tabs-panel>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import OrderTabsPanel from './components/order-tabs-panel'
  export default {
    name: "index",
    components: {
      OrderTabsPanel
    },
    data() {
      return {
        activeName: this.$route.query.status ? '' + this.$route.query.status : '1',
        tabMapOptions: [
          {label: '待报价', key: '1'},
          {label: '待审核', key: '2'},
          {label: '待支付', key: '3'},
          {label: '待发货', key: '4'},
          {label: '待收货', key: '5'},
          {label: '已收货', key: '6'},
          {label: '已取消', key: '7'},
        ],
      }
    },
    methods: {
      handleClick(tab, event) {
      },
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
