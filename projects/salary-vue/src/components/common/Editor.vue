<template>
  <div id="wangeditor" ref="editorElem" placeholder="请输入"></div>
</template>

<script>
import E from "wangeditor"
export default {
  name: "editorElem",
  data() {
    return {
      editor: null,
      editorContent: ""
    }
  },
  props: ["catchData", "content"], //接收父组件的方法
  watch: {
    content() {
      this.editor.txt.html(this.content)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editorElem)
    this.editor.customConfig.onchange = html => {
      this.editorContent = html
      this.catchData(this.editorContent) //把这个html通过catchData的方法传入父组件
    }
    this.editor.customConfig.uploadImgServer = process.env.VUE_APP_DOMAIN_download + "/oss/upload"
    this.editor.customConfig.uploadFileName = "file"
    this.editor.customConfig.menus = [
      //菜单配置
      "head", //标题
      "bold", //粗体
      "fontSize", //字号
      "fontName", //字体
      "italic", //斜体
      "underline", //下划线
      "strikeThrough", //删除线
      "foreColor", //文字颜色
      "backColor", //背景颜色
      "link", //插入链接
      "list", //列表
      "justify", //对齐方式
      "quote", //引用
      //"emoticon", //表情
      "image", //插入图片
      "table", //表格
      "code", //插入代码
      "undo", //撤销
      "redo" //重复
    ]
    //下面是最重要的方法
    this.editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
        console.log(xhr)
        console.log(editor)
        console.log(files)
        //图片上传之前触发
        //xhr是XMLHttpRequest对象，editor是编辑器对象，files是选择的图片文件
        //如果返回的结果是{prevent:true,msg:'xxxx'}则表示用户放弃上传
        // return{
        //     prevent:true,
        //     msg:'放弃上传'
        // }
      },
      success: function (xhr, editor, result) {
        //图片上传并返回结果，图片插入成功之后触发
        //xhr是XMLHttpRequest对象，editor是编辑器对象，result是服务器端返回的结果
        this.imgUrl = Object.values(result.data).toString()
      },
      fail: function (xhr, editor, result) {
        //图片上传并返回结果，但图片插入错误之后触发
        //xhr是XMLHttpRequest对象，editor是编辑器对象，result是服务器端返回的结果
      },
      error: function (xhr, editor) {
        //图片上传出错时触发
        //xhr是XMLHttpRequest对象，editor是编辑器对象
      },
      timeout: function (xhr, editor) {
        //图片上传超时时触发
        //xhr是XMLHttpRequest对象，editor是编辑器对象
      },
      //如果服务端返回的不是{errno:0,data:{...}}这种格式，可使用该配置
      //但是，服务端返回的必须是一个JSON格式字符串！！！否则会报错
      customInsert: function (insertImg, result, editor) {
        //图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        //insertImg是插入图片的函数，editor是编辑器对象，result是富文本图片插入后服务器端上传图片返回的json结果
        //举例：假如上传图片成功后，服务端返回的是{url:'...'}这种格式，即可这样插入图片：let url = Object.values(result.data) result.data就是图片插入成功服务端返回的信息对象 Object.values把值转成数组 批量插入图才会用到
        let url = process.env.VUE_APP_DOMAIN_download + "/oss/download?view=true&key=" + result.data //这里是单个插入显示图片,这里的result.data是一个img code码
        JSON.stringify(url) //在这里转成json string格式
        insertImg(url)
      }
    }
    this.editor.create() //创建富文本实例
    // if (!this.content) {
    //   this.editor.txt.html("<p>请输入案件详情</p>")
    // }
  }
}
</script>

<style>
#wangeditor .w-e-text-container {
  height: 360px !important;
}
</style>

<style scoped>
#wangeditor {
  flex: 1;
}
</style>


