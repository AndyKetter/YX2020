<template>
  <div class="videoWrap">
    <video id="video" controls :preload="preload">
      <source :src="videoSrc" />您的浏览器不支持 video 标签。
    </video>
    <img
      v-if="isNew"
      class="retreat"
      :class="{ retreat72: isChrome72, retreat61: isChrome61 }"
      @click="retreat"
      :src="rstImg"
      alt="快退icon"
    />
    <div id="maskVideo" v-if="isNew"></div>
  </div>
</template>

<script>
import { getBrowser } from "untils/browserCheck" //浏览器版本检查
import { POST } from "http/custom.js"

export default {
  name: "yxVideo",
  props: {
    videoSrc: {
      //视频地址
      type: String,
      required: true,
      default: () => {
        return ""
      }
    },
    preload: {
      //meta | metadata是告诉浏览器先获取音频文件开头的数据块，从而足以确定一些基本信息（比如音频的总时长）,auto是让浏览器下载整个文件，以便用户单击播放按钮时就能播放,none是不预先加载视频
      type: String,
      // required: true,
      default: () => {
        return "auto"
      }
    },
    isNew: {
      //是否是新员工,true--代表是新员工,false--代表不是新员工,只有新员工播放视频才需要控制只能快进不能快退
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      isChrome72: true, //是否72版本chrome
      isChrome61: false, //是否61版本chrome
      rstImg: "" //快退icon img
    }
  },
  methods: {
    recordStart() {
      //入职员工一开始播放就算是已学课程
      let video = document.getElementById("video")
      video.addEventListener("play", () => {
        //开始播放
        let classId = this.$route.params.id
        this.recordPlayed(classId, "") //播放完毕给后端记录
      })
    },
    forbidSpeed() {
      //禁止快进，只能后退
      let video = document.getElementById("video")
      // let last = 0
      // video.ontimeupdate = function() {
      //   //当前的播放位置已更改时
      //   let current = video.currentTime
      //   if (current - last > 2) {
      //     video.currentTime = last
      //   } else {
      //     last = current
      //   }
      // }
      //新员工播放完毕请求记录
      video.onended = () => {
        //视频播放完毕事件
        let classId = this.$route.params.id
        this.recordPlayed(classId, "该视频已播放完毕，去播放其它视频吧~") //播放完毕给后端记录
      }
    },
    recordPlayed(classId, msg) {
      //课程观看后调用后端记录接口
      let obj = {
        classId,
        status: 2 //2->课程观看后观看记录添加
      }
      POST(process.env.VUE_APP_DOMAIN_personnel + "/correlationOperation", obj)
        .then(res => {
          if (res.code === 0 && msg !== "") {
            //msg为空表示是入职员工，不信息提示
            this.$message({
              type: "success",
              message: msg
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    retreat() {
      //快退10秒
      let video = document.getElementById("video")
      video.currentTime -= 10 //快退10秒
    }
  },
  mounted() {
    if (this.isNew) {
      //新员工才去限制不能快进只能快退10秒
      this.forbidSpeed()
    } else {
      //入职员工播放视频就记录播放
      this.recordStart()
    }
  },
  created() {
    if (getBrowser() === "chrome61.0") {
      //61,72chrome版本切换不同后退图标
      this.isChrome61 = true
      this.isChrome72 = false
      this.rstImg = require("libs/images/yxCollege/retreat-61.png")
    } else {
      this.rstImg = require("libs/images/yxCollege/retreat-72.png")
    }
  }
}
</script>

<style lang="less" scoped>
// 视频组件样式
.videoWrap {
  position: relative;
  width: 100%;
  #video {
    width: 100%;
  }
  .retreat {
    opacity: 0;
    position: absolute;
    border: 1px solid #fff;
    font-size: 12px;
    padding: 3px;
    cursor: pointer;
    z-index: 99;
    transition: opacity 0.5s;
  }
  .retreat72 {
    //chrome 72内核版本的样式
    width: 18px;
    height: 17px;
    bottom: 47px;
    right: 285px;
    border: 1px solid #fff;
    border-radius: 6px;
  }
  .retreat61 {
    //chrome 61内核版本的样式
    width: 9px;
    height: 8px;
    bottom: 12px;
    right: 57px;
    border: 1px solid #666;
    border-radius: 3px;
  }
  &:hover {
    .retreat {
      opacity: 1;
    }
  }
  #maskVideo {
    height: 40px;
    position: absolute;
    bottom: 0;
    right: 60px;
    width: 90%;
    z-index: 98;
  }
}
</style>


