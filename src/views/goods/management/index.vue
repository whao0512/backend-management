<template>
  <div class="management">
    <div class="management-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive>
            <goods-tabs-panel :status="item.key" v-if="activeName==item.key" :type="item.key"></goods-tabs-panel>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import GoodsTabsPanel from './components/goods-tabs-panel'
  export default {
    name: "goods-management",
    components: {
      GoodsTabsPanel
    },
    data() {
      return {
        activeName: '1',
        tabMapOptions: [
          { label: '出售中', key: '1' },
          { label: '仓库中', key: '2' },
          { label: '已售罄', key: '3' },
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
  .management {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .management-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
