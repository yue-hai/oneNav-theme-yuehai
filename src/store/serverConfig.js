// 从 Pinia 库中引入 defineStore 函数，用于创建一个 store
import { defineStore } from 'pinia'

/**
 * 定义一个名为 serverConfig 的 store
 * 这个 store 将用于管理与用户认证相关的状态和操作
 * serverConfigStore 是一个 store 的实例，可以通过 useStore('serverConfigStore') 来获取
 */
export const serverConfigStore = defineStore('serverConfig', {
    /**
     * 用于持久化存储状态
     */
    persist: {
        // 启用持久化存储，默认会将 store 中的所有状态持存储在 localstorage 中
        enabled: true,
        // 指定持久化存储的策略
        strategies: [
            {
                // 存储时使用的 key
                key: "serverConfig",
                /**
                 * 指定持久化存储的方式，可以是 localStorage 或 sessionStorage
                 * - localStorage：数据将持久化存储在浏览器的 localStorage 中，关闭浏览器后数据仍然存在
                 * - sessionStorage：数据将持久化存储在浏览器的 sessionStorage 中，关闭浏览器后数据将被清除
                 */
                storage: localStorage,
            }
        ]
    },
    /**
     * state 是一个函数，返回 store 的初始状态
     * 在这里可以定义所有状态变量
     */
    state: () => {
        return {
            // apiBaseUrl，API 的基础地址
            apiBaseUrl: '',
            // token，用于验证用户身份
            token: '',
        }
    },
    /**
     * actions 是一个对象，其中包含能够修改状态的方法
     * 在这里定义的方法将用来修改相关的状态
     */
    actions: {
        /**
         * 设置 API 的基础地址、token
         */
        setApiBaseUrlToken(apiBaseUrl, token) {
            // 修改 store 中的 apiBaseUrl 和 token
            this.apiBaseUrl = apiBaseUrl;
            this.token = token;
        },
    },
    /**
     * getters 是一个对象，其中包含能够获取状态的方法
     * 在这里定义的方法将用来获取相关的状态
     */
    getters: {}
});

