<template>
  <div class="attachments-area"
       v-if="(attachmentsInfo.attchments && attachmentsInfo.attchments!='') || (attachmentsInfo.attchment && attachmentsInfo.attchment!='')">
    <div class="procedureRecord margin-bottom-10">
      <span><label class="margin-left-5">附件区</label></span>
    </div>
    <div v-for="(item,index) in attachmentsInfo.attchment" class="attachment">
      <div class="attachment-name">{{item.attachmentName + ' 附件大小:' + (item.attachmentSize/(1024)).toFixed(2)}}(Kb)
      </div>
      <div>
        <div class="attachment-download"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'down',item.attachmentSize)">下载
        </div>
        <div class="attachment-preview" v-if="allowDownOrView(item.attachmentType)"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'view',item.attachmentSize)">预览
        </div>
      </div>
    </div>

    <div v-for="(item,index) in attachmentsInfo.attchments" class="attachment">
      <div class="attachment-name">{{item.attachmentName + ' 附件大小:' + (item.attachmentSize/(1024)).toFixed(2)}}(Kb)
      </div>
      <div v-if="detailsPage == '信息发布中心'">
        <div v-if="siteListId != 'I000'" class="attachment-download"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'down',item.attachmentSize)">下载
        </div>
        <div class="attachment-preview" v-if="allowDownOrView(item.attachmentType)"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'view',item.attachmentSize)">预览
        </div>
      </div>
      <div v-else>
        <div class="attachment-download"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'down',item.attachmentSize)">下载
        </div>
        <div class="attachment-preview" v-if="allowDownOrView(item.attachmentType)"
             @click="downloadOrPreview(item.attachmentUrl,item.attachmentName,'view',item.attachmentSize)">预览
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import interfaceService from '../../service/interfaceService.js'
  import {MessageBox} from 'mint-ui';

  export default {
    name: "attachments-area",
    props: {
      attachmentsInfo: {type: Object},
      detailsPage: {type: String},
      siteListId: {type: String}
    },
    data() {
      return {
        paramsAttachments: {
          "attachmentUrl": "",
          "filename": "",
          "userId": "",
          "type": ""
        },
        allowType: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'] //允许下载或预览的类型
      }
    },
    methods: {
      //下载或预览附件
      downloadOrPreview(attachmentUrl, filename, type, attachmentSize) {
        let that = this;
        this.paramsAttachments.attachmentUrl = attachmentUrl;
        this.paramsAttachments.filename = filename;
        this.paramsAttachments.userId = interfaceService.getCookie("Token");
        this.paramsAttachments.type = type;
        let operationType = (type === 'down' ? '下载' : '预览');//操作类型
        //判断文件是否超过2M,是则提示在Wi-Fi环境下进行，否则，直接下载或预览
        if (attachmentSize > 2 * 1024 * 1024) {
          MessageBox({
            title: '友情提示',
            message: '文件超过2M,建议在WI-FI环境下' + operationType + '！是否进行' + operationType + '？',
            confirmButtonText: '确认' + operationType,
            cancelButtonText: '取消' + operationType,
            showCancelButton: true,
            closeOnClickModal: false
          }).then(action => {
            if (action === 'confirm') {
              //确认下载
              that.getAttachmentUrl(that.paramsAttachments, type, filename);
            }
          });
        } else {
          //下载或预览
          that.getAttachmentUrl(that.paramsAttachments, type, filename);
        }
      },
      //请求附件下载或预览地址
      getAttachmentUrl(params, type, filename) {
        let that = this;
        that.showIndicator("加载中...");
        interfaceService.queryAttachments(params).then(function (response) {
          that.hideIndicator();
          //code等于0则转换成功，进行下载或预览，否则提示用户错误信息
          if (response.code === '0') {
            if (type === 'down') {//下载
              if (that.is_weixin()) {
                //微信下载
                window.location.href = response.downurl;
              } else if (that.is_pc()) {
                //pc端下载
                window.open(response.downurl)
              } else {
                //app下载
              }
              that.InappDownload(response.downurl, response.fileext, filename);
            } else if (type === 'view') {//预览
              if (that.is_weixin()) {
                //微信预览
                window.location.href = response.viewurl;
              } else if (that.is_pc()) {
                //pc端预览
                window.open(response.viewurl)
              } else {
                //app预览
                that.InappPreview(response.viewurl);
              }
            }
          } else {
            that.showAlert(response.desc);
          }
        }, function (error) {
          that.hideIndicator();
          that.showAlert("数据加载失败");
        })
      },

      //允许下载或预览的格式
      allowDownOrView(attachmentType) {
        for (let i = 0; i < this.allowType.length; i++) {
          if (attachmentType === this.allowType[i]) {
            return true
          }
        }
        return false;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
