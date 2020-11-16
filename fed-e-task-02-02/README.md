# 简答题

## Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

构建主要流程

1. 使用loader编译模块代码
   1. 编译js
      1. babel-loader 编译es6789代码
      2. ts-loader 编译ts
   2. 编译css
      1. scss-loader 编译scss
      2. style-loader 将编译好的css代码插入到html中
   3. 编译图片、字体文件
      1. file-loader 修正文件引入路径为打包后的路径
      2. url-loader 将小图片转为话base64减少网络请求
2. 使用插件提高效率
   1. htmlWebpackPlugin 用于自动生成html模板
      1. 可生成多个html模板
      2. 自动引入打包后的文件
   2. webpack-clean-plugin
      1. 清空目录
   3. 使用definedPlugin向客户端侧注入变量
3. 开发环境
   1. 启动devServer开发调试
      1. 使用proxy代理解决跨域问题
   2. HRM提高开发效率
      1. css可以自动
   3. 压缩代码
      1. optimization
   4. 开启sourceMap提高调试效率
      1. 开发环境推荐：cheap-module-source-map
      2. 生产环境推荐：none、nosource-source-map
4. 生产环境优化
   1. tree-shaking删除无用代码
   2. code-split代码分割打包
   3. happyPack多进程打包
   4. 增加hash文件前缀避免浏览器缓存旧文件
   5. 动态导入，实现模块按需加载
5. 代码标准规范
   1. eslint
   2. style-lint
   3. prettier
   4. husky
   5. lint-stage

## Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路

### loader

loader本质是一个函数，用于处理用户输入，像node中的转换流，将输入的文件数据，经过转换生成webpack可以识别的js代码片段。

用来编译各种类型的模块资源文件

### loader开发思路

- 每个loader都是一个函数，即对资源的处理过程
- 输入是加载资源的内容，输入是loader的处理结果
- 因为webpack 最后会把处理的结果包装入js模块中，要求最后的处理结果是一段js代码，可以自己实现，也可以使用其他loader接管处理
- 导出一段js模块字符串代码

### plugin

plugin是一个函数或者一个拥有apply方法的对象

可以拿到webpack构建过程中的生命周期钩子，在合适的时机做合适的事，如在构建前清空dist目录，在打包后自动生成html，并在html中引入打包后的资源

loader 只作用代码的编译阶段，plugin可以用作用于webpack构建的任何阶段，plugin功能更加强大

### plugin开发思路

- plugin是一个函数或者一个拥有apply方法的对象
- webpack 为开发插件预留了钩子
- 在apply方法中提供了一个compiler对象，通过这个对象可以拿到构建过程中各个声明周期钩子
- 在钩子函数中，又可以拿到当前构建阶段的资源内容
- 我们可以在此处，对内容进行拦截处理

## 编程题思路

1. 首先不考虑框架因素，使用webpack构建项目，有一些共性的操作，如下：
   - 构建基本文件资源
     - js
     - css
     - html
     - 图片、字体资源
   - 使用devServer启动开发环境
     - 使用proxy代理解决跨域问题
   - 根据开发、生产环境拆分webpack配置文件
   - 使用常用插件执行常用操作
     - 构建前清空输出目录
 2. 拷贝课件资源中代码（未来将会成为自己webpack构建模板）完成上述基础构建
 3. 执行开发环境webpack配置发现跑不起来，报错 `: Cannot find module '@vue/cli-plugin-babel/preset' from '/Users/bytednace/Desktop/private/lg/fed-e-task-02-02/code/vue-app-base'`
 4. 报错找不到编译vue相关的babel既然未找到，那就手动安装一下 `@vue/cli-plugin-babel`
 5. 安装完毕后，继续跑，报错无法解析less文件中的 @语法，看来是无法解析less文件，跟着报错指引，来到webpack官网，找到loaders页面，搜索less关键字，找到less-loader，安装！安装完毕后，根据less-loader的文档，配置webpack-common-js 配置
 6. 继续启动开发环境配置，报错

```js
`You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <template>
|   <div id="app">
|     <img alt="Vue logo" src="./assets/logo.png">
 @ ./src/main.js 2:0-28 7:13-16
```

大概意思是说，无法.vue文件类型资源，回到webpack官网找，发现找不到vue相关资源，谷歌后，发现需要安装vue-loader，按照资料操作，配置vue-loader后，执行，报错 `[vue-loader] vue-template-compiler must be installed as a peer dependency, or a compatible compiler implementation must be passed via options.`
7. 看上去需要安装另外的编译模块 vue-template-compiler ，安装完后，执行，报错 `vue-loader was used without the corresponding plugin. Make sure to include VueLoaderPlugin in your webpack config.`
8. 使用VueLoaderPlugin插件，并使用 再次报错  ，无法解析 vue文件<style> 标签下的样式，找资料找到vue官网继续 https://vue-loader.vuejs.org/guide/#manual-setup  
9. 至此打包成功
10. 但是此时运行开发环境 报错 Cannot convert undefined or null to object   /core-js/internals/set-to-string-tag.js
11. 谷歌资料，为babel-loader 配置如下，解决报错

```js
 exclude : [
         /\bcore-js\b/,
          /\bwebpack\/buildin\b/
      ],
```

