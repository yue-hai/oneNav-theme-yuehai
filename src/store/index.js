/**
 * 从 pinia 库导入 createPinia 方法，用于创建 Pinia 状态管理库
 * createPinia 方法创建一个 Pinia 实例，用于管理全局状态
 */
import { createPinia } from "pinia"
// 导入 pinia-plugin-persist 插件，用于持久化存储状态
import piniaPersist from 'pinia-plugin-persist'

// 创建pinia实例
const pinia = createPinia()
// 使用 pinia-plugin-persist 插件，启用持久化存储功能
pinia.use(piniaPersist)

// 导出 pinia 用于 main.js 注册
export default pinia