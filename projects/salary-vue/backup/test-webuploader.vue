<template>
  <div id="global-uploader">
    <uploader
      :options="options"
      ref="uploader"
      :autoStart="false"
      class="uploader-example"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
    >
      <uploader-unsupport>不支持 HTML5 File API</uploader-unsupport>
      <uploader-drop>
        <p>拖动文件到此处上传</p>
        <uploader-btn :single="true">选择文件</uploader-btn>
        <uploader-btn :attrs="image_attrs">选择图片</uploader-btn>
        <uploader-btn :attrs="video_attrs">选择视频</uploader-btn>
        <uploader-btn :directory="true">选择文件夹</uploader-btn>
      </uploader-drop>
      <uploader-list ref="uploader_list"></uploader-list>
    </uploader>
  </div>
</template>

<script>
import Vue from "vue" //下面Vue.use会用到在加载插件上
import uploader from "vue-simple-uploader" //vue-simple-uploader 分片上传大文件vue组件,如几个G的视频文件
import SparkMD5 from "spark-md5"
Vue.use(uploader) //插件使用
// var notUploadedChunkNumbers_zip = [] // 已经上传过的文件chunkNumber数组
// var isUploaded_zip = false // 文件已经上传成功了

export default {
  name: "webuploader",
  data() {
    /** 配置uploader组件的参数，导入zip文件的参数 */
    let token = localStorage.getItem("token") //设置上传数据文件excel的token
    return {
      options: {
        target: "/auth/commonTrainUploadFile", // 目标上传 URL
        // chunkSize: '2048000',   //分块大小
        chunkSize: 3 * 1024 * 1024, //分块大小
        fileParameterName: "file", //上传文件时文件的参数名，默认file
        maxChunkRetries: 3, //最大自动失败重试上传次数
        testChunks: true, //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          // 在header中添加的验证，请根据实际业务来
          "x-user-token": token
        }
      },
      // attrs: {
      //   image: [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
      //   video: [".mp4", ".rmvb", ".mkv", ".wmv", ".flv"],
      //   document: [".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".tif", ".tiff"]
      // },
      image_attrs: {
        accept: "image/*"
      },
      video_attrs: {
        accept: "video/*"
      },
      statusText: {
        success: "成功了",
        error: "出错了",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中"
      },
      query: {
        key: "mohan"
      }
    }
  },
  computed: {
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader
    }
  },
  methods: {
    // 上传单个文件
    onFileAdded(file) {
      console.log("上传文件开始", file)
      // if (/mp4/gi.test(file.fileType)) {
      if (file.fileType) {
        this.computeMD5(file) // 生成MD5
        this.$message({ message: "上传文件开始", type: "success" })
      } else {
        this.$message({ message: "您上传的文件类型不正确，请上传mp4后缀文件", type: "error" })
        return false
      }
    },
    // 计算MD5值
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader()
      let time = new Date().getTime()
      let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
      let currentChunk = 0
      const chunkSize = 10 * 1024 * 1000
      let chunks = Math.ceil(file.size / chunkSize)
      let spark = new SparkMD5.ArrayBuffer()

      // 文件状态设为"计算MD5"
      // this.statusSet(file.id, 'md5');

      file.pause()

      loadNext()

      fileReader.onload = e => {
        spark.append(e.target.result)
        if (currentChunk < chunks) {
          currentChunk++
          loadNext()
          // 实时展示MD5的计算进度
          // this.$nextTick(() => {
          //     $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
          // })
        } else {
          let md5 = spark.end()
          this.computeMD5Success(md5, file)
          console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`)
        }
      }
      fileReader.onerror = function() {
        this.error(`文件${file.name}读取出错，请检查该文件`)
        file.cancel()
      }
      function loadNext() {
        let start = currentChunk * chunkSize
        let end = start + chunkSize >= file.size ? file.size : start + chunkSize
        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end))
      }
    },
    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params
        }
      })
      file.uniqueIdentifier = md5
      file.resume()
      // this.statusRemove(file.id);
    },
    // 上传进度
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功
    onFileSuccess(rootFile, file, response) {
      // 内部自动调用
      let res = JSON.parse(response)
      console.log("上传成功", res)
      // this.$message({ message: res.message, type: "error" })
      // if (res.status == 200) {
      //   //
      //   if (isUploaded_zip) {
      //     // 不要也可，file.cancel()后就不会onFileSuccess()
      //     this.$message({ message: "该文件已经上传成功过了，不能再上传了哦。", type: "success" })
      //   } else {
      //     this.$message({ message: "上传成功！", type: "success" })
      //     file.cancel()
      //   }
      // } else {
      //   this.$message({ message: res.message, type: "error" })
      // }
    },
    onFileError(rootFile, file, response) {
      console.log("上传失败", response)
      this.$message({
        message: response,
        type: "error"
      })
    }
  },
  created() {}
}
</script>

<style>
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>