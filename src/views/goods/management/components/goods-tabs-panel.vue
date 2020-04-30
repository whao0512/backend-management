<template>
  <div>
    <div class="search-area">
      商品名称：
      <el-input size="small" placeholder="商品名称" v-model="listQuery.skuName" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      商品类目：
      <el-cascader size="small" :options="options" change-on-select v-model="val"></el-cascader>
      <el-button size="small" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
      <el-table-column label="默认定价(元)" prop="price" align="center">
      </el-table-column>
      <el-table-column label="库存" prop="stock" align="center">
      </el-table-column>
      <!-- <el-table-column label="总销量" prop="approbation" align="center">
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="{name: 'release',query: {productId:scope.row.productId}}">编辑</router-link>
          </el-button>
          <el-button type="text" @click="inStore(scope.row)">入库</el-button>
          <el-button type="text">
            <router-link :to="{name:'warehousing',params:{id:scope.row.id}}">入库记录</router-link>
          </el-button>
          <el-button v-if="status == 1" type="text" @click="onSell(scope.row)">上架</el-button>
          <el-button v-if="status == 2 || status == 3" type="text" @click="offSell(scope.row)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize"
                @pagination="getList"/>
    <el-dialog title="入库" :visible.sync="inStoreDialog"
               :close-on-click-modal="false">
      <el-form :model="inStoreForm" label-width="80px">
        <el-form-item label="入库数量">
          <el-input v-model="inStoreForm.quantity" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="inStoreDialog = false">取 消</el-button>
        <el-button type="primary" @click="quantitySubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="上架" :visible.sync="onSellDialog"
               :close-on-click-modal="false">
      <el-form :model="onSellForm" label-width="80px" style="position: relative;">
        <el-radio v-model="onSellForm.onSellType" label="1">立即上架</el-radio>
        <el-radio style="margin-right: 5px;" v-model="onSellForm.onSellType" label="2">自定义上架时间</el-radio>
        <el-date-picker
          style="position: absolute;top: -7px;"
          v-if="onSellForm.onSellType == 2"
          v-model="onSellForm.onSellTime"
          size="mini"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onSellDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSellSubmit()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="下架" :visible.sync="offSellDialog"
               :close-on-click-modal="false">
      <div style="text-align: center">确定下架此商品</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="offSellDialog = false">取 消</el-button>
        <el-button type="primary" @click="offSellSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getSkuList, skuInStore, onOrOffSale} from '@/api/sku'
  import {getAllCategoryList} from '@/api/category'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "goods-tabs-panel",
    components: {Pagination},
    directives: {waves},
    props: {
      status
    },
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        val: [],
        // vals: [],
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          status: this.status != 3 ? this.status : '',
          stock: this.status == 3 ? 0 : '',
          skuName: '',
          categoryLevelOneId: '',
          categoryLevelTwoId: '',
          categoryLevelThreeId: '',
        },
        inStoreForm: {
          quantity: ''
        },
        onSellForm: {
          onSellType: '',
          onSellTime: '',// 上架时间
        },
        goodsId: '',
        options: [],
        inStoreDialog: false,
        onSellDialog: false,
        offSellDialog: false,
      }
    },
    created() {
      this.getList();
      this.getCategory();
    },
    watch: {
      val: function (n, o) {
        let length = n.length;
        switch (length) {
          case 1:
            this.listQuery.categoryLevelOneId = n[0];
            break;
          case 2:
            this.listQuery.categoryLevelTwoId = n[1];
            break;
          case 3:
            this.listQuery.categoryLevelThreeId = n[2];
            break;
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        getSkuList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow;
          this.listLoading = false
        })
      },
      /**
       * 获取商品类目
       */
      getCategory() {
        getAllCategoryList({merchantId: 2})
          .then(
            res => {
              let batchdata = res.returnData;
              //valueBatch
              let dataValueBatch = batchdata => batchdata.map(({id, categoryName, childCategoryList}) => (childCategoryList ? {
                value: id,
                label: categoryName,
                children: dataValueBatch(childCategoryList),
              } : {
                value: id,
                label: categoryName,
              }));
              this.options = dataValueBatch(batchdata);
            }
          )
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      inStore(row) {
        this.inStoreDialog = true;
        this.goodsId = row.id;
      },
      /**
       * 入库
       */
      quantitySubmit() {
        const params = {
          skuId: this.goodsId,
          quantity: this.inStoreForm.quantity
        };
        skuInStore(params)
          .then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.inStoreDialog = false;
              this.getList();
            }
          )
      },
      onSell(row) {
        this.onSellDialog = true;
        this.goodsId = row.id;
      },
      /**
       * 上架
       */
      onSellSubmit() {
        if (!this.onSellForm.onSellType) {
          this.$message({
            message: '请选择上架类型',
            type: 'warning'
          });
          return;
        } else if (this.onSellForm.onSellType == 2 && !this.onSellForm.onSellTime) {
          this.$message({
            message: '请选择上架时间',
            type: 'warning'
          });
          return;
        }
        const params = {
          skuId: this.goodsId,
          opType: 2,
          effectTime: this.onSellForm.onSellTime ? this.onSellForm.onSellTime : ''
        };
        onOrOffSale(params)
          .then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.onSellDialog = false;
              this.getList();
            }
          )
      },
      offSell(row) {
        this.offSellDialog = true;
        this.goodsId = row.id;
      },
      /**
       * 下架
       */
      offSellSubmit() {
        const params = {
          skuId: this.goodsId,
          opType: 3,
          effectTime: '',
        };
        onOrOffSale(params)
          .then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.offSellDialog = false;
              this.getList();
            }
          )
      }
    }
  }

</script>

<style scoped>

</style>
