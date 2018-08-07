<template>
  <div class="subHeader">
    <slot name="left"></slot>
    <div class="center"></div>
    <slot name="right"></slot>
  </div>
</template>

<script>
  export default {
    name: 'subHeader',
  }
</script>

<style lang="scss" scoped>
  .subHeader {
    height: 45px;
    width: 100%;
    background: #1e8fe1;
    color: #ffffff;
    text-align: center;
    line-height: 45px;
    position: fixed;
    z-index: 999;
    .left-content {
      position: absolute;
      left: 10px;
      color: #ffffff;
      /*width: calc(50% - 10px);*/
      text-align: left;
    }
    .center-content {
      position: absolute;
      left: calc(50% - 30px);
      color: white;
    }
    .right-content {
      position: absolute;
      right: 10px;
      color: #ffffff;
      /*width: calc(50% - 10px);*/
      text-align: right;
    }
  }

</style>
