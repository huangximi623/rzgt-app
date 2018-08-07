<template>
  <div class="my-body" @click="changeupdateFlag">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        flag: false
      }
    },
    methods: {
      changeupdateFlag() {
        this.$emit('change-flag', this.flag);
      }
    }
  }
</script>

<style>
  .my-body {
    width: 100%;
    box-sizing: border-box;
    position: relative;
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    overflow: auto;
  }
</style>
