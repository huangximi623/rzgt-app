<template>
  <div class="acceptHistory">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <mt-cell title="起始日期">
        <input type="date" v-model="startTime" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>
      <mt-cell title="截止日期">
        <input type="date" v-model="endTime" class="mint-field-core" style="border: 1px solid gray;">
      </mt-cell>

<!--      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_doc">
        &lt;!&ndash; tab-container &ndash;&gt;
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <qualityTest-list v-for='(item,index) in dealtInfo'
                              :key="index"
                              :addresscode='item._ADDRESSCODE'
                              :classification='item.CLASSIFICATION'>
            </qualityTest-list>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>-->
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import QualityTestList from '../../components/workFlow/qualityTest-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'acceptHistory',
    data() {
      return {
        title: '验收历史数据',
        selected: '1',
        showFlag: false,
        allLoaded: false,
        dealtInfo: [],
        startTime: '',
        endTime: '',
        params: {
          "MethodId": "0",
          "UserId": "",
          "From": "0",
          "Limit": "10"
        }
      }
    },
    components: {HeaderSimple, BodyContent, QualityTestList},
    methods: {
      goBack() {
        this.$router.push({path: '/examineReceive'})
      },
      //获取质检点列表
      getQualityTestList(params) {
        let that = this;
        that.dealtInfo = [];
//        this.showIndicator('加载中...');
        interfaceService.queryQualityTestList(params)
          .then(function (response) {
            that.hideIndicator();
            that.dealtInfo = response;
            if(response.length === 0){
              that.showFlag = true;
            }else{
              //如果请求返回数量小于limit，则默认加载全部，不允许再上拉加载
              if (response.length < that.params.Limit) {
                that.allLoaded = true;
                that.showToast("已加载全部！")
              }
            }
          }, function (error) {
            that.showFlag = true;
            that.hideIndicator();
            that.showAlert("数据加载失败");
          });
      },
      //加载更多
      loadmore(type, params) {
        let that = this;
//        this.showIndicator('加载中...');//显示加载提示
        interfaceService.queryQualityTestList(params)
          .then(function (response) {
            if (response) {
              that.hideIndicator();//隐藏加载提示
              for (let i = 0; i < response.length; i++) {
                that.dealtInfo.push(response[i])
              }
              if (response.length < that.params.Limit) {
                that.allLoaded = true;
                that.showToast("已加载全部！")
              }
            }
          }, function (error) {
            that.hideIndicator();//隐藏加载提示
            that.showAlert("数据加载失败");
          });
      },
      //下拉刷新
      loadTop() {
        let self = this;
        this.allLoaded = false;
        this.showFlag = false;
        setTimeout(() => {
          self.getQualityTestList(self.params);
          self.$refs.loadmore_doc.onTopLoaded();
        }, 1500)
      },
      //上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.Limit) + Number(this.params.From)).toString();
        setTimeout(() => {
          self.loadmore(self.params);
          self.$refs.loadmore_doc.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      startTime(newval, oldval) {
        alert(newval);
      },
      endTime(newval, oldval) {
        let str1 = startTime;
        if(newval < str1){
          alert("截止日期不能小于起始日期！");
        }
      }
    },
    /*created() {
      this.selected = '1';
      this.getDocumentList('待办', this.params);
    },*/
    activated() {
      if (this.$route.query.page !== 'qualityTestDetail' || this.is_weixin()) {
        this.selected = '1';
        this.params.From = '0';
        this.params.Limit = '10';
        this.allLoaded = false;
        this.showFlag = false;
        this.params.UserId = interfaceService.getCookie("UserId");
//        this.showIndicator('加载中...');
        this.getQualityTestList(this.params);
      }
    }
  }
</script>
<style lang="scss" scoped="">

  .qualityTest {
    background: #fff;
    /*    .admin-nav {
          position: fixed;
          z-index: 999;
          top: 45px;
          height: 45px;
          box-sizing: border-box;
          width:100%;
          border-top: 1px solid #e3e3e3;
        }*/
    .body-content {
      height: calc(100% - 90px);
      display: block;
      overflow: auto;
      box-sizing: border-box;
      margin-top: 0px;
      padding-bottom: 5px;
      .list-selector {
        width: 100%;
        /*        min-height: calc(100% - 45px);*/
        background: #fff;
        box-sizing: border-box;
      }
    }

    .person-info {
      .mint-cell-title {
        .mint-cell-text {
          margin-left: 20px;
        }
      }
    }
  }

</style>
