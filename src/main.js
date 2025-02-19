// 从 vue 导入 createApp 方法，用于创建 Vue 应用实例
import { createApp } from 'vue'
// 从当前目录下的 App.vue 文件导入根组件 App
import App from '@/App.vue'

// 从 axios 库导入 axios，用于进行 HTTP 请求
import axios from 'axios'
// 从 mitt 库导入 mitt，它是一个轻量级的事件总线，用于在不同组件之间传递事件
import mitt from 'mitt'

// 从自定义的 router 配置文件中导入路由实例
import router from '@/router'
// 从自定义的 store 配置文件中导入 Pinia 实例
import pinia from '@/store'

// 创建 Vue 应用实例，并传入根组件 App
createApp(App)
    // 使用路由插件，添加路由功能
    .use(router)
    // 使用 Pinia 插件，启用状态管理
    .use(pinia)
    // 使用 provide 方法将 axios 注入到全局，所有组件都可以通过 this.$axios 访问 axios 实例
    .provide("$axios", axios)
    // 使用 provide 方法将 mitt 事件总线注入到全局，所有组件都可以通过 this.$mitt 访问 mitt 实例
    .provide('$mitt', new mitt())
    // 将应用实例挂载到页面上 id 为 app 的 DOM 元素上
    .mount('#app')
