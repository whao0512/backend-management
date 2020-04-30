<template>
  <div class="shop-info">
    <div class="shop-info-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="商城域名">
          <el-input maxlength="25" v-model="form.mallDomainName" readonly="readonly" placeholder="限制25个字符"></el-input>
        </el-form-item>
        <el-form-item label="商家名称">
          <el-input maxlength="25" v-model="form.merchantName" placeholder="限制25个字符"></el-input>
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="form.shopName" maxlength="100" placeholder="限制100个字符"></el-input>
        </el-form-item>
        <el-form-item label="欢迎语">
          <el-input v-model="form.welcomeWord" maxlength="100" placeholder="限制100个字符"></el-input>
        </el-form-item>
        <el-form-item label="资质说明">
          <el-input type="textarea" v-model="form.qualificationStatment"></el-input>
        </el-form-item>
        <el-form-item label="客服热线">
          <el-input maxlength="25" v-model="form.serviceTelphone" placeholder="限制25个字符"></el-input>
        </el-form-item>
        <el-form-item label="服务时间">
          <el-input maxlength="25" v-model="form.serviceHour" placeholder="限制25个字符"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input maxlength="25" type="email" v-model="form.email" placeholder="限制25个字符"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input maxlength="100" type="email" v-model="form.address" placeholder="限制100个字符"></el-input>
        </el-form-item>
        <el-form-item label="商城LOGO">
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--:action="base"-->
            <!--:show-file-list="false"-->
            <!--:on-success="handleLogoSuccess"-->
            <!--:before-upload="beforeUploadPicture"-->
            <!--accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"-->
            <!--:data="fileType">-->
            <!--<img v-model="form.uploadLogoUrl" v-if="form.uploadLogoUrl" :src="form.uploadLogoUrl" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
          <upload-img :show-file-list="false"
                      @uploadSuccess="imgUploadSuccess($event, 'logo')"
                      :img-url="form.uploadLogoUrl"
          >
          </upload-img>
        </el-form-item>
        <el-form-item label="特色说明">
          <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--:action="base"-->
            <!--:show-file-list="false"-->
            <!--:on-success="handleFeatureSuccess"-->
            <!--:before-upload="beforeUploadPicture"-->
            <!--accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"-->
            <!--:data="fileType">-->
            <!--<img v-model="featureUrl" v-if="featureUrl" :src="featureUrl" class="avatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
          <!--</el-upload>-->
          <upload-img :show-file-list="false"
                      @uploadSuccess="imgUploadSuccess($event, 'feature')"
                      :img-url="featureUrl"
          >
          </upload-img>
        </el-form-item>
        <el-form-item label="资质证书" prop="certification">
          <!--<el-upload-->
            <!--:action="base"-->
            <!--list-type="picture-card"-->
            <!--:before-upload="beforeUploadPicture"-->
            <!--:show-file-list="true"-->
            <!--:on-preview="handlePictureCardPreview"-->
            <!--:on-progress="uploadProgress"-->
            <!--:on-remove="handleRemove"-->
            <!--accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"-->
            <!--:on-success="uploadSuccess"-->
            <!--:file-list="certificationFiles"-->
            <!--:data="fileType">-->
            <!--<i class="el-icon-plus"></i>-->
          <!--</el-upload>-->
          <!--<el-dialog :visible.sync="dialogVisible">-->
            <!--<img width="100%" :src="dialogImageUrl" alt="">-->
          <upload-img :show-file-list="true"
                      @uploadSuccess="imgUploadSuccess($event, 'certification')"
                      @remove="removeImg($event, 'certification')"
                      :img-list="certificationFiles"
          >
          </upload-img>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="submit()">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {
    merchantInfoModify,
    merchantInfo,
    merchantImageType,
    merchantImageCreate,
    merchantImageModify,
    merchantImageModifyOrAdd,
    modify4Image
  } from '@/api/setUp'

  import UploadImg from '@/components/UploadImg'

  export default {
    name: "shop-info",
    components: {
      UploadImg
    },
    data() {
      return {
        form: {
          mallDomainName: '', // 商家域名
          shopName: '', // 公司名称
          merchantName: '', //商家名称
          welcomeWord: '', //商家欢迎语
          qualificationStatment: '', // 资质说明
          serviceTelphone: '',
          serviceHour: '',// 服务时间
          email: '',
          address: '',
          logoUrl: '', // 商城Logo
          uploadLogoUrl: '',
          certification: '', // 资质证书
        },
        // base: "http://47.107.111.34:8182/file/commonFileUpload",
        base: "http://seller-service-sit.cyblogs.com/file/commonFileUpload",
        featureUrl: '',
        uploadFeatureUrl: '',
        certificationFiles: [],// 编辑时已上传图片初始化
        uploadComplete: true, // 图片上传完成状态
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        fileType: {fileType: 'pic'},
        merchant: '',
        domain: this.imgHost,
      }
    },
    created() {
      this.getMerchantInfo();
      this.getFeatureImage();
      this.initInfo();
    },
    methods: {
      getMerchantInfo() {
        merchantInfo({}).then(
          res => {
            this.merchant = res.returnData;
            this.form = {
              mallDomainName: this.merchant.mallDomainName,
              shopName: this.merchant.shopName, // 商城名称
              merchantName: this.merchant.merchantName, //商家名称
              welcomeWord: this.merchant.welcomeWord, //欢迎语
              qualificationStatment: this.merchant.qualificationStatment, // 资质说明
              serviceTelphone: this.merchant.serviceTelphone,
              serviceHour: this.merchant.serviceHour,// 服务时间
              email: this.merchant.email,
              address: this.merchant.address,
              logoUrl: this.merchant.logoUrl, // 商城Logo
              // uploadLogoUrl: this.imgHost + this.merchant.logoUrl,
              uploadLogoUrl: this.merchant.logoUrl,
            }
          }
        )
      },

      /**
       * 获取特色说明图片
       */
      getFeatureImage() {
        merchantImageType({imageType: 2}).then(
          res => {
            if (res.returnData != null) {
              // this.featureUrl = this.imgHost + res.returnData[0].imageUrl;
              this.featureUrl = res.returnData[0].imageUrl;
              // this.uploadFeatureUrl = res.returnData[0].imageUrl
            }
          }
        )
      },

      initInfo() {
        let temp = [];

        /**
         * 获取资质证书图片
         */
        merchantImageType({imageType: 1}).then(
          res => {
            temp = res.returnData;
            if (temp.length > 0) {
              for (let t = 0; t < temp.length; t++) {
                //通过[{name: 'name', url: 'url地址'}]格式初始化照片墙
                this.certificationFiles.push({name: temp[t].id, url: this.imgHost + temp[t].imageUrl});
                // this.certificationFiles.push({name: temp[t].id, url: temp[t].imageUrl});
                if (t === 0) {
                  this.form.photo += temp[t].imageUrl
                } else {
                  // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开），根据实际需要修改格式
                  this.form.photo += ',' + temp[t].imageUrl;
                }
              }
            }
          }
        );
      },
      /**
       * Logo上传成功的回调
       * @param res
       * @param file
       */
      // handleLogoSuccess(res, file) {
      //   this.form.logoUrl = file.url;
      //   this.form.uploadLogoUrl = this.imgHost + res.returnData.fileUrl
      // },
      /**
       * 特色说明上传成功后的回调
       * @param res
       * @param file
       */
      // handleFeatureSuccess(res, file) {
      //   this.featureUrl = file.url;
      //   this.uploadFeatureUrl = res.returnData.fileUrl;
      // },
      /**
       * 图片上传前大小限制
       * @param file
       * @returns {boolean}
       */
      // beforeUploadPicture(file) {
      //   const isLt2M = file.size / 1024 / 1024 < 2;
      //   if (!isLt2M) {
      //     this.$message.error('上传头像图片大小不能超过 2MB!');
      //   }
      //   return isLt2M;
      // },
      // handleRemove(file, fileList) {
      //   this.fileChange(fileList)
      // },
      // handlePictureCardPreview(file) {
      //   this.dialogImageUrl = file.url;
      //   this.dialogVisible = true;
      // },
      // 上传图片时调用
      // uploadProgress(event, file, fileList) {
      //   this.uploadComplete = false;
      // },
      // 上传图片成功
      // uploadSuccess(res, file, fileList) {
      //   this.uploadComplete = true;
      //   this.fileChange(fileList);
      // },
      imgUploadSuccess(val, type) {
        switch( type ) {
          case 'logo':
            this.form.logoUrl = val;
            break;
          case 'feature':
            this.featureUrl = val;
            break;
          case 'certification':
            this.form.photo = this.formatFileList(val)
            break;
        }
        // this.uploadComplete = true;
        // this.fileChange(fileList);
      },
      removeImg(val, type) {
        if ( type == 'certification' ) {
          this.form.photo = this.formatFileList(val)
        }
      },

      formatFileList(val) {
        let certificationList = [],
          formatList = [],
          photo = [];
        certificationList = val;
        certificationList.forEach(value => {
          if (value.response) {
            formatList.push(value.response.returnData.fileUrl)
          } else {
            formatList.push(value.url)
          }
        })
        if (formatList.length == 1){
          photo = formatList[0]
        } else {
          photo = formatList.join(',')
        }
        return photo;
      },
      // 设置photo值
      // fileChange(fileList) {
      //   let temp_str = '';
      //   if (fileList.length > 0) {
      //     for (let i = 0; i < fileList.length; i++) {
      //       if (fileList[i].response) {
      //         if (fileList[i].response.returnCode === '000000') {
      //           if (i === 0) {
      //             temp_str += fileList[i].response.returnData.fileUrl;
      //           } else {
      //             temp_str += ',' + fileList[i].response.returnData.fileUrl;
      //           }
      //         }
      //       } else if (fileList[i].status && fileList[i].status === 'success') {
      //         if (i === 0) {
      //           temp_str += fileList[i].url;
      //         } else {
      //           temp_str += ',' + fileList[i].url;
      //         }
      //       }
      //     }
      //   }
      //   this.form.photo = temp_str;
      // },
      submit() {
        /**
         * 基本信息修改
         */
        // let imgHost = this.imgHost;
        // if (this.uploadFeatureUrl.search(/http:\/\/47.107.111.34/) != -1) {
        // if (this.uploadFeatureUrl.indexOf(imgHost) != -1) {
        //   // this.uploadFeatureUrl = this.uploadFeatureUrl.replace(imgHost, '')
        //   this.uploadFeatureUrl = this.comFun.replaceString(imgHost, this.uploadFeatureUrl)
        // }
        // if (this.form.uploadLogoUrl.indexOf(imgHost) != -1) {
        //   // this.form.uploadLogoUrl = this.form.uploadLogoUrl.replace(imgHost, '')
        //   // this.form.logoUrl = this.form.uploadLogoUrl.replace(imgHost, '');
        //   this.form.uploadLogoUrl = this.comFun.replaceString(imgHost, this.form.uploadLogoUrl)
        //   this.form.logoUrl = this.comFun.replaceString(imgHost, this.form.uploadLogoUrl);
        // } else {
        //   // this.form.logoUrl = this.form.uploadLogoUrl.replace(imgHost, '');
        //   this.form.logoUrl = this.comFun.replaceString(imgHost,this.form.uploadLogoUrl);
        // }
        let imagesList = [
          {
            // imageUrl: this.uploadFeatureUrl,
            imageUrl: this.featureUrl,
            imageType: 2,
            imageDesc: '',
            status: 2,
          }
        ];
        if (this.form.photo && this.form.photo.indexOf(',') > 0) {
          let imageUrls = this.form.photo.split(",");
          let imagesFormat = imageUrls.map(
            v => {
              if (v.indexOf(this.imgHost) != -1) {
                // return v.replace(/http:\/\/47.107.111.34/, '')
                return this.comFun.replaceString(this.imgHost, v)
              } else {
                return v
              }
            }
          );
          imagesFormat.forEach(
            v => {
              imagesList.push({
                imageUrl: v,
                imageType: 1,
                imageDesc: '',
                status: 2
              })
            }
          );
        } else if (this.form.photo) {
          let single;
          if (this.form.photo.indexOf(this.imgHost) != -1) {
            // single = this.form.photo.replace(/http:\/\/47.107.111.34/, '')
            single = this.comFun.replaceString(this.imgHost, this.form.photo)
          } else {
            single = this.form.photo
          }
          imagesList.push({
            imageUrl: single,
            imageType: 1,
            imageDesc: '',
            status: 2
          })
        }

        let params = Object.assign(this.form, {merchantImages: imagesList})
        modify4Image(params).then(
          res => {
            this.$message({
              message: res.returnMsg,
              type: 'success'
            });
            this.getMerchantInfo();
            this.getFeatureImage();
            // this.initInfo();
          }
        )
      }
    }
  }
</script>

<style rel="stylesheet" lang="scss" scoped>
  .shop-info {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .shop-info-container {
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
    width: 146px;
    height: 146px;
    line-height: 146px;
    text-align: center;
  }

  .avatar {
    width: 146px;
    height: 146px;
    display: block;
  }
</style>
