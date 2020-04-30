<template>
  <div class="banner">
    <div class="banner-container">
      <el-table
        :data="list"
        border
        style="width: 100%">
        <el-table-column
          label="图片预览"
          width="180">
          <template slot-scope="scope">
            <img width="100px" height="100px" :src="domain + scope.row.imageUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="imageUrl"
          label="链接"
          width="180">
        </el-table-column>
        <el-table-column
          prop="seq"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">下架</span>
            <span v-if="scope.row.status == 2">上架</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">

            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改banner" :visible.sync="showDialog"
               :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="banner">
          <el-upload
            class="avatar-uploader"
            :action="base"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
            :data="fileType">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="form.link" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input type="number" v-model="form.seq" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="下架" :value="1"></el-option>
            <el-option label="上架" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showDialog = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

    import { getBannerList, bannerCreate, bannerModify, bannerModifyOrder } from '@/api/banner'
    import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
    export default {
      name: "banner",
      data() {
        return {
          tableKey: 0,
          list: null,
          total: 0,
          listLoading: true,
          // base: "http://47.107.111.34:8182/file/commonFileUpload",
          base: "http://seller-service-sit.cyblogs.com/file/commonFileUpload",
          params : {
            merchantId: 2,
          },
          form: {

          },
          showDialog: false,
          fileType: {fileType: 'pic'},
          domain: this.imgHost,
        }
      },
      created() {
        this.getList()
      },
      methods: {
        handleAvatarSuccess(res, file) {
          this.form.imageUrl = this.imgHost + res.returnData.fileUrl;
          this.form.link = res.returnData.fileUrl;
        },
        edit(row) {
          this.showDialog = true;
          this.form = {
            link: row.imageUrl,
            seq: row.seq,
            status: row.status,
            id: row.id,
            imageUrl: this.domain + row.imageUrl
          }
        },
        getList() {
          this.listLoading = true;
          getBannerList(this.params).then(response => {
            this.list = response.returnData;
            this.total = response.totalRow;
            this.listLoading = false
          })
        },
        submit() {
          // if (this.form.imageUrl.search(/http:\/\/47.107.111.34/) != -1) {
          if (this.form.imageUrl.indexOf(this.imgHost) != -1) {
            // this.form.imageUrl = this.form.imageUrl.replace(/http:\/\/47.107.111.34/,'')
            this.form.imageUrl = this.comFun.replaceString(this.imgHost, this.form.imageUrl)
          }
          let params = Object.assign(this.form)
          bannerModify(params)
            .then(
              res => {
                this.$message({
                  message: res.returnMsg,
                  type: 'success'
                });
                this.showDialog = false;
                this.getList();
              }
            )
        }
      },
    }
</script>

<style scoped>
  .banner {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .banner-container {
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
</style>
