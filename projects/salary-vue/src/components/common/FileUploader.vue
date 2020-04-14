<template>
  <div>
    <uploader
      :options="options"
      :file-status-text="statusText"
      :autoStart="false"
      class="uploader-example"
      :style="{width:width+'px'}"
      ref="uploader"
      @file-added="onFileAdded"
      @file-progress="onFileProgress"
      @file-success="onFileSuccess"
      @file-error="onFileError"
    >
      <uploader-unsupport>不支持 HTML5 File API</uploader-unsupport>
      <uploader-drop>
        <p>拖动文件到此处上传(上传文件目前只支持webm,ogv格式视频)</p>
        <uploader-btn :attrs="video_attrs" :single="true">选择视频</uploader-btn>
      </uploader-drop>
      <uploader-list ref="uploader_list"></uploader-list>
    </uploader>
  </div>
</template>

<script>
import Vue from "vue" //下面Vue.use会用到在加载插件上
import SparkMD5 from "spark-md5"
import uploader from "vue-simple-uploader" //vue-simple-uploader 分片上传大文件vue组件,如几个G的视频文件
import { POST, GET } from "http/custom.js"
import qs from "qs"
Vue.use(uploader) //插件使用

export default {
  name: "FileUploader",
  props: {
    width: {
      //宽度
      type: String,
      required: true,
      default: () => {
        return "500"
      }
    },
    changVName: {
      type: Function
    }
  },
  data() {
    return {
      options: {
        target: `${process.env.VUE_APP_DOMAIN_download}/oss/chunk`, // 目标上传 URL
        testChunks: true, //是否开启服务器分片校验,分片上传基础
        simultaneousUploads: 5, //并发上传数,默认 3
        fileParameterName: "file", //上传文件时文件的参数名，默认file
        maxChunkRetries: 3, //最大自动失败重试上传次数
        chunkSize: 20 * 1024 * 1024, //文件切片大小
        singleFile: true, //单文件上传。覆盖式，如果选择了多个会把之前的取消掉。默认 false。
        query: { fileMd5: "" } //其他额外的参数，这个可以是一个对象或者是一个函数，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式，默认为 {}。
        // headers: {}, //额外的一些请求头，如果是函数的话，则会传入 Uploader.File 实例、当前块 Uploader.Chunk 以及是否是测试模式，默认 {}。
        // withCredentials: false //标准的 CORS 请求是不会带上 cookie 的，如果想要带的话需要设置 withCredentials 为 true，默认 false。
      },
      video_attrs: {
        // accept: "video/*"
        accept: [".webm", ".ogv"]
      },
      statusText: {
        success: "等待合并",
        error: "出错了",
        uploading: "上传中",
        paused: "暂停中",
        waiting: "等待中"
      },
      videoId: null, //视频上传成功id
      videoName: "", //视频name
      location: "", //上传视频成功后,后端返回的视频路径
      vloading: "", //视频上传时全屏loading的句柄
      fileMd5: null //根据当前时间生成md5值
    }
  },
  methods: {
    // 下面的方法是按时间顺序执行的
    // 开始上传文件
    onFileAdded(file) {
      this.fileMd5 = SparkMD5.hash(file.size + file.name) //根据文件大小与名字生成md5值
      this.options = { ...this.options, ...{ query: { fileMd5: this.fileMd5 } } } //赋值给query，使得每次分片上传也会带上fileMd5,因为初始化后query就已经带给uploader组件了，其实这样后期赋值已经对query不生效了
      this.uploader.opts.query.fileMd5 = this.fileMd5 //这样强制用$refs来赋值query才生效
      let initChunkObj = {
        fileMd5: this.fileMd5, //md5值
        fileSize: file.size, //文件大小
        fileName: file.name //文件名字
      }
      console.log("开始上传文件", file)
      if (initChunkObj.fileSize > 5 * 1024 * 1024 * 1024) {
        //限制不超过2g大小
        this.$message({ message: "上传的文件不能超过5GB", type: "warning" })
        this.uploader.cancel() //清空上传列表
        return false
      }
      if (/ogg/gi.test(file.fileType) || /webm/gi.test(file.fileType)) {
        //对接云盘初始化接口
        GET(`${process.env.VUE_APP_DOMAIN_download}/oss/initChunk`, initChunkObj)
          .then(res => {
            console.log("initChunk", res)
            this.$message({ message: "点击开始图标以分片上传文件！", type: "info" })
          })
          .catch(error => {
            console.log("error", error)
          })
      } else {
        this.$message({ message: "您上传的文件类型不正确，请上传ogv或者webm后缀视频文件", type: "error" })
        this.uploader.cancel() //清空上传列表
        return false
      }
    },
    // 上传进度
    onFileProgress(rootFile, file, chunk) {
      this.vloading = this.$loading({
        //上传视频，锁定页面loading
        lock: true,
        text: "正在分片上传视频文件，时间可能有点久，中途请不要刷新页面，请耐心等待！",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      })
      console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    // 上传成功
    onFileSuccess(rootFile, file) {
      //上传成功后告诉后端合并视频
      let _this = this
      POST(
        `${process.env.VUE_APP_DOMAIN_download}/oss/mergeFile`,
        qs.stringify({
          filename: file.name, //文件名
          identifier: file.uniqueIdentifier, //文件唯一标志 可以加md5的
          totalSize: file.size, //文件总大小
          type: file.fileType, //文件类型
          fileMd5: this.fileMd5 //md5值
        })
      )
        .then(function(res) {
          _this.statusText.success = "上传成功"
          _this.videoId = res.data.id //上传成功视频id
          _this.videoName = res.data.filename //上传成功视频id
          if (_this.changVName) {
            _this.changVName(res.data.filename, res.data.location)
          }
          _this.location = res.data.location //视频路径
          _this.vloading.close() //关闭全屏loading
          _this.$message({ message: "上传成功！", type: "success" })
          console.log("fileComplete", res)
        })
        .catch(function(error) {
          _this.statusText.success = "合并失败"
          _this.vloading.close() //关闭全屏loading
          _this.$message({ message: "合并失败！", type: "error" })
          console.log("error", error)
        })
    },
    //上传失败
    onFileError(rootFile, file, response) {
      this.statusText.success = "上传失败"
      this.vloading.close() //关闭全屏loading
      this.$message({
        message: response,
        type: "error"
      })
      console.log("onFileError", response)
    }
  },
  computed: {
    // Uploader实例
    // 在 uploader 组件上会有 uploader 属性 指向的就是 Uploader 实例
    // this.$refs.uploader.uploader.cancel() 用于清空上传文件显示的列表
    uploader() {
      return this.$refs.uploader.uploader
    }
  }
}
</script>

<style>
.uploader-example {
  padding: 15px;
  /* margin: 40px auto 0; */
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