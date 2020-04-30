<template>
  <div class="about">
    <div class="about-container">
      <el-form ref="form" :model="form" label-width="80px">
        <div class="basic-info">
          <p class="about-title">
            <span>公司概况</span>
          </p>
          <div class="about-content">
            <el-form-item label="公司照片">
              <el-upload
                class="avatar-uploader"
                :action="base"
                :show-file-list="false"
                :on-success="handleCompanyProfileSuccess"
                :before-upload="beforeAvatarUpload"
                :data="fileType">
                <img v-model="form.companyImgUrl" v-if="form.companyImgUrl"
                     :src="form.companyImgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="概况说明">
              <el-input :rows="5"
                        type="textarea"
                        v-model="form.companyStatement"
                        placeholder="请输入公司概况说明，限制1000字以内"
                        maxlength="1000"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="property">
          <p class="about-title">
            <span>合作伙伴</span>
            <el-button type="primary" size="small" style="float: right;position: relative;top:4px" @click="partnerCreate">新增</el-button>
          </p>
          <div class="about-content">
            <el-form-item label="图片">
              <el-upload
                class="avatar-uploader"
                :action="base"
                :show-file-list="false"
                :on-success="handlePartnerSuccess"
                :before-upload="beforeAvatarUpload"
                :data="fileType">
                <img v-model="form.partnerImgUrl" v-if="form.partnerImgUrl"
                     :src="form.partnerImgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="描述">
              <el-input type="textarea"
                        :rows="5"
                        v-model="form.partnerStatement"
                        placeholder="请输入描述，限制500字以内"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-button size="small" type="primary"
                   @click="onSubmit">保存
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { simpleOperate, merchantImageType } from "@/api/setUp"
  export default {
    name: "about",
    data() {
      return {
        form: {
          companyImgUrl: '',
          companyStatement: '',
          partnerImgUrl: '',
          partnerStatement: ''
        },
        // base: "http://47.107.111.34:8182/file/commonFileUpload",
        base: "http://seller-service-sit.cyblogs.com/file/commonFileUpload",
        // domain: 'http://47.107.111.34',
        domain: this.imgHost,
        fileType: {fileType: 'pic'},
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        uploadCompanyUrl: '',
        uploadPartnerUrl:'',
        companyData: '',
        partnerData: '',
      }
    },
    created() {
      this.getCompanyData();
      this.getPartnerData();
    },
    methods: {
      handleCompanyProfileSuccess(res, file) {
        this.form.companyImgUrl = this.domain + res.returnData.fileUrl;
        this.uploadCompanyUrl = res.returnData.fileUrl;
      },
      handlePartnerSuccess(res, file) {
        this.form.partnerImgUrl = this.domain + res.returnData.fileUrl;
        this.uploadPartnerUrl = res.returnData.fileUrl
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      partnerCreate(){
        this.form.partnerList.push({
          partnerImgUrl: '',
          partnerStatement: ''
        })
      },
      partnerDelete(index) {
        this.form.partnerList.splice(index, 1)
      },
      getCompanyData() {
        merchantImageType({
          imageType: '3'
        }).then(
          res => {
            this.companyData = res.returnData[0];
            this.form.companyImgUrl = this.domain + this.companyData.imageUrl
            this.form.companyStatement = this.companyData.imageDesc
          }
        )
      },
      getPartnerData() {
        merchantImageType({
          imageType: '4'
        }).then(
          res => {
            this.partnerData = res.returnData[0];
            this.form.partnerImgUrl = this.domain + this.partnerData.imageUrl;
            this.form.partnerStatement = this.partnerData.imageDesc;
          }
        )
      },
      onSubmit() {
        // if (this.form.companyImgUrl.search(/http:\/\/47.107.111.34/) != -1) {
        if (this.form.companyImgUrl.indexOf(this.imgHost) != -1) {
          // this.form.companyImgUrl = this.form.companyImgUrl.replace(/http:\/\/47.107.111.34/,'')
          this.form.companyImgUrl = this.comFun.replaceString(this.imgHost, this.form.companyImgUrl)
        }
        // if (this.form.partnerImgUrl.search(/http:\/\/47.107.111.34/) != -1) {
        if (this.form.partnerImgUrl.indexOf(this.imgHost) != -1) {
          // this.form.partnerImgUrl = this.form.partnerImgUrl.replace(/http:\/\/47.107.111.34/,'')
          this.form.partnerImgUrl = this.comFun.replaceString(this.imgHost, this.form.partnerImgUrl)
        }
        let params = [
          {
            imageType: '3',
            imageUrl: this.form.companyImgUrl,
            imageDesc: this.form.companyStatement,
            status: 2
          },
          {
            imageType: '4',
            imageUrl: this.form.partnerImgUrl,
            imageDesc: this.form.partnerStatement,
            status: 2
          }
        ]
        simpleOperate({
          images: params
        }).then(
          res => {
            this.$message({
              type: "success",
              message: res.returnMsg
            })
            this.getPartnerData();
            this.getCompanyData();
          }
        )
      }
    }

  }
</script>

<style rel="stylesheet" lang="scss">
  .about {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .about-container {
    padding: 50px 100px;
    background-color: #fff;
  }

  .about-content {
    padding: 10px 100px;
    background-color: #fff;
  }

  .about-title {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #F2F2F2;
    a{
      &:hover {
        color: red;
      }
    }
  }


  .basic-info-container {
    padding: 20px 200px;
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
