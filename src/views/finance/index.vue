<template>
  <div class="finance">
    <div class="finance-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive>
            <finance-tabs-panel :status="item.key" v-if="activeName==item.key" :type="item.key"></finance-tabs-panel>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import FinanceTabsPanel from './components/finance-tabs-panel'
  export default {
    name: "index",
    components: {
      FinanceTabsPanel
    },
    data() {
      return {
        activeName: '1',
        tabMapOptions: [
          {label: '未结清', key: '1'},
          {label: '已结清', key: '2'},
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
  .finance {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .finance-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
