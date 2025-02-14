# Vue 3 + Vite

# 一、命令

1. 安装依赖

```shell
npm install
```

2. 启动项目

```shell
npm run dev
```

3. 打包项目

```shell
npm run build
```

# 二、依赖：

1. 常用依赖
   1. less 是一种动态样式语言，可以方便地为网页增加复杂的样式
   2. vue-router 是 Vue.js 官方的路由管理器，适用于 Vue.js 应用程序的路由
   3. pinia 是一个用于 Vue 3 的状态管理库，它使用 Vue 3 的响应式系统来管理状态
   4. pinia-plugin-persist 是一个用于 pinia 的插件，用于在浏览器中持久化 pinia 的状态，以便在刷新页面后恢复状态；其本质是将状态存储在 localStorage 中
   5. axios 是一个基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中

```shell
npm install less-loader vue-router@4 pinia pinia-plugin-persist axios
```



