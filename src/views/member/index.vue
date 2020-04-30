<template>
  <div class="management">
    <div class="management-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
          <keep-alive>
            <MemberTabsPanel :status="item.key" v-if="activeName==item.key" :type="item.key"></MemberTabsPanel>
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import MemberTabsPanel from './components/member-tabs-panel'
  export default {
    name: "member",
    components: {
      MemberTabsPanel
    },
    data() {
      return {
        activeName: this.$route.query.status ? this.$route.query.status + '' : '-1',
        tabMapOptions: [
          { label: '全部会员', key: '-1' },
          { label: '待审核', key: '1' },
          { label: '已审核', key: '2' },
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
