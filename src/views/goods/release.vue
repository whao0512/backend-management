<template>
  <div class="release">
    <div class="release-container">
      <el-form ref="form" :model="form" :rules="rulesForm" label-width="80px">
        <div class="basic-info">
          <p class="release-title">
            基本信息
          </p>
          <div class="release-content">
            <el-form-item label="商品名称" prop="name">
              <el-input size="small" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="version">
              <el-input size="small" v-model="form.version"></el-input>
            </el-form-item>
            <el-form-item label="批准文号" prop="licenseNumber">
              <el-input size="small" v-model="form.licenseNumber"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-select size="small" v-model="form.brand" placeholder="请选择品牌">
                <el-option
                  v-for="item in brandData"
                  :key="item.id"
                  :label="item.brandCnName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品图片" prop="productPhoto">
              <el-upload
                :action="base"
                list-type="picture-card"
                :limit="10"
                :headers="{'seller_domain': this.seller_domain}"
                :before-upload="beforeUploadPicture"
                :show-file-list="true"
                :on-preview="handlePictureCardPreview"
                :on-progress="uploadProgress"
                :on-remove="handleRemove"
                :data="fileType"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                :on-success="handleProductSuccess"
                :file-list="productFiles">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="商品类目" prop="productCategory">
              <el-cascader
                size="small"
                :options="options"
                change-on-select
                v-model="val"
              ></el-cascader>
              <el-button size="small" class="filter-item" type="primary">
                <router-link :to="{name:'category'}">新增类目</router-link>
              </el-button>
            </el-form-item>
          </div>
        </div>
        <div class="property">
          <p class="release-title">
            规格
          </p>
          <div class="release-content">
            <el-form-item label="规格组" prop="standard">
              <el-select size="small" v-model="form.standard" placeholder="全部" @change="getSpecData">
                <el-option
                  v-for="item in specGroupList"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div v-for="(item, index) in specGroupChoosedList">
              <div>
                <span>{{item.specGroupName}}</span>
                <el-button @click="specDelete(index)" size="small" type="danger">删除</el-button>
                <div v-for="spec in item.specList">
                  <p>
                    {{spec.specName}}
                    <el-input v-model="spec.specValue"></el-input>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="property">
          <p class="release-title">
            属性
          </p>
          <div class="release-content">
            <el-form-item label="属性" prop="property">
              <el-select size="small" v-model="form.property" @change="propertySelected" placeholder="全部">
                <el-option
                  v-for="item in propertyList"
                  :key="item.id"
                  :label="item.attributeName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="property-item" v-for="(item, index) in propertyDetailList">
              <div class="property-name">{{item.attributeName}}</div>
              <div class="property-value">
                <el-tag
                  :key="tag"
                  v-for="tag in item.attributeValueList"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag, item.attributeId)">
                  {{tag}}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="item.status"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(item.attributeId, index)"
                  @blur="handleInputConfirm(item.attributeId, index)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">+ New Tag</el-button>
              </div>
              <el-button size="small" type="danger" @click="deletePropertyDetail(index)">删除</el-button>
            </div>
            <!--<el-button type="primary" size="small">生成sku</el-button>-->
          </div>
        </div>
        <div class="sku-area">
          <p class="release-title">
            SKU设置
          </p>
          <div class="release-content">
            <el-table
              :data="skuData"
              style="width: 100%">
              <el-table-column
                label="SKU"
                width="180">
                <template slot-scope="scope">
                  <span v-for="data in scope.row.attributeList">
                    {{data['skuAttributeValue']}}
                  </span>
                  <span v-for="data in scope.row.attributeList">
                    <span v-for="value in data">
                      {{value['skuAttributeValue']}}
                    </span>
                  </span>
                  <!--{{scope.row.sku.skuAttributeValue}}-->
                  <!--{{scope.row.sku[0]['skuAttributeValue']}}-{{scope.row.sku[1]['skuAttributeValue']}}-->
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="默认定价"
                width="180">
                <template slot-scope="scope">
                  <input type="text" v-model="scope.row.price">
                  <el-checkbox :checked="scope.row.priceType == 1 ? false : true" true-label="2" false-label="1" v-model="scope.row.priceType">隐藏</el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="other">
          <p class="release-title">
            其他
          </p>
          <div class="release-content">
            <el-form-item label="产品介绍" prop="productIntroPhoto">
              <el-upload
                :action="base"
                list-type="picture-card"
                :limit="10"
                :before-upload="beforeUploadPicture"
                :show-file-list="true"
                :on-preview="handlePictureCardPreview"
                :on-progress="uploadProgress"
                :on-remove="handleRemove"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                :on-success="handleProductIntroSuccess"
                :file-list="productIntroFiles"
                :data="fileType">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
            <el-form-item label="注册证" prop="register">
              <el-upload
                class="avatar-uploader"
                :action="base"
                :show-file-list="false"
                :on-success="handleRegisterSuccess"
                :before-upload="beforeUploadPicture"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                :data="fileType">
                <img v-model="form.registerUrl" v-if="form.registerUrl" :src="form.registerUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="售后保障" prop="afterSellUrl">
              <el-upload
                class="avatar-uploader"
                :action="base"
                :show-file-list="false"
                :on-success="handleAfterSellSuccess"
                :before-upload="beforeUploadPicture"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF"
                :data="fileType">
                <img v-model="form.afterSellUrl" v-if="form.afterSellUrl" :src="form.afterSellUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button @click="onSubmit('form', 'preview')" type="primary" size="small">保存并预览</el-button>
              <el-button @click="onSubmit('form', 'create')" type="primary" size="small">发布</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getBrandList} from "@/api/brand"
  import {getAllCategoryList} from '@/api/category'
  import {getSpecGroupList, getSpecList} from '@/api/spec'
  import {getSkuAttributeList, getSkuAttributeDetail} from '@/api/sku'
  import {productCreate, productModify, productDetail} from '@/api/product'

  export default {
    name: "release",
    data() {
      return {
        form: {
          name: '',
          version: '',
          licenseNumber: '',
          brand: '',
          productPhoto: '',
          registerUrl: '', // 注册证
          afterSellUrl: '',// 售后保障
          productIntroPhoto: '', // 产品介绍图片
        },
        rulesForm: { // 表单验证规则
          name: [{required: true, message: '请填写商品名称', trigger: 'blur'}],
          version: [{required: true, message: '请填写型号', trigger: 'blur'}],
          licenseNumber: [{required: true, message: '请填写批准文号', trigger: 'blur'}],
          brand: [{required: true, message: '请选择品牌', trigger: 'change'}],
          // productPhoto: [{required: true, message: '请上传商品图片', trigger: 'blur'}],
          // productCategory: [{required: true, message: '请选择商品类目', trigger: 'change'}],
          // standard: [{required: true, message: '请选择规格组', trigger: 'change'}],
          // property: [{required: true, message: '请选择属性', trigger: 'change'}],
          // photo: [{required: true, message: '请上传产品介绍', trigger: 'blur'}],
          // afterSellUrl: [{required: true, message: '请上传售后保障', trigger: 'blur'}],
        },
        val: [], // 选取的类目ID集
        brandData: null,
        // base: "http://47.107.111.34:8182/file/commonFileUpload",
        base: "http://seller-service-sit.cyblogs.com/file/commonFileUpload",
        // domain: 'http://47.107.111.34',
        domain: 'http://seller-service-sit.cyblogs.com',
        fileType: {fileType: 'pic'},
        specGroupList: null, // 规格组List
        specList: [], // 规格list
        dialogImageUrl: '',
        dialogVisible: false,
        options: [], // 类目
        propertyList: null, // 属性List
        propertyDetailList: [], // 属性值list
        tempArr: [],
        inputVisible: false,
        inputValue: '', // 属性输入的值
        uploadComplete: true, // 图片上传完成状态
        specGroupChoosed: '',// 选中的规格组
        specGroupChoosedList: [], // 选中的规格组中的规格
        productFiles: [],  // 商品图片
        tempProductFiles: [], // 临时存放的商品图片
        productIntroFiles: [],// 产品介绍
        tempProductIntroFiles: [],// 临时存放的商品介绍图片
        skuData: [], // sku
        categoryLevelOneId: '', // 类目一级id
        categoryLevelTwoId: '', // 类目二级id
        categoryLevelThreeId: '', // 类目三级id
        skuAttributeList: [],
        productId: this.$route.query.productId,
        skuId: this.$route.query.skuId,
        PRODUCTIAMGETYPE: 1, // 商品图片类型
        PRODUCTDETAILIAMGETYPE: 2, // 商品详情图片
        REGISTERIAMGETYPE: 3, // 注册证图片
        AFTERSELLIAMGETYPE: 4, // 售后
        PRODUCTINTROIAMGETYPE: 5,  // 商品介绍
        seller_domain: sessionStorage.getItem('seller_domain')
      }
    },
    created() {
      this.getAllBrand();
      this.getCategory();
      this.getSpecGroupList();
      this.getPropertyList();
      if (this.productId) {
        this.productDetail()
      }
    },
    watch: {
      val: function (n, o) {
        let length = n.length;
        switch (length) {
          case 1:
            this.categoryLevelOneId = n[0];
            break;
          case 2:
            this.categoryLevelTwoId = n[1];
            break;
          case 3:
            this.categoryLevelThreeId = n[2];
            break;
        }
      }
    },
    methods: {
      initInfo(type) {
        let temp = [];
        if ( type == 1) {
          temp = this.tempProductFiles;
        } else if ( type == 5 ) {
          temp = this.tempProductIntroFiles
        }
        if (temp.length > 0) {
          for (let t = 0; t < temp.length; t++) {
            //通过[{name: 'name', url: 'url地址'}]格式初始化照片墙
            if (type == 1) {
              this.productFiles.push(
                {name: temp[t].id, url: temp[t].imageUrl}
              )
            };
            if (type == 5) {
              this.productIntroFiles.push(
                {name: temp[t].id, url: temp[t].imageUrl}
              )
            };
            if (t === 0 && type == 1) {
              this.form.productPhoto += temp[t].imageUrl
            } else if(t != 0 && type == 1) {
              // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开），根据实际需要修改格式
              this.form.productPhoto += ',' + temp[t].imageUrl;
            }

            if (t === 0 && type == 5) {
              this.form.productIntroPhoto += temp[t].imageUrl
            } else if(t != 0 && type == 5) {
              // 最终photo的格式是所有已上传的图片的url拼接的字符串（逗号隔开），根据实际需要修改格式
              this.form.productIntroPhoto += ',' + temp[t].imageUrl;
            }
          }
        }
      },
      productDetail() {
        productDetail({
          productId: this.productId,
        }).then(
          res => {
            let data = res.returnData;
            this.form = {
              name: data.productName,
              version: data.model,
              licenseNumber: data.approbation,
              brand: data.brandId,
              productPhoto: '', // 商品图片
              registerUrl: this.typeOfImage(data.imagesList, this.REGISTERIAMGETYPE), // 注册证
              afterSellUrl: this.typeOfImage(data.imagesList, this.AFTERSELLIAMGETYPE), // 售后保障
              productIntroPhoto: '', // 产品介绍图片
            };
            this.val = [data.categoryLevelOneId, data.categoryLevelTwoId, data.categoryLevelThreeId];
            this.specGroupChoosedList = data.specGroupList; // 规格数组
            this.propertyDetailList = data.attributeAndValueList; // 属性数组
            // for (let i = 0; i < this.propertyDetailList.length; i++) {
            //   for ( let j = 0; j< this.propertyDetailList[i]['attributeValueList'].length; j++) {
            //     this.tempArr.push({
            //       attributeId: this.propertyDetailList[i]['attributeId'],
            //       attributeName: this.propertyDetailList[i]['attributeName'],
            //       attributeValueList: this.propertyDetailList[i]['attributeValueList'],
            //       status: false,
            //       propertyList: []
            //     })
            //     this.tempArr[i].propertyList.push({
            //         "skuAttributeId": this.propertyDetailList[i].attributeId,
            //         "skuAttributeName": this.propertyDetailList[i].attributeName,
            //         "skuAttributeValue": this.propertyDetailList[i]['attributeValueList'][j]
            //     })
            //   }
            //   console.log(this.tempArr)
            // }
            this.propertyDetailList.forEach(
              (v,idx) => {
                v.propertyList = [];
                for( let i = 0; i < v['attributeValueList'].length;i++){
                  v.propertyList.push({
                    "skuAttributeId": v.attributeId,
                    "skuAttributeName": v.attributeName,
                    "skuAttributeValue": v['attributeValueList'][i]
                  })
                }
              }
            );
            this.skuData = data.skuList;
            this.typeOfImage(data.imagesList, this.PRODUCTINTROIAMGETYPE); // 产品介绍图片
            this.typeOfImage(data.imagesList, this.PRODUCTIAMGETYPE); // 产品介绍图片
            this.initInfo(this.PRODUCTIAMGETYPE);
            this.initInfo(this.PRODUCTINTROIAMGETYPE);
          }
        )
      },
      /**
       * 判断不同类型的image
       * @param imageList
       * @param typeId
       * @returns {*}
       */
      typeOfImage(imageList, typeId) {
        for ( let i = 0; i < imageList.length; i++) {
          if ( imageList[i]['type'] == typeId) {
            if (typeId == 5 && imageList[i]['imageUrl']) {
              this.tempProductIntroFiles.push({imageUrl: this.domain + imageList[i]['imageUrl'], id: imageList[i]['id']})
            } else if (typeId == 1 && imageList[i]['imageUrl']) {
              this.tempProductFiles.push({imageUrl: this.domain + imageList[i]['imageUrl'], id: imageList[i]['id']})
            }  else {
              return this.domain + imageList[i]['imageUrl']
            }
          }
        }
      },
      handleRemove(file, fileList) {
        this.fileChange(fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /**
       * 图片上传前大小限制
       * @param file
       * @returns {boolean}
       */
      beforeUploadPicture(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      handleProductIntroSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange(fileList, 'productIntroPhoto');
      },
      handleProductSuccess(res, file, fileList) {
        this.uploadComplete = true;
        this.fileChange(fileList, 'productPhoto');
      },
      handleRegisterSuccess(res, file) {
        this.form.registerUrl = this.domain + res.returnData.fileUrl;
      },
      handleAfterSellSuccess(res, file) {
        this.form.afterSellUrl = this.domain + res.returnData.fileUrl;
      },
      // 上传图片时调用
      uploadProgress(event, file, fileList) {
        this.uploadComplete = false;
      },
      // 设置photo值
      fileChange(fileList, type) {
        let temp_str = '';
        if (fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].response) {
              if (fileList[i].response.returnCode === '000000') {
                if (i === 0) {
                  temp_str += fileList[i].response.returnData.fileUrl;
                } else {
                  temp_str += ',' + fileList[i].response.returnData.fileUrl;
                }
              }
            } else if (fileList[i].status && fileList[i].status === 'success') {
              if (i === 0) {
                temp_str += fileList[i].url;
              } else {
                temp_str += ',' + fileList[i].url;
              }
            }
          }
        }
        if (type == 'productPhoto') {
          this.form.productPhoto = temp_str;
        } else if (type == 'productIntroPhoto') {
          this.form.productIntroPhoto = temp_str;
        }
      },
      /**
       * 选择属性
       */
      propertySelected() {
        let propertyDetailItem = {};

        getSkuAttributeDetail({id: this.form.property}).then(
          res => {
            propertyDetailItem = {
              attributeValueList: [],
              propertyList: [],
              attributeId: res.returnData.id,
              attributeName: res.returnData.attributeName,
              status: false
            };
            if(this.propertyDetailList.length == 0) {
              this.propertyDetailList.push(propertyDetailItem);
            } else {
              for ( let i = 0; i< this.propertyDetailList.length; i++) {
                if (this.propertyDetailList[i]['attributeId'] == this.form.property) {
                  return;
                }
              }
              this.propertyDetailList.push(propertyDetailItem);
            }
          }
        );
      },
      specDelete(index) {
        this.specGroupChoosedList.splice(index, 1)
      },
      /**
       *获取规格组中的规格
       */
      getSpecData() {
        getSpecList({
          pageNum: 1,
          pageSize: 50,
          specGroupId: this.form.standard
        }).then(
          res => {
            this.specList = res.returnData.data;
            this.specGroupChoosed = this.specList.forEach(
              v => {
                return v['specGroupName']
              }
            );
            let specListChoosed = [];
            this.specList.forEach(
              v => {
                specListChoosed.push({
                  "specGroupId": v.specGroupId,
                  "specId": v.id,
                  "specName": v.specName,
                  "specValue": '',
                })
              }
            );
            let specGroupChooedItem = {
              specGroupName: this.specGroupChoosed,
              specList: specListChoosed
            };
            this.specGroupChoosedList.push(specGroupChooedItem);
          }
        )
      },

      /**
       * 删除属性值
       */
      deletePropertyDetail(index) {
        this.propertyDetailList.splice(index, 1);
        let attributeList = [];
        this.propertyDetailList['attributeValueList'].forEach(
          v => {
            attributeList.push(v)
          }
        );
        if (attributeList.length != 0) {
          this.skuData = this.doExchange(attributeList);
        } else {
          this.skuData = null
        }
      },

      handleClose(tag, id) {
        this.propertyDetailList.forEach(
          v => {
            if (v.attributeId == id) {
              v['attributeValueList'].splice(v['attributeValueList'].indexOf(tag), 1);
            }
          }
        );
        let attributeList = [];
        this.propertyDetailList.forEach(
          v => {
            attributeList.push(v['attributeValueList'])
          }
        );
        this.skuData = this.doExchange(attributeList);
      },

      showInput(index) {
        this.inputVisible = true;
        this.propertyDetailList[index].status = true;
        this.$nextTick(_ => {
          if (this.productId) {
            this.$forceUpdate();
            this.$set(this.propertyDetailList[index],"status",true)
          } else {
            this.propertyDetailList[index].status = true;
          }
          // this.$refs.saveTagInput[index].$refs.input.focus();
        });
      },


      /**
       * 输入属性后事件
       */
      handleInputConfirm(id, index) {
        let inputValue = this.inputValue;
        if (inputValue && !this.productId) {
          for (let i = 0; i < this.propertyDetailList.length; i++) {
            if (this.propertyDetailList[i].attributeId && this.propertyDetailList[i].attributeId == id) {
              this.propertyDetailList[i]['attributeValueList'].push(inputValue);
              // 组装成后端需要的格式
              this.propertyDetailList[i]['propertyList'].push({
                "skuAttributeId": this.propertyDetailList[i].attributeId,
                "skuAttributeName": this.propertyDetailList[i].attributeName,
                "skuAttributeValue": inputValue
              });
            }
          }
        } else if (inputValue && this.productId) {
          for (let i = 0; i < this.propertyDetailList.length; i++) {
            if (this.propertyDetailList[i].attributeId && this.propertyDetailList[i].attributeId == id) {
              this.propertyDetailList[i]['attributeValueList'].push(inputValue);
              this.propertyDetailList[i]['propertyList'].push({
                "skuAttributeId": this.propertyDetailList[i].attributeId,
                "skuAttributeName": this.propertyDetailList[i].attributeName,
                "skuAttributeValue": inputValue
              })
            }
          }
          // this.propertyDetailList = this.tempArr;
        }
        this.propertyDetailList[index].status = false;
        let attributeList = [];
        this.propertyDetailList.forEach(
          v => {
              attributeList.push(v['propertyList'])
          }
        );
        this.skuData = this.doExchange(attributeList);
        this.inputValue = '';
      },
      /**
       * 获取商品品牌
       */
      getAllBrand() {
        getBrandList({
          pageNum: 1,
          pageSize: 100
        }).then(
          res => {
            this.brandData = res.returnData.data;
          }
        )
      },
      /**
       * 商品类目格式化
       */
      getCategory() {
        getAllCategoryList({})
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
      /**
       * 获取规格组
       */
      getSpecGroupList() {
        getSpecGroupList({}).then(
          res => {
            this.specGroupList = res.returnData;
          }
        )
      },
      getPropertyList() {
        getSkuAttributeList({
          pageNum: 1,
          pageSize: 100,
          attributeName: ''
        }).then(res => {
          this.propertyList = res.returnData.data;
        })
      },
      doExchange(arr) {
        let len = arr.length;
        // 当数组大于等于2个的时候
        if (len >= 2) {
          // 第一个数组的长度
          let len1 = arr[0].length;
          // 第二个数组的长度
          let len2 = arr[1].length;
          // 2个数组产生的组合数
          let lenBoth = len1 * len2;
          //  申明一个新数组,做数据暂存
          let items = new Array(lenBoth);
          // 申明新数组的索引
          let index = 0;
          // 2层嵌套循环,将组合放到新数组中
          for (let i = 0; i < len1; i++) {
            for (let j = 0; j < len2; j++) {
              items[index] = {};
              // items[index] = arr[0][i] + "-" + arr[1][j];
              items[index] = [arr[0][i], arr[1][j]]
              index++;
            }
          }
          // 将新组合的数组并到原数组中
          let newArr = new Array(len - 1);
          for (let i = 2; i < arr.length; i++) {
            newArr[i - 1] = arr[i];
          }
          newArr[0] = items;
          // console.log(newArr);
          // 执行回调
          return this.doExchange(newArr);
        } else {
          let formatArr = [];
          for (let i = 0; i < arr[0].length; i++) {
            if (arr[0][0].length) {
              formatArr[i] = {};
              formatArr[i]['attributeList'] = arr[0][i];
              formatArr[i]['price'] = '100';
              formatArr[i]["priceType"] = '1';
            } else {
              formatArr[i] = {};
              formatArr[i]['attributeList'] = [];
              formatArr[i]['attributeList'].push(arr[0][i]);
              // formatArr[i]['attributeList'] = arr[0][i];
              formatArr[i]['price'] = '100';
              formatArr[i]["priceType"] = '1';
            }
          }
          return formatArr;
        }
      },
      onSubmit(formName, type) {
        if (!this.uploadComplete) {
          this.$message.error("图片正在上传，请稍等");
          return;
        }
        // if (this.form.registerUrl.search(/http:\/\/47.107.111.34/) != -1) {
        if (this.form.registerUrl.indexOf(this.imgHost) != -1) {
          // this.form.registerUrl = this.form.registerUrl.replace(/http:\/\/47.107.111.34/,'')
          this.form.registerUrl = this.comFun.replaceString(this.imgHost, this.form.registerUrl)
        }
        // if (this.form.afterSellUrl.search(/http:\/\/47.107.111.34/) != -1) {
        if (this.form.afterSellUrl.indexOf(this.imgHost) != -1) {
          // this.form.afterSellUrl = this.form.afterSellUrl.replace(/http:\/\/47.107.111.34/,'')
          this.form.afterSellUrl = this.comFun.replaceString(this.imgHost, this.form.afterSellUrl)
        }

        let imagesList = [
          {
            "imageUrl": this.form.registerUrl,
            "type": 3   // 1商品图片，2详情图片，3注册证，4售后保证，5产品介绍
          },
          {
            "imageUrl": this.form.afterSellUrl,
            "type": 4   // 1商品图片，2详情图片，3注册证，4售后保证，5产品介绍
          }
        ];

        /**
         * 产品图片格式化上传
         */
        let productUrls  = this.form.productPhoto.split(",");
        let productFormat = productUrls.map(
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
        productFormat.forEach(
          v => {
            imagesList.push({
              imageUrl: v,
              type: '1',
              imageName: '',
            })
          }
        )


        /**
         * 产品介绍图片格式化上传
         */
        let productIntroUrls  = this.form.productIntroPhoto.split(",");
        let productIntroFormat = productIntroUrls.map(
          v => {
            // if (v.search(/http:\/\/47.107.111.34/) != -1) {
            if (v.indexOf(this.imgHost) != -1) {
              return this.comFun.replaceString(this.imgHost, v)
            } else {
              return v
            }
          }
        );
        productIntroFormat.forEach(
          v => {
            imagesList.push({
              imageUrl: v,
              type: '5',
              imageName: '',
            })
          }
        )
        /**
         * format规格组
         * @type {Array}
         */
        let specListFinally = []
        this.specGroupChoosedList.forEach(
          v => {
            specListFinally.push(v['specList'])
          }
        )
        specListFinally = [].concat.apply([], specListFinally)
        let params = {
          id: this.productId,
          "approbation": this.form.licenseNumber, //  批准文号
          "model": this.form.version, // 型号
          "productName": this.form.name, // 产品名称
          "brandId": this.form.brand, // 品牌ID
          "categoryLevelOneId": this.categoryLevelOneId,
          "categoryLevelTwoId": this.categoryLevelTwoId,
          "categoryLevelThreeId": this.categoryLevelThreeId,
          "categoryId":this.categoryLevelThreeId ? this.categoryLevelThreeId : (this.categoryLevelTwoId ? this.categoryLevelTwoId : this.categoryLevelOneId),
          "categoryLevel": this.categoryLevelThreeId ? 3 : (this.categoryLevelTwoId ? 2 : 1),
          "imagesList": imagesList,
          "skuList": this.skuData,
          "specList": specListFinally,
        };
        if (params.skuList.length == 0) {
          this.$message({
            type: 'warning',
            message: '必须要选择一个属性或者以上'
          });
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.productId) {
              productModify(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  if ( type == 'create') {
                    this.$router.push('/goods/management')
                  } else if ( type == 'preview') {
                    this.$router.push({path: '/goods/preview', query: {productId: this.productId}})
                  }
                }
              )
            } else {
              productCreate(params).then(
                res => {
                  this.$message({
                    message: res.returnMsg,
                    type: 'success'
                  });
                  if ( type == 'create') {
                    this.$router.push('/goods/management')
                  } else if ( type == 'preview') {
                    this.$router.push({path: '/goods/preview', query: {productId: res.returnData}})
                  }
                }
              )
            }

          } else {
            this.$message({
              type: 'warning',
              message: '必填项为填写完整！请检查后再发布'
            })
          }
        })
      },
    }
  }
</script>

<style rel="stylesheet" lang="scss">
  .release {
    padding: 32px;
    background-color: #f0f2f5;
  }

  .release-container {
    padding: 50px 100px;
    background-color: #fff;
  }

  .release-content {
    padding: 10px 100px;
    background-color: #fff;
  }

  .release-title {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background-color: #F2F2F2;
  }

  .basic-info-container {
    padding: 20px 200px;
  }

  .property-item {
    display: flex;
    display: -webkit-flex;
    margin-bottom: 10px;
  }

  .property-name {
    line-height: 32px;
    margin-right: 10px;
    margin-left: 37px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
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
