// 从 Pinia 库中引入 defineStore 函数，用于创建一个 store
import { defineStore } from 'pinia'
// 引入 vue3 的响应式 API
import { markRaw } from "vue";

// 引入 ErrorTip 错误提示组件
import ErrorTip from "@/components/common/ErrorTip.vue";

// 引入 BaseInputForm 基础输入表单组件
import BaseInputForm from "@/components/common/BaseInputForm.vue";

/**
 * 定义一个名为 popupMethod 的 store
 * 这个 store 将用于管理与提示弹窗和蒙版弹窗相关的状态
 * popupMethodStore 是一个 store 的实例，可以通过 import 引入并使用
 */
export const popupMethodStore = defineStore('popupMethod', {
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
                key: "popupMethod",
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
     * 在这里可以定义与认证相关的所有状态变量
     */
    state: () => {
        return {
            // 提示弹窗状态管理对象
            tipPopupStates: {
                // 错误提示；默认不显示
                'error-tip': { component: markRaw(ErrorTip), animation: "tip", visible: false, data: {} },
            },

            // 激活的蒙版弹窗；默认为空
            activeOverlayPopup: null,
            // 创建一个统一的蒙版弹窗状态管理对象
            overlayPopupStates: {
                // 基础输入表单；默认不显示
                'base-input-form': { component: markRaw(BaseInputForm), animation: "form", data: {}, callback: () => {} }
            }
        }
    },
    /**
     * actions 是一个对象，其中包含能够修改状态的方法
     * 在这里定义的方法将用来处理诸如登录、注销等与认证相关的逻辑
     */
    actions: {
        /**
         * 打开提示弹窗的方法
         * @param type 弹窗类型，即 tipPopupStates 中的 key
         * @param data 弹窗数据
         * @param callback 弹窗回调函数
         */
        openTipPopup(type, data = {}, callback = null){
            // 设置提示弹窗的显示状态：显示
            this["tipPopupStates"][type].visible = true;
            // 设置提示弹窗的数据
            this["tipPopupStates"][type].data = data;
            // 设置提示弹窗的回调函数
            if (callback) this["tipPopupStates"][type].callback = callback;
        },
        /**
         * 关闭提示弹窗的方法
         * @param type 弹窗类型，即 tipPopupStates 中的 key
         */
        closeTipPopup(type){
            // 设置提示弹窗的显示状态：隐藏
            this["tipPopupStates"][type].visible = false;
        },

        /**
         * 创建统一的打开蒙版弹窗的方法
         * @param type 弹窗类型，即 overlayPopupStates 中的 key
         * @param data 弹窗数据
         * @param callback 弹窗回调函数
         */
        openOverlayPopup(type, data = {}, callback = null){
            // 设置当前激活的蒙版弹窗
            this["activeOverlayPopup"] = type;
            // 设置蒙版弹窗的数据
            this["overlayPopupStates"][type].data = data;
            // 设置蒙版弹窗的回调函数
            if (callback) this["overlayPopupStates"][type].callback = callback;
        },
        /**
         * 创建统一的关闭蒙版弹窗的方法
         */
        closeOverlayPopup(){
            // 设置当前激活的蒙版弹窗：空，即关闭蒙版弹窗
            this["activeOverlayPopup"] = null;
        },
    },
    /**
     * getters 是一个对象，其中包含能够获取状态的方法
     * 在这里定义的方法将用来获取与认证相关的状态
     */
    getters: {}
})
