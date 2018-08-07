<template>
  <div id="app">
    <transition name="direction">
      <!-- keep-alive 可以缓存，提高性能，与路由中的设置对应 -->
      <keep-alive>
        <router-view class="child-view"
                     v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="direction">
      <router-view class="child-view"
                   v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <div id="allModal" class="my-modal" style="z-index: 3000;display: none;"></div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'app',
    computed: {
      direction() {
        const viewDir = this.$store.state.viewDirection;
        let tranName = '';

        if (viewDir === 'left') {
          tranName = 'slide-left'
        } else if (viewDir === 'right') {
          tranName = 'slide-right'
        } else {
          tranName = 'router-fade'
        }
        return tranName
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
    width: 100%;
  }

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

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .slide-right-enter, .slide-left-leave-active {
    opacity: 1;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  .slide-right-leave-active, .slide-left-enter {
    opacity: 1;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }
</style>
