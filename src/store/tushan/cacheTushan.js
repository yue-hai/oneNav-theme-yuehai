// 从 Pinia 库中引入 defineStore 函数，用于创建一个 store
import { defineStore } from 'pinia'

/**
 * 定义一个名为 cacheTushan 的 store
 * 这个 store 将用于管理与用户认证相关的状态和操作
 * cacheTushanStore 是一个 store 的实例，可以通过 useStore('cacheTushanStore') 来获取
 */
export const cacheTushanStore = defineStore('cacheTushan', {
    /**
     * 用于持久化存储状态
     */
    persist: {
        // 启用持久化存储，默认会将 store 中的所有状态持存储在 localstorage 中
        enabled: true,
        /**
         * 指定持久化存储的方式，可以是 localStorage 或 sessionStorage
         * localStorage 和 sessionStorage 的区别：
         *  - localStorage：数据会永久存储，除非用户手动删除
         *  - sessionStorage：数据只会在当前会话中有效，关闭页面或浏览器后会被清除
         */
        storage: localStorage
    },
    /**
     * state 是一个函数，返回 store 的初始状态
     * 在这里可以定义所有状态变量
     */
    state: () => {
        return {
            // 选择的搜索引擎，默认为 bing
            cacheSearchEngine: "bing",
        }
    },
    /**
     * actions 是一个对象，其中包含能够修改状态的方法
     * 在这里定义的方法将用来修改相关的状态
     */
    actions: {},
    /**
     * getters 是一个对象，其中包含能够获取状态的方法
     * 在这里定义的方法将用来获取相关的状态
     */
    getters: {}
});

