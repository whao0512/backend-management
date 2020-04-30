<template>
  <div>
    <el-row class="search-area" :gutter="20">
      <el-form>
      <el-col :md="12" :lg="12" :xl="6">
        <el-form-item label="手机号码">
          <el-input size="mini" placeholder="手机号码" v-model="listQuery.mobile" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="12" :xl="6">
        <el-form-item label="公司名称">
          <el-input size="mini" placeholder="公司名称" v-model="listQuery.companyName" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="12" :xl="6">
        <el-form-item label="证件类型">
          <el-select size="mini" v-model="listQuery.identityCardType" placeholder="请选择证件类型">
            <el-option span="显示" value="shanghai"></el-option>
            <el-option span="网络" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12" :lg="12" :xl="6">
        <el-form-item label="证件号码">
          <el-input size="mini" placeholder="证件号码" v-model="listQuery.identityCardNo" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        </el-form-item>
      </el-col>
      <el-col :md="24" :lg="24" :xl="12">
        <el-form-item label="注册时间"><el-date-picker
        size="mini"
        v-model="listQuery.registerTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
        </el-form-item>
      </el-col>
      </el-form>
    </el-row>
    <el-row>
      <el-col :md="24">
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
      <el-table-column label="注册手机号" prop="mobile" align="center" width="150px"></el-table-column>
      <el-table-column label="公司名称" prop="companyName" width="150px" align="center"></el-table-column>
      <el-table-column label="证件类型" prop="identityCardType"></el-table-column>
      <el-table-column label="证件号码" prop="identityCardNo" min-width="60px"></el-table-column>
      <el-table-column label="注册时间" prop="registerTime" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.registerTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="status != 1" label="业务员" prop="salesman" width="80px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '待审核'">--</span>
          <span v-if="scope.row.status == '已分配'">{{ scope.row.salesman}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="status != 1" label="状态" prop="status" width="80px" align="center"></el-table-column>
      <el-table-column v-if="status == 1" label="操作" width="80px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="approval(scope.row)">审核</el-button>
          </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog title="分配业务员" :visible.sync="approvalDialog" @close='closeDialog'
               :close-on-click-modal="false">
      <el-form ref="approvalForm" :model="approvalForm" :rules="approvalRules" label-width="80px" style="position: relative;">
        <el-form-item label="业务员" prop="salesMan">
          <el-select size="mini" v-model="approvalForm.salesMan" placeholder="请选择业务员">
            <el-option
              v-for="item in salesManList"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="approvalDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit('approvalForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getMemberList, memberApproval } from '@/api/member'
  import { getSysOperatorList } from '@/api/setUp'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "member-tabs-panel",
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
        listQuery: {
          pageNum: 1,
          pageSize: 10,
          status: this.status
        },
        salesManList: null,
        approvalDialog: false,
        approvalForm: {
          salesMan: ''
        },
        approvalRules: { // 表单验证规则
          salesMan: [{required: true, message: '请选择业务员', trigger: 'change'}]
        },
        customerId: '',
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getMemberList(this.listQuery).then(response => {
          this.list = response.returnData.data
          this.total = response.returnData.totalRow
            this.listLoading = false
        })
      },
      getSalesManList() {
        const params = {
          pageNum: 1,
          pageSize: 10,
          adminUserName: '',
        }
        getSysOperatorList(params).then(response => {
          this.salesManList = response.returnData.data
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      closeDialog() {
        this.cancel('approvalForm')
      },
      approval(row) {
        this.approvalDialog = true;
        this.getSalesManList()
        this.customerId = row.id;
      },
      submit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params = {
              customerId: this.customerId,
              saleManId: this.approvalForm.salesMan
            };
            memberApproval(params).then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                });
                this.approvalDialog = false;
                this.getList();
              }
            )
          } else {
            return false;
          }
        });

      },
      cancel(formName) {
        this.approvalDialog = false;
        this.$refs[formName].resetFields();
        this.approvalForm = {}
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .input-span {
    width: 120px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
</style>
