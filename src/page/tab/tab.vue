<template>
  <div class="tab">
    <transition name="direction" mode="out-in">
      <keep-alive>
        <router-view class="child-view"/>
      </keep-alive>
    </transition>
    <foot-guide ref="footGuide"></foot-guide>
  </div>
</template>

<script>
  import FootGuide from '@/components/footer/footGuide'

  export default {
    name: 'tab',
    components: {FootGuide},
    beforeUpdate() {
      if (this.$route.path === '/tab/contact') {
        this.$refs.footGuide.activeIndex = 1
      } else if (this.$route.path === '/tab/erp') {
        this.$refs.footGuide.activeIndex = 2
      } else if(this.$route.path === '/tab/personal'){
        this.$refs.footGuide.activeIndex = 3
      } else {
        this.$refs.footGuide.activeIndex = 0
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tab {
    .child-view {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      /*will-change: transform;*/
      /*transition: all .5s;*/
      backface-visibility: hidden;
      -webkit-overflow-scrolling: touch;
      /*perspective: 1000px;*/
    }
  }
</style>
