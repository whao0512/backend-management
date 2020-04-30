<template>
  <div class="about">
    <div class="about-container">
      <el-form ref="editForm" :model="editForm" :rules="editRules" label-width="80px">
        <el-form-item label="帮助中心" prop="photo">
          <el-upload
            :action="base"
            list-type="picture-card"
            :before-upload="beforeUploadPicture"
            :show-file-list="true"
            :on-preview="handlePictureCardPreview"
            :on-progress="uploadProgress"
            :on-remove="handleRemove"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
            :on-success="uploadSuccess"
            :file-list="editFiles"
            :data="fileType">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    merchantImageType,
    merchantImageCreate,
    merchantImageModify,
    merchantImageModifyOrAdd,
    simpleOperate,
  } from '@/api/setUp'

  export default {
    name: "common-problem",
    data() {
      return {
        // base: "http://47.107.111.34:8182/file/commonFileUpload",
        base: "http://seller-service-sit.cyblogs.com/file/commonFileUpload",
        editForm: { // 编辑表单
          photo: ''  // 活动图片
        },
        editRules: { // 表单验证规则
          photo: [{required: true, message: '请上传活动图片', trigger: 'blur'}]
        },
        editFiles: [],// 编辑时已上传图片初始化
        uploadComplete: true, // 图片上传完成状态
        dialogImageUrl: '',
        dialogVisible: false,
        fileType: {fileType: 'pic'},
        // domain: 'http://47.107.111.34',
      }
    },
    created() {
      this.initInfo();
    },
    methods: {
      // 编辑
      initInfo() {
        // 这里photo应从服务器获取，存储的是数组，请按照相应格式获取图片url（这里直接给值）
        let temp = [];
        merchantImageType({imageType: 6}).then(
          res => {
            temp = res.returnData;
            if(temp.length > 0){
              for(let t=0; t<temp.length; t++){
                //通过[{name: 'name', url: 'url地址'}]格式初始化照片墙
                // if (temp[t]['imageUrl'].search(/47.107.111.34/) != -1) {
                if (temp[t]['imageUrl'].indexOf(this.imgHost) != -1) {
                  this.editFiles.push({name: temp[t].id, url: temp[t].imageUrl});
                } else {
                  this.editFiles.push({name: temp[t].id, url: this.imgHost + temp[t].imageUrl});
                }
                if(t===0){
                  this.editForm.photo += temp[t].imageUrl
                } else {
                  // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开），根据实际需要修改格式
                  this.editForm.photo += ',' + temp[t].imageUrl;
                }
              }
            }
          }
        );


        // this.dialogVisible = true;
      },
      // 上传图片前调用方法
      beforeUploadPicture(file) {
        if(file.size > 5*1024*1024){
          this.$message.error("上传图片不能大于5M");
          return false;
        }
      },
      // 上传图片时调用
      uploadProgress(event,file, fileList){
        this.uploadComplete = false;
      },
      handleRemove(file, fileList) {
        this.fileChange(fileList);
      },
      // 设置photo值
      fileChange(fileList) {
        let temp_str = '';
        if(fileList.length > 0){
          for(let i=0; i<fileList.length; i++){
            if(fileList[i].response){
              if(fileList[i].response.returnCode === '000000'){
                if(i===0){
                  temp_str += fileList[i].response.returnData.fileUrl;
                } else {
                  temp_str += ',' + fileList[i].response.returnData.fileUrl;
                }
              }
            } else if(fileList[i].status && fileList[i].status === 'success'){
              if(i===0){
                temp_str += fileList[i].url;
              } else {
                temp_str += ',' + fileList[i].url;
              }
            }
          }
        }
        this.editForm.photo = temp_str;
      },
      // 图片预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 上传图片成功
      uploadSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange(fileList);
      },
      // 移除图片
      // handleRemove(file, fileList) {
      //   this.fileChange(fileList);
      // },
      onSubmit() {
        if(!this.uploadComplete){
          this.$message.error("图片正在上传，请稍等");
          return;
        }
        const params = [];

        if (this.editForm.photo.indexOf(',') > 0) {
          let imageUrls  = this.editForm.photo.split(",");
          let imagesFormat = imageUrls.map(
            v => {
              // if (v.search(/http:\/\/47.107.111.34/) != -1) {
              if (v.indexOf(this.imgHost) != -1) {
                // return v.replace(/http:\/\/47.107.111.34/,'')
                return this.comFun.replaceString(this.imgHost, v)
              } else {
                return v
              }
            }
          );
          imagesFormat.forEach(
            v => {
              params.push({
                imageUrl: v,
                imageType: '6',
                imageDesc: '',
                status: 2
              })
            }
          )

        } else if (this.editForm.photo) {
          let singe;
          // if (this.editForm.photo.search(/http:\/\/47.107.111.34/) != -1) {
          if (this.editForm.photo.indexOf(this.imgHost) != -1) {
            // singe =  this.editForm.photo.replace(/http:\/\/47.107.111.34/,'')
            singe =  this.comFun.replaceString(this.imgHost, this.editForm.photo)
          } else {
            singe =  this.editForm.photo
          }
          params.push({
            imageUrl: singe,
            imageType: '6',
            imageDesc: '',
            status: 2
          })
        }


        simpleOperate({
          images: params
        }).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.$router.push({path: '/layout/dashboard'})
          }
        )
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
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
