<template>
  <div>
    <uploader
      :options="options"
      :file-status-text="statusText"
      :autoStart="false"
      class="uploader-example"
      ref="uploader"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-success="onFileSuccess"
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
import { POST } from "http/custom.js"
import qs from "qs"
Vue.use(uploader) //插件使用

export default {
  name: "test",
  data() {
    return {
      options: {
        target: "/oss/chunk", // 目标上传 URL
        testChunks: true, //是否开启服务器分片校验,分片上传基础
        simultaneousUploads: 1, //并发上传数,默认 3
        fileParameterName: "file", //上传文件时文件的参数名，默认file
        maxChunkRetries: 3, //最大自动失败重试上传次数
        chunkSize: 20 * 1024 * 1024 //文件切片大小
      },
      image_attrs: {
        accept: "image/*"
      },
      video_attrs: {
        accept: "video/*"
      },
      statusText: {
        success: "等待合并",
        error: "出错了",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中"
      }
    }
  },
  methods: {
    // 下面的方法是按时间顺序执行的
    // 开始上传文件
    onFileAdded(file) {
      console.log("开始上传文件", file)
      this.$message({ message: "点击开始图标以分片上传文件！", type: "info" })
    },
    // 上传进度
    onFileProgress(rootFile, file, chunk) {
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功
    onFileSuccess(rootFile, file) {
      //上传成功后告诉后端合并视频
      let _this = this
      POST(
        "oss/mergeFile",
        qs.stringify({
          filename: file.name, //文件名
          identifier: file.uniqueIdentifier, //文件唯一标志 可以加md5的
          totalSize: file.size, //文件总大小
          type: file.fileType //文件类型
        })
      )
        .then(function(res) {
          _this.statusText.success = "上传成功"
          _this.$message({ message: "上传成功！", type: "success" })
          console.log("fileComplete", res)
        })
        .catch(function(error) {
          _this.statusText.success = "合并失败"
          _this.$message({ message: "合并失败！", type: "error" })
          console.log("error", error)
        })
    },
    //上传失败
    onFileError(rootFile, file, response) {
      this.statusText.success = "上传失败"
      this.$message({
        message: response,
        type: "error"
      })
      console.log("onFileError", response)
    }
  },
  computed: {
    // Uploader实例
    uploader() {
      return this.$refs.uploader.uploader
    }
  }
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