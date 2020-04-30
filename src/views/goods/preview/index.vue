<template>
  <div class="product-detail">
    <div class="product-wrap">
      <div class="product-category">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">{{productDetail.categoryLevelOneName}}</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">{{productDetail.categoryLevelTwoName}}</a></el-breadcrumb-item>
          <el-breadcrumb-item>{{productDetail.categoryLevelThreeName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="detail-wrap">
        <div class="detail-left">
          <div class="detail-img">
            <!--<img-->
              <!--:src="`${imgHost}${productDetail.imagesList && productDetail.imagesList[imgIndex].imageUrl}`"-->
            <!--&gt;-->
            <img-zoom width="385" height="345"
                      :src="`${data.headerImgList[imgIndex]}`"
                      :bigsrc="`${data.headerImgList[imgIndex]}`"
                      :configs="configs"></img-zoom>
          </div>
        </div>
        <div class="detail-right">
          <p class="product-name">{{productDetail.productName}}</p>
          <div class="product-sku">
            <span>价格</span>
            <span class="product-price">请拨打xxx询价</span>
          </div>
          <div class="product-sku" v-if="productDetail.approbation">
            <span>批准文号</span>
            <span>{{productDetail.approbation}}</span>
          </div>
          <div class="product-sku" v-if="productDetail.brandCnName">
            <span>品牌</span>
            <span>{{productDetail.brandCnName}}</span>
          </div>
          <div class="product-sku" v-if="productDetail.productNo">
            <span>型号</span>
            <span>{{productDetail.productNo}}</span>
          </div>
          <div class="product-sku type-select"
               v-for="(attribute, parentIndex) in productDetail.attributeAndValueList"
               :key="attribute.attributeId || parentIndex"
          >
            <span>{{attribute.attributeName}}</span>
            <el-button type="primary" size="small"
                    @click="selectAttribute(parentIndex, index)"
                    :type="attributeValue.selected ? 'primary' : 'default'"
                    v-for="(attributeValue, index) in attribute.attributeValueList"
                    :key="attributeValue.value || index"
            >{{attributeValue.value}}</el-button>
          </div>
          <div class="choose-amount">
            <input>
            <a>+</a>
            <a>-</a>
          </div>
          <div class="product-operation">
            <el-button size="small">立即购买</el-button>
            <el-button size="small" type="danger">加入购物车</el-button>
          </div>
        </div>
      </div>
      <div class="small-product-img">
        <i size="24" class="el-icon-arrow-left" @click="goToLast" />
        <img
          :class="{'img-selected': imgIndex === index}"
          v-for="(img, index) in data.headerImgList"
          :key="img"
          :src="`${img}`"
          @click="handleSelectImg(index)"
        >
        <i size="24" class="el-icon-arrow-right" @click="goToNext" />
      </div>
      <div>
        <el-tabs type="border-card">
          <el-tab-pane label="产品介绍">
            <div
              v-if="index === 0"
              v-for="(specGroup, index) in productDetail.specGroupList"
              :key="specGroup.specGroupId || index"
            >
              <product-desc
                :specGroup="specGroup"
              ></product-desc>
              <product-detail-img
                :imgType=5
                :imgList="productDetail.imagesList"
              ></product-detail-img>
            </div>
          </el-tab-pane>
          <el-tab-pane label="规格与包装">
            <product-desc :specGroup="specGroup"
                          v-for="(specGroup, secondIndex) in productDetail.specGroupList"
                          :key="specGroup.specGroupId || secondIndex"
            ></product-desc>
          </el-tab-pane>
          <el-tab-pane label="售后保障">
            <product-detail-img
              :imgList="productDetail.imagesList"
              :imgType=4
            ></product-detail-img>
          </el-tab-pane>
          <el-tab-pane label="注册证">
            <product-detail-img
              :imgType=3
              :imgList="productDetail.imagesList"
            ></product-detail-img>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import imgZoom from 'vue2.0-zoom'
  import ProductDesc from './components/product-desc'
  import ProductDetailImg from './components/product-detail-img'
  import {productDetail} from '@/api/product'

  export default {
    name: "preview",
    components: {
      imgZoom,
      ProductDesc,
      ProductDetailImg,
    },
    watch : {
      selectedSkuNo (val) {
        if (val && this.productDetail && this.productDetail.skuList) {
          this.hasSku = false
          this.productDetail.skuList.map(item => {
            if (item.skuNo === val && item.status === 2) {
              this.hasSku = true
              this.priceType = item.priceType
              this.price = item.price
              this.stock = item.stock
              this.skuId = item.id
              this.selectedSku.push(item)
            }
          })
          if (!this.hasSku) {
            this.stock = 0
          }
        }
      }
    },
    data() {
      return {
        productId: this.$route.query.productId,
        data: {
          headerImgList: [],
          productIntroPhoto: [],
        },
        selectedSkuNo: '',
        productDetail: {},
        // domain: 'http://47.107.111.34',
        PRODUCTIAMGETYPE: 1, // 商品图片类型
        PRODUCTDETAILIAMGETYPE: 2, // 商品详情图片
        REGISTERIAMGETYPE: 3, // 注册证图片
        AFTERSELLIAMGETYPE: 4, // 售后
        PRODUCTINTROIAMGETYPE: 5,  // 商品介绍
        imgIndex: 0,
        // headerImgList: [],
        // imgHost: 'http://47.107.111.34',
        configs: {
          width: 650,
          height: 350,
          maskWidth: 100,
          maskHeight: 100,
          maskColor: '#000',
          maskOpacity: 0.2
        }
      }
    },
    created() {
      this.getProductDetail()
      this.selectedSkuNo = this.productId
    },
    methods: {
      getProductDetail() {
        productDetail({
          productId: this.productId,
        }).then(
          res => {
            this.productDetail = res.returnData;
            this.data.registerUrl = this.typeOfImage(this.productDetail.imagesList, this.REGISTERIAMGETYPE); // 注册证
            this.data.afterSellUrl = this.typeOfImage(this.productDetail.imagesList, this.AFTERSELLIAMGETYPE); // 售后保障
            this.typeOfImage(this.productDetail.imagesList, this.PRODUCTIAMGETYPE); // 商品图片
            this.typeOfImage(this.productDetail.imagesList, this.PRODUCTINTROIAMGETYPE); // 产品介绍图片

            this.productDetail.attributeAndValueList.map(item => {
              item.attributeValueList.map((attributeValue, index) => {
                if (index === 0) {
                  item.attributeValueList[index] = {
                    'selected': true,
                    'value': attributeValue
                  }
                  this.selectedSkuNo += item.attributeValueList[index].value
                } else {
                  item.attributeValueList[index] = {
                    'selected': false,
                    'value': attributeValue
                  }
                }
              })
            })
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
            if (typeId == 1 && imageList[i]['imageUrl']) {
              this.data.headerImgList.push(this.imgHost + imageList[i]['imageUrl'])
            } else if (typeId == 5 && imageList[i]['imageUrl']) {
              this.data.productIntroPhoto.push(this.imgHost + imageList[i]['imageUrl'])
            } else {
              return this.imgHost + imageList[i]['imageUrl']
            }
          }
        }
      },
      handleSelectImg (index) {
        this.imgIndex = index
      },
      goToLast () {
        this.imgIndex = this.imgIndex <= 0 ? this.imgIndex : this.imgIndex - 1
      },
      goToNext () {
        this.imgIndex = this.productDetail.imagesList && this.imgIndex >= this.productDetail.imagesList.length - 1 ? this.imgIndex : this.imgIndex + 1
      },
      selectAttribute (parentIndex, index) {
        this.selectedSkuNo = this.productId
        let attributeValueList = this.productDetail.attributeAndValueList[parentIndex]
        attributeValueList.attributeValueList[index].selected = true
        attributeValueList.attributeValueList.map((item, childIndex) => {
          if (index !== childIndex) {
            attributeValueList.attributeValueList[childIndex].selected = false
          }
        })
        this.$set(this.productDetail.attributeAndValueList, parentIndex, attributeValueList)
        this.productDetail.attributeAndValueList.map(item => {
          item.attributeValueList.map((attributeValue, index) => {
            if (attributeValue.selected) {
              this.selectedSkuNo += item.attributeValueList[index].value
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet" scoped>
  .product-detail {
    padding: 32px;
    background-color: #f0f2f5;
    .product-wrap {
      margin: 0 auto;
      padding: 50px 100px;
      background-color: #fff;
      .product-category {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .category-icon {
          margin-right: 5px;
        }
        span {
          font-size: 14px;
          color: #333333;
        }
      }
      .detail-wrap {
        // display: flex;
        .detail-left {
          display: inline-block;
          .detail-img {
            img {
              width: 385px;
              height: 345px;
              border: 1px solid #eeeeee;
            }
          }
        }
        .detail-right {
          display: inline-block;
          vertical-align: top;
          margin-left: 40px;
          .product-name {
            font-size: 24px;
            color: #555555;
            margin-bottom: 20px;
          }
          .product-sku {
            line-height: 25px;
            span {
              font-size: 14px;
              color: #666666;
              display: inline-block;
              &:nth-child(1) {
                width: 100px;
              }
              &:nth-child(2) {
                color: #333333;
              }
            }
            .product-price {
              color: #f83305 !important;
            }
            .second-btn {
              margin-left: 10px;
            }
          }
          .type-select {
            line-height: 40px;
          }
          .choose-amount {
            position: relative;
            width: 58px;
            margin-top: 25px;
            input {
              display: block;
              width: 43px;
              height: 42px;
              line-height: 42px;
              text-align: center;
              border: 1px solid #ccc;
            }
            a {
              display: block;
              width: 15px;
              text-align: center;
              height: 22px;
              line-height: 22px;
              overflow: hidden;
              background: #f1f1f1;
              color: #666;
              position: absolute;
              right: 1px;
              border: 1px solid #ccc;
              &:nth-child(2) {
                top: 0;
              }
              &:nth-child(3) {
                bottom: 0;
              }
            }
          }
          .product-operation {
            margin-top: 30px;
            a {
              display: inline-block;
              width: 165px;
              height: 47px;
              line-height: 47px;
              text-align: center;
              border-radius: 3px;
              font-size: 18px;
              &:nth-child(1) {
                background: #0181d2;
                color: #ffffff;
              }
              &:nth-child(2) {
                background: #fc600c;
                color: #ffffff;
                margin-left: 10px;
              }
            }
          }
        }
      }
      .small-product-img {
        margin: 5px 0 40px 0;
        display: flex;
        align-items: center;
        img {
          width: 107px;
          height: 89px;
          border: 1px solid #eeeeee;
          margin-left: 7px;
          &:nth-child(2) {
            margin-left: 0;
          }
        }
        i {
          cursor: pointer;
        }
      }
    }
  }
</style>
