<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      list-type="picture-card"
      accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
      :data="fileType"
      :file-list="imgList"
      :show-file-list="showFileList"
      :on-success="picUploadSuccess"
      :on-preview="picPreview"
      :on-remove="picRemove"
      :before-upload="beforePicUpload">
      <img width="146px" height="146px" v-model="localImg" v-if="localImg"
           :src="localImg" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImgUrl" alt="">
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'uploadImg',
  props: {
    showFileList: {
      type: Boolean,
      default: false,
    },
    imgList: {
      type: [Object, Array],
      default: ()=>{},
    },
    imgUrl: ''
  },
  data() {
    return {
      uploadUrl: `${this.$api}/file/commonFileUpload`,
      fileType: {fileType: 'pic'},
      filesList: [],
      dialogImgUrl: '',
      dialogVisible: false,
      localImg: '',
      serviceImg: '',
      localFileList: [],
      serviceFileList: []
    }
  },
  methods: {
    picUploadSuccess(res, file, fileList) {
      debugger;
      if (this.showFileList) {
        this.serviceFileList = fileList;
        // this.serviceFileList.forEach(
        //   v => {
        //     console.log(v.url)
        //     if (v.url.indexOf(this.imgHost) != -1) {
        //       v.url = this.comFun.replaceString(this.imgHost, v.url)
        //     } else {
        //       v.url = v
        //     }
        //   }
        // );
        this.$emit('uploadSuccess', this.serviceFileList)
      } else {
        this.localImg = file.url;
        this.serviceImg = res.returnData.fileUrl;
        this.$emit('uploadSuccess', this.serviceImg)
      }
    },
    picPreview(file) {
      this.dialogImgUrl = file.url;
      this.dialogVisible = true;
    },
    picRemove(file, fileList) {
      if (this.showFileList) {
        this.serviceFileList = fileList;
        // this.serviceFileList.forEach(
        //   v => {
        //     console.log(v.url)
        //     if (v.url.indexOf(this.imgHost) != -1) {
        //       v.url = this.comFun.replaceString(this.imgHost, v.url)
        //     } else {
        //       v.url = v
        //     }
        //   }
        // );
        this.$emit('remove', this.serviceFileList)
      } else {

      }
    },
    beforePicUpload(file) {
      debugger;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
  },
  watch: {
    'imgUrl': {
      handler: function(newValue) {
        if (newValue) this.localImg = this.imgHost + newValue;
      },
      immediate: true,
    },
    'imgList': {
      handler(newValue, oldValue) {
        this.localFileList = newValue
      },
      deep: true,
    }
  }
}
</script>

<style scoped>

</style>
