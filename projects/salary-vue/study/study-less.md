# 学习 less

**_LESS 用法入门_**

本文旨在加深对 LESS 的理解和记忆，供自己开发时参考。

一、 安装和使用 LESS

1.1 安装

使用命令行安装 LESS

```
npm install -g less
```

1.2 使用

less 有多种的使用方法，在这里我向大家介绍最常用的俩种方法。

第一种是直接在浏览器中使用：

- 去下载一个你要的 less.js 脚本；
- 创建一个文件来放置你的样式，比如说 style.less
- 添加下面的代码到你的 HTML 的 <head> 中。

```
<link rel="stylesheet/less" type="text/css" href="styles.less">

<script src="less.js" type="text/javascript"></script>
```

请注意“link”的“rel”属性。你需要在属性值后面使用“/less”，LESS 才起作用。你也需要在“link”样式表后面引入"script"。如果你正在使用“HTML5”语法，我无法想像为什么你不会用呢？你可以少去“type=‘text/css’”和“type='text/javascript'”。

第二种就是在命令行中使用：

```
lessc style.less style.css
```

然后会在项目目录生成 style.css 文件，在 html 中引入即可。如果在编译过程中出现错误，将会在命令行中提示你。

Less 是用 JavaScript 写的，所以需要额外的 Node.js 或者网页浏览器才能够运行它。你可以在你的网站中引入 less.js ，这样在真正的运行环境下它就可以自动编译，但这个过程非常缓慢，所以不建议这么使用。 推荐的方式是提前编译成 CSS 代码并且将一个正常的发展版本备份在线上。当然还有很多可视化的的程序帮助你编译 less 文件，但是在本篇文章中我们将使用 node.js。

二、基本用法

2.1 变量

Less 的一个主要功能就是可以让你像在其它高级语言中一样声明变量，这样你就可以存储你经常使用的任何类型的值 ： 颜色，尺寸，选择器，字体名称和 URL 等。less 的哲学是在可能的情况下重用 CSS 语法。

这里，我们声明了两个变量，一个是背景颜色，一个是文本颜色，它们都是十六进制的值。less 代码如下：

```
@background-color: #ffffff;
@text-color: #1A237E;

.box{
    width: 500px;
    height: 500px;
    background-color: @background-color;
}
p{
    color: @text-color;
}
```

编译后的 css 代码如下：

```
.box {
    width: 500px;
    height: 500px;
    background-color: #ffffff;
}
p {
    color: #1A237E;
}
```

在上面的例子当中，背景颜色是白色，文本颜色是黑色。比方说，现在我们要切换二者的值，也就是黑色的背景和白色的文本，我们只需要修改两个变量的值就可以了，而不是手动的去修改每个值。

2.2 Mixins

Less 允许我们将已有的 class 和 id 的样式应用到另一个不同的选择器上。 下面这个例子可以清楚地说明这一点。

```
#circle{
    background-color: #4CAF50;
    border-radius: 100%;
}

#small-circle{
    width: 50px;
    height: 50px;
    #circle
}

#big-circle{
    width: 100px;
    height: 100px;
    #circle
}
```

转换成 css 代码如下：

```
#circle {
    background-color: #4CAF50;
    border-radius: 100%;
}
#small-circle {
    width: 50px;
    height: 50px;
    background-color: #4CAF50;
    border-radius: 100%;
}
#big-circle {
    width: 100px;
    height: 100px;
    background-color: #4CAF50;
    border-radius: 100%;
}
```

如果你不想 mixin 也以一种规则的形式出现在 CSS 代码中，那么你可以在它的后面加上括号：

```
#circle(){
    background-color: #4CAF50;
    border-radius: 100%;
}

#small-circle{
    width: 50px;
    height: 50px;
    #circle
}

#big-circle{
    width: 100px;
    height: 100px;
    #circle
}
```

此时编译成 CSS :

```
#small-circle {
    width: 50px;
    height: 50px;
    background-color: #4CAF50;
    border-radius: 100%;
}
#big-circle {
    width: 100px;
    height: 100px;
    background-color: #4CAF50;
    border-radius: 100%;
}
```

Mixin 另一个比较酷的功能就是它支持传入参数，下面这个例子就为 circle 传入一个指定宽高的参数，默认是 25px。 这将创建一个 25×25 的小圆和一个 100×100 的大圆。

```
#circle(@size: 25px){
    background-color: #4CAF50;
    border-radius: 100%;
    width: @size;
    height: @size;
}

#small-circle{
    #circle
}

#big-circle{
    #circle(100px)
}
```

转换成 CSS :

```
#small-circle {
    background-color: #4CAF50;
    border-radius: 100%;
    width: 25px;
    height: 25px;
}
#big-circle {
    background-color: #4CAF50;
    border-radius: 100%;
    width: 100px;
    height: 100px;
}
```

2.3 嵌套

