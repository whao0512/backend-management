<template>
  <div class="warehousing">
    <div class="warehousing-container">
      <div class="search-area">
        入库时间：
        <el-date-picker
          size="mini"
          v-model="time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
        <el-table-column label="商品" prop="skuName" align="center">
        </el-table-column>
        <el-table-column label="入库数量" prop="opNum" align="center">
        </el-table-column>
        <el-table-column label="入库后存量" prop="stock" align="center">
        </el-table-column>
        <el-table-column label="入库时间" prop="gmtCreated" align="center">
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                  @pagination="getList"/>
    </div>
  </div>
</template>

<script>
  import { getStockRecordList } from '@/api/sku'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "warehousing",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        time: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          skuId: this.$route.query.id,
        },
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true
        getStockRecordList(this.listQuery).then(response => {
          this.list = response.returnData.data
          this.total = response.returnData.totalRow
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .warehousing {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .warehousing-container {
    padding: 50px 100px;
    background-color: #fff;
  }
</style>
