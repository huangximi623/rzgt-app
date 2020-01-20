<template>
  <div >
    <!--<button id="cameraTakePicture">获取照片</button>-->
    <mt-cell >
      <!-- <div >
         <mt-button  size="normal" type="primary" @click="cameraTakePicture()">拍照</mt-button>
       </div>-->
      <div>
        <mt-button  size="normal" type="primary" @click="takefromgalery()">单传</mt-button>
      </div>
      <!--<div style=" width:20%;">
         <mt-button  size="small" type="primary" @click="uploadFile()">上传</mt-button>
       </div>-->
      <div >
        <mt-button  size="normal" type="primary" @click="Batchupload()">批量</mt-button>
      </div>
      <div >
        <mt-button  size="normal" type="default" @click="goBack()">返回</mt-button>
      </div>
    </mt-cell >
    <!-- <li v-for="(photovalue,index) in photovalue">{{photovalue.index}}{{photovalue.photopath}}</li>
     <div>
       <ul v-for="(photovalue,index) in photovalue">
         <li>
           <img v-bind:src="photovalue.photopath" class="myImage">
         </li>
       </ul>
     </div>-->
    <mt-cell style="float:left;width:100%;" :title="'磅单号'">
      <div  style=" width:100%;">
        <input type="text"  v-model="wgt" readonly="true" >
      </div>
    </mt-cell>
    <div>
      <img  id="myImage"></img>.
    </div>
  </div>
</template>

<script >
  import interfaceService from '../../service/interfaceService.js'

  export default {
    name: "takephotos",
    data(){
      return{
        photovalue: [] ,//用于存放选中的图片
        wgt:"",
        class:"",
        UserId:"",
        param:{
          "Wgtliston":"",
          "UserId":''
        }
      }
    },
    methods: {

      init() {
        this.wgt=this.$route.query.baodancode ? this.$route.query.baodancode : '';
        this.class=this.$route.query.class ? this.$route.query.class : '';
        this.photovalue=[];
        this.param.UserId = interfaceService.getCookie("UserId");
        this.param.Wgtliston =  this.wgt;
        console.log(2+document.getElementById('myImage').src);
      },
      goBack() {
        this.wgt="";
        this.photovalue=[];
        document.getElementById('myImage').src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        if(this.class=="Z"){
          this.$router.push({path: '/zjQuality', query: {page: 'takephotos'}})
        }else{
          this.$router.push({path: '/jhQuality', query: {page: 'takephotos'}})
        }
      },
      cameraTakePicture() {//调取摄像头拍照
        navigator.camera.getPicture(onSuccess, onFail, cameraOptions);
        var cameraOptions= {
          quality: 50, //图片质量  0-100
          /*       targetWidth : 100,  //照片宽度
                 targetHeight : 100,  //照片高度*/
          saveToPhotoAlbum : true,  //保存到手机相册
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType:Camera.EncodingType.JPEG,  //保存的图片格式： JPEG = 0, PNG = 1
          allowEdit : false,      //选择之前允许修改截图
          destinationType: navigator.camera.DestinationType.FILE_URI
        };
        function onSuccess(imageURI) {
          console.log("成功url"+imageURI)
          var image = document.getElementById('myImage');
          image.src = imageURI;
          console.log("打出image.src:"+image.src);
          console.log("照片拍摄成功");
        }
        function onFail(message) {
          alert('Failed because: ' + message);
        }
      },
      //上传本地相册图片，单个文件，可以传视频文件
      takefromgalery() {
        let _this=this;
        var cameraOptions = {
          quality: 50, //图片质量  0-100
          /*  targetWidth : 100,  //照片宽度
            targetHeight : 100,  //照片高度*/
          saveToPhotoAlbum : true,  //保存到手机相册
          sourceType: Camera.PictureSourceType.CAMERA,
          encodingType:Camera.EncodingType.JPEG,  //保存的图片格式： JPEG = 0, PNG = 1
          allowEdit : false,      //选择之前允许修改截图
          destinationType: navigator.camera.DestinationType.FILE_URI
        };
        console.log("调用相册接口");
        navigator.camera.getPicture(onSuccess, onFail, cameraOptions);
        function onSuccess(imageURI) {
          console.log("打出log:"+imageURI);
          var image = document.getElementById('myImage');
          console.log("打出image.src:"+image.src);
          image.src = imageURI;
          console.log("照片选择成功");
          console.log("打出image.src:"+image.src);
          _this.uploadFile(imageURI);
        }
        function onFail(message) {
          alert('onFail because: ' + message);
        }
      },
      uploadFile(filekey) {
        let _this=this;
        console.log("进入上传方法")
        console.log("进入上传附件方法")
        console.log("输出filekey:"+filekey);
        var fileURL=filekey;
        console.log("fileURL的地址:"+fileURL);
        /* var fileURL = "///storage/emulated/0/DCIM/Camera/VID_20181101_184537.mp4"//模拟本地的文件*/
        var uri = encodeURI("http://ss6.rizhaosteel.com:8088/UpLoadPicture.aspx");
        var options=new FileUploadOptions();
        options.fileKey='file';
        options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
        /*  options.mimeType = "text/plain";*/
        options.params=_this.param;//存储上传文件的唯一标识，多个图片公用，循环调用
        var headers={'headerParam':'headerValue'};
        options.headers=headers;
        var ft=new FileTransfer();
        console.log("已创建FileTransfer对象");
        ft.upload(fileURL,uri,onSuccess,onError,options);
        function onSuccess(r) {
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);
          console.log("上传成功");
        }
        function onError(error) {
          console.log("An error has occurred: Code = " + error.code);
          console.log("upload error source " + error.source);
          console.log("upload error target " + error.target);
          console.log("上传失败");
        }
      },
      //批量选择本地图片库
      Batchupload(){
        let _this=this;
        window.imagePicker.getPictures(
          function(results) {
            for (var i = 0; i < results.length; i++) {
              console.log('输出第'+i+'个照片路径'+'Image URI: ' + results[i]);
              _this.photovalue.push({photopath:results[i]});
              console.log("开始调用上传方法");
              _this.uploadFile(results[i]);//选择图片后重复上传
            }
            alert("上传结束");
          }, function (error) {
            alert("上传Error: " + error);
          }, {
            maximumImagesCount: 21,
            width: 800
          }
        );
      }
    },
    activated() {
      this.init();
    }
  }

</script>

<style scoped>
  #myImage{
    width:100%;
    height: 100%;
  }
</style>
