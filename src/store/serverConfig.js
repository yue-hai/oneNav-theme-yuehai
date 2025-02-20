// 从 Pinia 库中引入 defineStore 函数，用于创建一个 store
import { defineStore } from 'pinia'

/**
 * 定义一个名为 auth 的 store
 * 这个 store 将用于管理与用户认证相关的状态和操作
 * authStore 是一个 store 的实例，可以通过 useStore('auth') 来获取
 */
export const serverConfig = defineStore('serverConfig', {
    /**
     * 用于持久化存储状态
     */
    persist: {
        // 启用持久化存储，默认会将 store 中的所有状态持存储在 localstorage 中
        enabled: true,
        // 指定持久化存储的方式，可以是 localStorage 或 sessionStorage
        storage: sessionStorage
    },
    /**
     * state 是一个函数，返回 store 的初始状态
     * 在这里可以定义与认证相关的所有状态变量
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
     * 在这里定义的方法将用来处理诸如登录、注销等与认证相关的逻辑
     */
    actions: {},
    /**
     * getters 是一个对象，其中包含能够获取状态的方法
     * 在这里定义的方法将用来获取与认证相关的状态
     */
    getters: {}
});

