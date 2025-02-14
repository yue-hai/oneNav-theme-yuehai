/**
 * 从 vue-router 库中导入 createRouter 和 createWebHashHistory 方法
 * createRouter 用于创建路由实例，createWebHashHistory 用于创建 hash 模式的路由历史
 */
import { createRouter, createWebHashHistory } from 'vue-router'
// 从指定的路径导入其他路由文件，这些路由配置将被合并到主路由配置中
import home from "@/router/home/home.js";

// 创建并导出一个新的路由实例
export default createRouter({
    // 使用 hash 模式的路由历史；hash 模式使用 URL 中的 hash 部分（#）来作为路由地址
    history: createWebHashHistory(),
    // 定义路由规则；通过展开运算符 ... 将导入的路由合并到当前的路由配置中
    routes: [
        ...home,
    ]
})
