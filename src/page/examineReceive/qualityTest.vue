<template>
  <div class="qualityTest">
    <header-simple class="list-header">
      <div class="left-button" @click="goBack()" slot="left"><i class="fa fa-chevron-left"></i></div>
      <div class="list-title" slot="title">
        {{title}}
      </div>
      <div class="right-button" slot="right"></div>
    </header-simple>
    <body-content class="body-content">
      <div v-if="showFlag" class="imgHeight">
        <img src="../../assets/noData-white.png" style="width: 55%;"/>
      </div>
      <mt-loadmore v-else class="list-selector" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded"
                   :auto-fill="false" ref="loadmore_doc">
        <!-- tab-container -->
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <qualityTest-list v-for='(item,index) in dealtInfo'
                                :key="index"
                                :code='item.CODE'
                                :_class='item._CLASS'
                                :classification='item.CLASSIFICATION'>
            </qualityTest-list>
          </mt-tab-container-item>
        </mt-tab-container>
      </mt-loadmore>
    </body-content>
  </div>
</template>

<script>
  import HeaderSimple from '@/components/header/header-simple'
  import BodyContent from "@/components/bodyContent/body-content"
  import QualityTestList from '../../components/workFlow/qualityTest-list.vue'
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'qualityTest',
    data() {
      return {
        title: '质检点',
        selected: '1',
        showFlag: false,
        allLoaded: false,
        dealtInfo: [
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "工厂废料",
            "CODE": "101"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "工厂废料",
            "CODE": "102"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "重型废钢　",
            "CODE": "201"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "重型废钢　",
            "CODE": "202"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "重型废钢　",
            "CODE": "203"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "统料废钢",
            "CODE": "204"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "统料废钢",
            "CODE": "205"
          },
          {
            "_CLASS": "单体废钢",
            "CLASSIFICATION": "统料废钢",
            "CODE": "206"
          }

        ],
        params: {
          "MethodId": "0",
          "UserId": "0",
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
      //获取判级标准列表
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
              if (response.length < that.params.limit) {
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
//         interfaceService.queryDocumentList(type, params)
        interfaceService.queryQualityTestList(params)
          .then(function (response) {
            if (response) {
              that.hideIndicator();//隐藏加载提示
              for (let i = 0; i < response.length; i++) {
                that.dealtInfo.push(response[i])
              }
              if (response.length < that.params.limit) {
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
        this.params = {
          "from": "0",
          "limit": "10"
        };
        setTimeout(() => {
          if (self.selected === '1') {
            self.getQualityTestList(self.params);
          }
          self.$refs.loadmore_doc.onTopLoaded();
        }, 1500)
      },
      //上拉加载更多
      loadBottom() {
        let self = this;
        this.params.from = (Number(this.params.limit) + Number(this.params.from)).toString();
        setTimeout(() => {
          if (self.selected === '1') {
            self.loadmore(self.params);
          }
          self.$refs.loadmore_doc.onBottomLoaded();
        }, 1500);
      }
    },
    watch: {
      selected(newval, oldval) {
        // this.dealtInfo = [];
        this.allLoaded = false;
        this.showFlag = false;
        this.params = {
          "MethodId": "0",
          "UserId": "R028316",
          "From": "0",
          "Limit": "10"
        };
        switch (newval) {
          case '1':
            this.showIndicator('加载中...');
            this.getQualityTestList(this.params);
            break;
          /*          case '2':
                      this.showIndicator('加载中...');
                      this.getDocumentList('已办', this.params);
                      break;
                    case '3':
                      this.showIndicator('加载中...');
                      this.getDocumentList('办结', this.params);
                      break;*/
          default:
            break;
        }
      },
    },
    /*created() {
      this.selected = '1';
      this.getDocumentList('待办', this.params);
    },*/
    activated() {
      if (this.$route.query.page !== 'qualityTestDetail' || this.is_weixin()) {
        this.selected = '1';
        this.params = {
          "MethodId": "0",
          "UserId": "R028316",
          "From": "0",
          "Limit": "10"
        };
        this.allLoaded = false;
        this.showFlag = false;
//        this.showIndicator('加载中...');
//        this.getQualityTestList(this.params);
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
