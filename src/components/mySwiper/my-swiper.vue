<template>
  <div class="my-swipe">
    <!-- mint-ui中的swipe组件 -->
    <mt-swipe :auto="3000">
      <mt-swipe-item v-for="(item,index) in swipeList" :key="index">
        <img :src="item.picUrl" alt="" @click="goInformationDetails(item.docId)">
        <div class="carousel-caption">{{item.title}}</div>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>
<script>
  export default {
    name: 'mySwipe',
    data() {
      return {
        swipeList: []
      }
    },
    methods: {
      goInformationDetails(docid) {
        this.$router.push({path: '/informationPublishDetails', query: {docid: docid, page: 'home'}});
      }
    }
  }
</script>
<style lang="scss" scoped>
  .my-swipe {
    position: absolute;
    height: 200px;
    width: 100%;
    /*top: 45px;*/
    /*z-index: 999;*/
    .mint-swipe {
      height: 200px;
    }

    .mint-swipe img {
      width: 100%;
      /*height: 200px;*/
      height: 100%;
    }

    .mint-swipe-item {
      color: white;
    }

    .carousel-caption {
      width: 100%;
      /*    background: #888;
          opacity: 0.7;*/
      background-color: rgba(0, 0, 0, .4);
      position: absolute;
      /*right: 5%;*/
      /* left: 5%;*/
      bottom: 20px;
      z-index: 10;
      padding: 5px;
      /*    padding-bottom: 15px;*/
      color: #fff;
      text-align: left;
      /*  text-shadow: 0 1px 2px rgba(0, 0, 0, .6);*/
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
