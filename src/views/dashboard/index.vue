<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:18px;">
      <div>趋势分析</div>
      <div style="text-align: right;padding-right: 10px;">
        <el-button-group>
          <el-button size="small" @click="trend(7)" type="primary">近7天</el-button>
          <el-button size="small" @click="trend(30)" type="primary">近30天</el-button>
        </el-button-group>
      </div>
      <line-chart :chart-data="lineChartData"/>
    </el-row>

    <Common></Common>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import Common from './components/Common'
import {trendAnalysis} from '@/api/overview'

const lineChartData = {
    payAmountList: [],
    payOrderList: [],
    visitorList: [],
    dateList: []
};

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    Common,
  },
  data() {
    return {
      lineChartData: lineChartData,
    }
  },
  created() {
    this.trend(7);
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    trend(days) {
      trendAnalysis({days: days}).then(
        res => {
          this.lineChartData = res.returnData;
        }
      )
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
