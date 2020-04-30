<template>
  <div>

    <div class="search-area">
      规格：<el-input size="mini" placeholder="请输入商品规格" v-model="listQuery.specName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      规格组：<el-select size="mini" v-model="listQuery.specGroupId" placeholder="请选择规格组">
        <el-option
          v-for="item in specGroupList"
          :key="item.id"
          :label="item.groupName"
          :value="item.id">
        </el-option>
    </el-select>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="operation('','single')">新增规格</el-button>
      <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="operation('','group')">新增规格组</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
      <el-table-column label="规格" prop="specName" align="center">
      </el-table-column>
      <el-table-column label="规格组" prop="specGroupName" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="operation(scope.row, 'edit')">编辑</el-button>
          <el-button size="mini" type="danger" @click="operation(scope.row,'delete')">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog
      title="提示"
      :visible.sync="confirmDialog"
      width="30%"
      :close-on-click-modal="false">
      <span>删除此规格</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="confirmDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('delete')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增规格组" :visible.sync="standardGroupVisible"
               :close-on-click-modal="false">
      <el-form :model="standardGroupForm" style="width: 50%;">
        <el-form-item label="规格组名称" :label-width="formLabelWidth">
          <el-input size="mini" v-model="standardGroupForm.groupName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="standardGroupVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('group')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增规格" :visible.sync="standardVisible"
               :close-on-click-modal="false">
      <el-form :model="standardForm" style="width: 50%;">
        <el-form-item label="规格名称" :label-width="formLabelWidth">
          <el-input size="mini" v-model="standardForm.specName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格组" :label-width="formLabelWidth">
          <el-select size="mini" v-model="standardForm.specGroupId" placeholder="请选择规格组">
            <el-option
              v-for="item in specGroupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="standardVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('single')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSpecList, specGroupCreate, specCreate, getSpecGroupList, specModify } from '@/api/spec'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "goods-standard",
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          specName: '',
          specGroupId: ''
        },
        standardForm: {
          specName: '',
          specGroupId: ''
        },
        standardGroupForm: {
          groupName: '',
        },
        confirmDialog: false,
        standardGroupVisible: false,
        standardVisible: false,
        formLabelWidth: '120px',
        specGroupList: [],
        specId: ''
      }
    },
    created() {
      this.getList();
      this.getSpecGroupList();
    },
    methods: {
      getList() {
        this.listLoading = true
        getSpecList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      getSpecGroupList() {
        getSpecGroupList({}).then(
          res => {
            this.specGroupList = res.returnData;
          }
        )
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      operation(row, type) {
        let params = {}
        switch(type) {
          case 'single':
            this.standardVisible = true;
            break;
          case 'group':
            this.standardGroupVisible = true;
            break;
          case 'edit':
            this.standardVisible = true;
            this.standardForm = {
              specName: row.specName,
              specGroupName: row.specGroupName
            };
            break;
          case 'delete':
            this.specId = row.id;
            this.confirmDialog = true;
            break;
        }
      },
      submit(type) {
        let params = {};
        if ( type == 'single') {
          specCreate(this.standardForm)
            .then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                })
                this.standardVisible = false;
                this.getList();
              }
            )
        } else if ( type == 'group' ) {
          specGroupCreate(this.standardGroupForm)
            .then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                })
                this.standardGroupVisible = false;
                this.getSpecGroupList();
              }
            )
        } else if ( type == 'delete') {
          params = {
            id: this.specId,
            isDeleted: 'Y'
          };
          specModify(params).then(
            res => {
              this.confirmDialog = false
              this.$message({
                message: res.returnMsg,
                type: 'success'
              })
              this.getList();
            }
          )
        }
      }
    }
  }
</script>

<style scoped>

</style>
