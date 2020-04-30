<template>
  <div class="product-detail-img">
    <!-- <img src="//m.360buyimg.com/babel/jfs/t1/10674/29/3136/88140/5be2c6e1E52c6735d/b4b92b7864fc1647.jpg"> -->
    <img :src="`${imgHost}${img.imageUrl}`"
      v-if="img.type === imgType"
      v-for="(img, index) in imgList"
      :key="img.id || index"
    >
  </div>
</template>

<script>
export default {
  props: {
    imgType: {
      type: Number,
      default: 1
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data(){
    return {
      // imgHost: 'http://47.107.111.34',
    }
  }
}
</script>

<style rel="stylesheet" lang="scss" scoped>
  .product-detail-img {
    text-align: center;
    margin: 23px 0 84px 0;
    img {
      width: 810px;
    }
  }
</style>
