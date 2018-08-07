<template>
  <div id="myHeader" :class="{'android-header':isAndroidMachine()}">
    <div class="header-inner">
      <slot name="left"></slot>
      <slot name="title"></slot>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'myHeader'
  }
</script>

<style lang="scss" scoped>
  #myHeader {
    position: relative;
    height: 45px !important;
    padding: 10px 5px 0 0;
    margin: 0;
    color: #fff;
    background: #1e8fe1;
    z-index: 999;
    .left-button {
      height: 35px;
      line-height: 45px;
      font-size: 20px;
      text-align: center;
      width: 45px;
      float: left;
      color: #fff;
    }
    .list-title {
      position: absolute;
      height: 35px;
      color: #fff;
      line-height: 45px;
      left: 45px;
      right: 45px;
      font-size: 16px;
      text-align: center;
    }
    .right-button {
      height: 35px;
      line-height: 45px;
      /*font-size: 20px;*/
      text-align: center;
      width: 45px;
      float: right;
      color: #fff;
      i{
        font-size: 20px;
      }
    }
  }

  .android-header {
    padding-top: 0 !important;
  }

</style>
