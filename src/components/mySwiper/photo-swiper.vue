<template>
  <div class="photo-swipe">
    <!-- mint-ui中的swipe组件 -->
    <mt-swipe :auto="0">
      <mt-swipe-item v-for="(item,index) in photoList" :key="index">
        <img :src="item.picUrl" alt="">
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
  export default {
    name: 'photoSwipe',
    data() {
      return {
        photoList: []
      }
    },
    methods: {
    //
    }
  }
</script>
<style lang="scss" scoped>
  .photo-swipe {
    position: absolute;
    height: 250px;
    width: 100%;
    /*top: 45px;*/
    /*z-index: 999;*/
    .mint-swipe {
      height: 250px;
    }

    .mint-swipe img {
      width: 100%;
      /*height: 200px;*/
      height: 100%;
    }

    .mint-swipe-item {
      color: white;
    }

  }
</style>
