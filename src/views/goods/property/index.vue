<template>
  <div class="property">
    <div class="property-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive>
            <goods-property v-if="activeName==item.key &&activeName=='goodsProperty'" :type="item.key"></goods-property>
            <goods-standard v-if="activeName==item.key &&activeName=='goodsStandard'" :type="item.key"></goods-standard>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import GoodsProperty from './components/goods-property'
  import GoodsStandard from './components/goods-standard'
  export default {
    name: "goods-management",
    components: {
      GoodsProperty,
      GoodsStandard
    },
    data() {
      return {
        activeName: 'goodsStandard',
        tabMapOptions: [
          { label: '商品规格', key: 'goodsStandard' },
          { label: '商品属性', key: 'goodsProperty' },
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
  .property {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .property-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
