<template>
  <div id="determine-button">
      <ul class="oneButtonUl">
        <li @click="toDetermine()" class="btn-active">
          <span>判级</span>
        </li>
      </ul>
  </div>

</template>

<script>
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: 'determinebutton',
    props: {
      footButton: {type: Array},
      buttonTitle: {type: String},
      typeFlag: {type: String},
      receiveGuid: {type: String},
      taskId: {type: String},
      fileGuid: {type: String}
    },
    data() {
      return {
        UserId: '',
      }
    },
    methods: {
      //判级
      toDetermine() {
        let that = this;
        that.showAlert('实现接口！');
/*        interfaceService.confirmJD(params).then(function (response) {
          that.hideIndicator();
          that.$router.push({path: '/receptionManager', query: {page: 'receptionToNotRead'}})
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })*/
      },

    },
    activated(){
      // this.UserId = interfaceService.getCookie("Token");
    },
    created(){
      // this.UserId = interfaceService.getCookie("Token");
    }
  }
</script>

<style scoped>
  #determine-button {
    border-top: 1px solid #eeeeee;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: dodgerblue;
  }

  #determine-button ul {
    width: 100%;
    list-style: none;
  }

  #determine-button ul li a {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    padding-top: 8px;
  }

  #determine-button ul li {
    float: left;
    height: 45px;
    text-align: center;
    position: relative;
    color: white;
  }

  .threeButtonUl li {
    width: 33.33333333%;
  }

  .twoButtonUl li {
    width: 50%;
  }

  .oneButtonUl li {
    width: 100%;
  }

  #determine-button span {
    width: 100%;
    color: white;
    position: absolute;
    left: 0;
    bottom: 15px;
  }
</style>
