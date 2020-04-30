<template>
  <div class="brand">
    <div class="brand-container">
      <div class="search-area">
        品牌名称：
        <el-input size="mini" placeholder="请输入品牌名称" v-model="listQuery.brandName" style="width: 200px;"
                  class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <el-button size="mini" v-waves class="filter-item" type="primary" icon="el-icon-search"
                   @click="operation('', 'add')">新增品牌
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :key="tableKey"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;margin-top: 20px;border-top: 1px solid #eee;">
        <el-table-column label="中文名" prop="brandCnName" align="center">
        </el-table-column>
        <el-table-column label="英文名" prop="brandEnName" align="center">
        </el-table-column>
        <el-table-column label="LOGO" align="center">
          <template slot-scope="scope">
            <img class="img" :src="imgHost + scope.row.logoUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="seq" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="operation(scope.row, 'edit')">编辑</el-button>
            <el-button size="mini" type="danger" @click="operation(scope.row,'delete')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  @pagination="getList"/>

      <el-dialog
        title="提示"
        :visible.sync="confirmDialog"
        width="30%"
        :close-on-click-modal="false">
        <span>删除此品牌</span>
        <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="confirmDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="submit('delete')">确 定</el-button>
      </span>
      </el-dialog>

      <el-dialog :title="title" :visible.sync="brandVisible"
                 :close-on-click-modal="false">
        <el-form :model="brandForm" style="width: 50%;">
          <el-form-item label="中文名" :label-width="formLabelWidth">
            <el-input size="mini" v-model="brandForm.brandCnName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="英文名" :label-width="formLabelWidth">
            <el-input size="mini" v-model="brandForm.brandEnName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input size="mini" v-model="brandForm.seq" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="LOGO" :label-width="formLabelWidth">
            <!--<el-upload-->
              <!--class="avatar-uploader"-->
              <!--action="http://47.107.111.34:8182/file/commonFileUpload"-->
              <!--:show-file-list="false"-->
              <!--:on-success="handleAvatarSuccess"-->
              <!--accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"-->
              <!--:data="fileType">-->
              <!--<img v-if="brandForm.logoUrl" :src="brandForm.logoUrl" class="avatar">-->
              <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
            <el-upload
              class="avatar-uploader"
              action="http://seller-service-sit.cyblogs.com/file/commonFileUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
              :data="fileType">
              <img v-if="brandForm.logoUrl" :src="brandForm.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="brandVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="submit('add')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getBrandList, brandModify, brandCreate} from '@/api/brand'
  import {imgUrl} from '@/filters/index'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import waves from '@/directive/waves' // Waves directive
  export default {
    name: "goods-tabs-panel",
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
          brandName: '',
        },
        brandForm: {
          brandCnName: '',
          brandEnName: '',
          seq: '',
          logoUrl: '',
        },
        brandVisible: false,
        confirmDialog: false,
        formLabelWidth: '120px',
        imageUrl: '',
        fileType: {fileType: 'pic'},
        title: '',
        isAddOperation: '',
        brandId: '',
        // domain: 'http://47.107.111.34',
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getBrandList(this.listQuery).then(response => {
          this.list = response.returnData.data;
          this.total = response.returnData.totalRow
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.pageNum = 1
        this.getList()
      },
      operation(row, type) {
        if (type == 'edit') {
          this.isAddOperation = 'edit';
          this.title = '修改品牌'
          this.brandVisible = true;
          this.brandForm = {
            brandCnName: row.brandCnName,
            brandEnName: row.brandEnName,
            seq: row.seq,
            logoUrl: this.imgHost + row.logoUrl,
            id: row.id,
          }
        } else if (type == 'add') {
          this.isAddOperation = 'add';
          this.title = '新增品牌'
          this.brandVisible = true;
        } else if (type == 'delete') {
          this.confirmDialog = true;
          this.brandId = row.id;
        }
      },
      submit(type) {
        // if (this.brandForm.logoUrl.search(/http:\/\/47.107.111.34/) != -1) {
        if (this.brandForm.logoUrl.indexOf(this.imgHost) != -1) {
          // this.brandForm.logoUrl = this.brandForm.logoUrl.replace(/http:\/\/47.107.111.34/,'')
          this.brandForm.logoUrl = this.comFun.replaceString(this.imgHost, this.brandForm.logoUrl)
        }
        if (type == 'add' && this.isAddOperation == 'add') {
          brandCreate(this.brandForm).then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.brandVisible = false;
              this.getList();
            }
          )
        } else if (type == 'add' && this.isAddOperation == 'edit') {
          brandModify(this.brandForm).then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.brandVisible = false;
              this.getList();
            }
          )
        } else if (type == 'delete') {
          let params = {
            id: this.brandId,
            isDeleted: 'Y'
          }
          brandModify(params).then(
            res => {
              this.$message({
                message: res.returnMsg,
                type: 'success'
              });
              this.confirmDialog = false;
              this.getList();
            }
          )
        }
      },
      handleAvatarSuccess(res, file) {
        // this.brandForm.logoUrl = "http://47.107.111.34" + res.returnData.fileUrl;
        this.brandForm.logoUrl = this.imgHost + res.returnData.fileUrl;
      },
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .brand {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .brand-container {
    padding: 50px 100px;
    background-color: #fff;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .img {
    display: inline-block;
    width: 50px;
    height: 50px;
  }
</style>