嵌套可用于以与页面的 HTML 结构相匹配的方式构造样式表，同时减少了冲突的机会。下面是一个无序列表的例子。

```
ul{
    background-color: #03A9F4;
    padding: 10px;
    list-style: none;
    li{
        background-color: #fff;
        border-radius: 3px;
        margin: 10px 0;
    }
}
```

编译成 CSS 代码：

```
ul {
    background-color: #03A9F4;
    padding: 10px;
    list-style: none;
}
ul li {
    background-color: #fff;
    border-radius: 3px;
    margin: 10px 0;
}
```

就像在其它高级语言中一样， Less 的变量根据范围接受它们的值。如果在指定范围内没有关于变量值的声明， less 会一直往上查找，直至找到离它最近的声明。

回到 CSS 中来，我们的 li 标签将有白色的文本，如果我们在 ul 标签中声明 @text-color 规则。

```
@text-color: #000000;
ul{
    @text-color: #fff;
    background-color: #03A9F4;
    padding: 10px;
    list-style: none;
    li{
        color: @text-color;
        border-radius: 3px;
        margin: 10px 0;
    }
}
```

编译生成的 CSS 代码如下：

```
ul {
    background-color: #03A9F4;
    padding: 10px;
    list-style: none;
}
ul li {
    color: #ffffff;
    border-radius: 3px;
    margin: 10px 0;
}
```

2.4 运算

你可以对数值和颜色进行基本的数学运算。比如说我们想要两个紧邻的 div 标签，第二个标签是第一个标签的两倍宽并且拥有不同的背景色。

```
@div-width: 100px;
@color: #03A9F4;

div{
    height: 50px;
    display: inline-block;
}

#left{
    width: @div-width;
    background-color: @color - 100;
}

#right{
    width: @div-width \* 2;
    background-color: @color;
}
```

编译成 CSS 如下：

```
div {
    height: 50px;
    display: inline-block;
}
#left {
    width: 100px;
    background-color: #004590;
}
#right {
    width: 200px;
    background-color: #03a9f4;
}
```

2.5 函数

Less 中有函数，这让它看起来像一门编程语言了，不是吗？

让我们来看一下 fadeout， 一个降低颜色透明度的函数。

```
@var: #004590;
div{
    height: 50px;
    width: 50px;
    background-color: @var;

    &:hover{
        background-color: fadeout(@var, 50%)
    }
}
```

编译成 CSS 如下所示：

```
div {
    height: 50px;
    width: 50px;
    background-color: #004590;
}
div:hover {
    background-color: rgba(0, 69, 144, 0.5);
}
```

通过上述代码，当我们将鼠标悬浮在 div 上时，就可以获取半透明度的动画效果，这比之前自己手动设置要简单的多了。还有很多有用的函数去操纵颜色，检测图像的大小，甚至将资源作为 data-uri 嵌入样式表。

2.6 作用域（scope）

作用域是程序中的一个标准，LESS 中也是。如果你在你样式表的 root 级声明一个变量，它在整个文档中都是可以调用的。然而，如果你在一个选择器，比如 id 或者 class 中，重新定义了这个变量，那么，它就只能在这个选择器中可用了——当然是重新定义后的新值。

```
@color: #00c; /_ 蓝色 _/

#header {
    @color: #c00; /_ 红色 _/
    border: 1px solid @color; /_ 红色边框 _/
}

#footer {
    border: 1px solid @color; /_蓝色边框 _/
}
```

因为我们在 #header 中重新定义了 color 变量，变量的值将会是不同的而且只会在该选择器中有效。它之前或者之后的所有地方，如果没有被重新定义，都会保持那个原始的值。

2.7 注解

LESS 中允许两种注释写法。标准的 CSS 注释，/_ comment _/，是有效的，而且能够通过处理并正确输出。当行注释，// comment，同样可以用但是不能够通过处理也不能被输出。

2.8 导入

导入也相当符合标准。标准的 @import 'classes.less'; 处理的很好。然而，如果你想要导入其它的 LESS 文件，那么文件的扩展名是可选的，所以 @import ‘classes’; 也是可行的。如果你想要导入一些无需 LESS 处理的内容，你可以使用 .css 扩展 (比如， @import 'reset.css';)。

三、LESS 和 SASS 区别

LESS 和 Sass 之间的主要区别是他们的实现方式不同，LESS 是基于 JavaScript 运行,所以 LESS 是在客户端处理。Sass 是基于 Ruby 的，是在服务器端处理的。很多开发者不选择 LESS 是因为 LESS 输出修改过的 CSS 到浏览器需要依赖于 Javascript 引擎，而 Javascript 引擎需要额外的时间来处理代码。当然在其它方面也是有一点小差别，例如; 在变量上 LESS 使用@，而 Sass 使用\$，同时还有一些作用域上的差别。输出格式上 sass 提供 4 种输出选项：nested, compact, compressed 和 expanded，然而 less 并没有输出设置。。。。。。
